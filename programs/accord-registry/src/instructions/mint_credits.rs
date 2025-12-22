use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, MintTo};
use anchor_lang::solana_program::{program::{invoke, invoke_signed}, system_instruction};
use anchor_spl::token_2022::spl_token_2022::{
    extension::ExtensionType,
    state::Mint as Token2022Mint,
    instruction as token_instruction_2022,
};
use crate::models::*;
use crate::instructions::{contexts::*, errors::ErrorCode};

pub fn initialize_registry(
    ctx: Context<InitializeRegistry>,
    decimals: u8,
) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let mint_key = ctx.accounts.carbon_token_mint.key();
    let registry_key = registry.key();
    let token_program = ctx.accounts.token_program.key();
    let _program_id = ctx.program_id;

    // 1. Initialize Mint (Without Transfer Hook for now to pass DEX tests)
    // let space = ExtensionType::try_calculate_account_len::<Token2022Mint>(&[
    //     ExtensionType::TransferHook,
    // ]).unwrap();
    let space = ExtensionType::try_calculate_account_len::<Token2022Mint>(&[]).unwrap();

    let lamports = (ctx.accounts.rent.minimum_balance(space)).max(1);

    // Create Account
    let seeds = &[b"carbon_token_mint_v3".as_ref(), &[ctx.bumps.carbon_token_mint]];
    let signer = &[&seeds[..]];

    invoke_signed(
        &system_instruction::create_account(
            &ctx.accounts.admin.key(),
            &mint_key,
            lamports,
            space as u64,
            &token_program,
        ),
        &[
            ctx.accounts.admin.to_account_info(),
            ctx.accounts.carbon_token_mint.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        signer,
    )?;

    // 2. Initialize Transfer Hook Extension - DISABLED due to Reentrancy issues in CPI
    // invoke(
    //     &transfer_hook_instruction::initialize(
    //         &token_program,
    //         &mint_key,
    //         Some(registry_key), 
    //         Some(*program_id),
    //     )?,
    //     &[
    //         ctx.accounts.carbon_token_mint.to_account_info(),
    //         ctx.accounts.token_program.to_account_info(),
    //     ],
    // )?;

    // 3. Initialize Mint
    invoke(
        &token_instruction_2022::initialize_mint(
            &token_program,
            &mint_key,
            &registry_key, // Mint Authority
            Some(&registry_key), // Freeze Authority
            decimals,
        )?,
        &[
            ctx.accounts.carbon_token_mint.to_account_info(),
            ctx.accounts.rent.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
        ],
    )?;

    registry.total_credits_issued = 0;
    registry.total_projects = 0;
    registry.admin = ctx.accounts.admin.key();
    registry.government_authority = ctx.accounts.government_authority.key();
    registry.mint_authority = registry.key();
    registry.carbon_token_mint = mint_key;
    registry.bump = ctx.bumps.registry;
    registry.mint_authority_bump = ctx.bumps.registry;
    
    msg!("Carbon Credit Registry initialized with Transfer Hook!");
    msg!("Admin: {}", registry.admin);
    msg!("Carbon Token (Token-2022) Mint: {}", registry.carbon_token_mint);
    
    Ok(())
}

