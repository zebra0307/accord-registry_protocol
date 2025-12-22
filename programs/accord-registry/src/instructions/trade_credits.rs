use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Burn, MintTo, TransferChecked};
use anchor_lang::solana_program::{
    program::{invoke, invoke_signed},
    system_instruction,
};
use crate::instructions::{contexts::*, errors::ErrorCode};

// Use re-exported spl_token_2022 to match dependency versions
use anchor_spl::token_2022::spl_token_2022::{
    extension::ExtensionType,
    instruction as token_instruction_2022,
};

// ... trade_credits and transfer_credits ...

pub fn trade_credits(_ctx: Context<TradeCredits>, amount: u64) -> Result<()> {
    msg!("Trading {} credits (internal counter)", amount);
    Ok(())
}

pub fn transfer_credits(ctx: Context<TransferCredits>, amount: u64) -> Result<()> {
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.to_account.to_account_info(),
        authority: ctx.accounts.from_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token_interface::transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;

    msg!("Transferred {} credits (Token-2022 Checked).", amount);

    Ok(())
}

pub fn retire_credits(
    ctx: Context<RetireCredits>, 
    amount: u64, 
    retirement_id: String
) -> Result<()> {
    // 1. Burn Carbon Credits
    let cpi_accounts_burn = Burn {
        mint: ctx.accounts.credit_mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    token_interface::burn(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_burn),
        amount,
    )?;

    msg!("Burned {} carbon credits.", amount);

    // 2. Initialize Retirement Certificate Mint (Non-Transferable)
    let space = ExtensionType::try_calculate_account_len::<anchor_spl::token_2022::spl_token_2022::state::Mint>(&[
        ExtensionType::NonTransferable,
    ]).map_err(|_| ErrorCode::InstructionFailed)?;

    let lamports = (ctx.accounts.rent.minimum_balance(space))
        .max(1); 

    let mint_key = ctx.accounts.certificate_mint.key();
    let owner_key = ctx.accounts.owner.key();
    let token_2022_key = ctx.accounts.token_2022_program.key();
    
    let seeds = &[
        b"retirement", 
        owner_key.as_ref(), 
        retirement_id.as_bytes(), 
        &[ctx.bumps.certificate_mint]
    ];
    let signer = &[&seeds[..]];

    // 2.1 Create Account
    invoke_signed(
        &system_instruction::create_account(
            &ctx.accounts.owner.key(),
            &mint_key,
            lamports,
            space as u64,
            &token_2022_key,
        ),
        &[
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.certificate_mint.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        signer,
    ).map_err(|_| ErrorCode::InstructionFailed)?;

    // 2.2 Initialize Non-Transferable Extension
    invoke(
        &token_instruction_2022::initialize_non_transferable_mint(
            &token_2022_key,
            &mint_key,
        ).map_err(|_| ErrorCode::InstructionFailed)?,
        &[
            ctx.accounts.certificate_mint.to_account_info(),
            ctx.accounts.token_2022_program.to_account_info(),
        ],
    ).map_err(|_| ErrorCode::InstructionFailed)?;

    // 2.3 Initialize Mint
    invoke(
        &token_instruction_2022::initialize_mint(
            &token_2022_key,
            &mint_key,
            &owner_key, // Mint Authority
            Some(&owner_key), // Freeze Authority
            0, // Decimals (NFT)
        ).map_err(|_| ErrorCode::InstructionFailed)?,
        &[
            ctx.accounts.certificate_mint.to_account_info(),
            ctx.accounts.rent.to_account_info(), 
            ctx.accounts.token_2022_program.to_account_info(),
        ],
    ).map_err(|_| ErrorCode::InstructionFailed)?;

    // 3. Create ATA for Certificate
    let cpi_accounts_ata = anchor_spl::associated_token::Create {
        payer: ctx.accounts.owner.to_account_info(),
        associated_token: ctx.accounts.certificate_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
        mint: ctx.accounts.certificate_mint.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        token_program: ctx.accounts.token_2022_program.to_account_info(),
    };
    anchor_spl::associated_token::create(
        CpiContext::new(ctx.accounts.associated_token_program.to_account_info(), cpi_accounts_ata)
    )?;

    // 4. Mint 1 Certificate Token
    let cpi_accounts_mint = MintTo {
        mint: ctx.accounts.certificate_mint.to_account_info(),
        to: ctx.accounts.certificate_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    token_interface::mint_to(
        CpiContext::new(ctx.accounts.token_2022_program.to_account_info(), cpi_accounts_mint),
        1,
    )?;

    // 5. Revoke Mint Authority
    let cpi_accounts_set_authority = anchor_spl::token_interface::SetAuthority {
        account_or_mint: ctx.accounts.certificate_mint.to_account_info(),
        current_authority: ctx.accounts.owner.to_account_info(),
    };
    token_interface::set_authority(
        CpiContext::new(
            ctx.accounts.token_2022_program.to_account_info(),
            cpi_accounts_set_authority
        ),
        token_instruction_2022::AuthorityType::MintTokens,
        None,
    )?;

    msg!("Minted Retirement Certificate (Non-Transferable) to {}.", owner_key);

    Ok(())
}