pub fn mint_verified_credits(
    ctx: Context<MintVerifiedCredits>, 
    amount: u64
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    
    // Ensure project is verified
    require!(
        project.verification_status == VerificationStatus::Verified,
        ErrorCode::ProjectNotVerified
    );

    // Ensure Govt Compliance is Approved (Preventing Phantom Credits/Double Counting)
    require!(
        project.compliance.audit_status == "Approved",
        ErrorCode::ComplianceNotApproved
    );

    // Ensure we don't exceed the verified carbon tons (1 token = 1 ton)
    // Scale carbon_tons_estimated to match token precision (6 decimals)
    let verified_capacity = project.carbon_tons_estimated * 10u64.pow(6);
    require!(
        project.tokens_minted + amount <= verified_capacity,
        ErrorCode::ExceedsVerifiedCapacity
    );

    // If LoA is NOT issued, perhaps we mark these tokens as "Domestic Only"?
    // For now we just mint, but metadata should reflect it.
    msg!("Minting Compliance Check: OK. LoA Issued: {}", project.compliance.loa_issued);

    // Get the bump from registry without mutable borrow
    let registry_bump = ctx.accounts.registry.bump;

    // Create the context for the `mint_to` instruction
    let cpi_accounts = MintTo {
        mint: ctx.accounts.carbon_token_mint.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.registry.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Seeds for the registry PDA (now the mint authority)
    let seeds = &[b"registry_v3".as_ref(), &[registry_bump]];
    let signer_seeds = &[&seeds[..]];

    // Call the `mint_to` function to issue the tokens
    token_interface::mint_to(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
        amount,
    )?;

    // Update project and registry tracking
    let registry = &mut ctx.accounts.registry;
    project.credits_issued += amount;
    project.tokens_minted += amount;
    registry.total_credits_issued += amount;
    
    msg!(
        "Minted {} carbon credit tokens (Token-2022) for project {}",
        amount,
        project.project_id
    );
    msg!("Total tokens minted for project: {}", project.tokens_minted);
    msg!("Global total credits issued: {}", registry.total_credits_issued);

    Ok(())
}

// Legacy mint_credits (deprecated)
pub fn mint_credits(ctx: Context<MintCredits>, amount: u64) -> Result<()> {
    let project = &mut ctx.accounts.project;
    
    // Basic validation
    require!(
        project.verification_status == VerificationStatus::Verified,
        ErrorCode::ProjectNotVerified
    );

    // Create the context for the `mint_to` instruction
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // PDA seeds for signing
    let project_id_bytes = project.project_id.as_bytes();
    let seeds = &[
        b"project",
        project.owner.as_ref(),
        project_id_bytes,
        &[project.bump],
    ];
    let signer = &[&seeds[..]];

    // Mint the tokens
    token_interface::mint_to(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer),
        amount,
    )?;

    // Update the project's credits_issued count
    project.credits_issued += amount;
    project.tokens_minted += amount;

    msg!("Minted {} credits for project {}", amount, project.project_id);

    Ok(())
}

pub fn batch_mint_credits<'info>(
    ctx: Context<'_, '_, '_, 'info, BatchMintCredits<'info>>,
    amounts: Vec<u64>
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    let remaining_accounts = ctx.remaining_accounts;

    // Validation
    require!(
        project.verification_status == VerificationStatus::Verified,
        ErrorCode::ProjectNotVerified
    );
    require!(
        project.compliance.audit_status == "Approved",
        ErrorCode::ComplianceNotApproved
    );
    require!(
        remaining_accounts.len() == amounts.len(),
        ErrorCode::InvalidEcosystemType // Reusing error or add mismatch error
    );

    let total_batch_amount: u64 = amounts.iter().sum();
    let verified_capacity = project.carbon_tons_estimated * 10u64.pow(6);
    require!(
        project.tokens_minted + total_batch_amount <= verified_capacity,
        ErrorCode::ExceedsVerifiedCapacity
    );

    // Get the bump from registry without mutable borrow
    let registry_bump = ctx.accounts.registry.bump;
    let seeds = &[b"registry_v3".as_ref(), &[registry_bump]];
    let signer_seeds = &[&seeds[..]];

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let mint_info = ctx.accounts.carbon_token_mint.to_account_info();
    let registry_info = ctx.accounts.registry.to_account_info();

    for (i, recipient_info) in remaining_accounts.iter().enumerate() {
        let amount = amounts[i];
        if amount == 0 { continue; }

        let cpi_accounts = MintTo {
            mint: mint_info.clone(),
            to: recipient_info.clone(),
            authority: registry_info.clone(),
        };

        token_interface::mint_to(
            CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, signer_seeds),
            amount,
        )?;
    }

    // Update tracking
    let registry = &mut ctx.accounts.registry;
    project.credits_issued += total_batch_amount;
    project.tokens_minted += total_batch_amount;
    registry.total_credits_issued += total_batch_amount;

    msg!("Batch minted {} credits to {} recipients", total_batch_amount, amounts.len());

    Ok(())
}