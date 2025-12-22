use anchor_lang::prelude::*;
use anchor_spl::{
    token_interface::{Mint, TokenAccount, TokenInterface},
    associated_token::AssociatedToken,
};
use crate::models::*;
use crate::instructions::errors::ErrorCode;

// Account validation for initialize_registry instruction
#[derive(Accounts)]
#[instruction(_decimals: u8)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + GlobalRegistry::LEN,
        seeds = [b"registry_v3"],
        bump
    )]
    pub registry: Account<'info, GlobalRegistry>,

    /// CHECK: Manual initialization (Transfer Hook)
    #[account(mut, seeds = [b"carbon_token_mint_v3"], bump)]
    pub carbon_token_mint: UncheckedAccount<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: The designated government authority (e.g. ICM)
    pub government_authority: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Account validation for the `register_project` instruction
#[derive(Accounts)]
#[instruction(project_data: ProjectRegistrationData)]
pub struct RegisterProject<'info> {
    #[account(
        init,
        payer = project_owner,
        space = 8 + Project::LEN,
        seeds = [b"project", project_owner.key().as_ref(), project_data.project_id.as_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"registry_v3"],
        bump = registry.bump
    )]
    pub registry: Account<'info, GlobalRegistry>,

    #[account(mut)]
    pub project_owner: Signer<'info>,

    #[account(
        seeds = [b"user", project_owner.key().as_ref()],
        bump = user_account.bump,
        constraint = user_account.is_active @ ErrorCode::UserNotActive,
        constraint = (user_account.permissions & permissions::REGISTER_PROJECT) != 0 @ ErrorCode::InsufficientPermissions
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(
        mut,
        seeds = [b"double_counting_registry"],
        bump = double_counting_registry.bump
    )]
    pub double_counting_registry: Account<'info, DoubleCountingRegistry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeVerification<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump,
        has_one = owner
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: The verifier address attempting to get paid
    pub verifier: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

// Account validation for verify_project instruction
#[derive(Accounts)]
pub struct VerifyProject<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        seeds = [b"registry_v3"],
        bump = registry.bump,
        // has_one = admin // Removed generic admin check to allow validators
    )]
    pub registry: Account<'info, GlobalRegistry>,

    pub admin: Signer<'info>, // This is the verifier/validator

    #[account(
        seeds = [b"user", admin.key().as_ref()],
        bump = admin_account.bump,
        constraint = admin_account.is_active @ ErrorCode::UserNotActive,
        constraint = (admin_account.permissions & permissions::VERIFY_PROJECT) != 0 @ ErrorCode::InsufficientPermissions
    )]
    pub admin_account: Account<'info, UserAccount>,
}

// Account validation for mint_verified_credits instruction
#[derive(Accounts)]
pub struct MintVerifiedCredits<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump,
        has_one = owner
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"registry_v3"],
        bump = registry.bump
    )]
    pub registry: Account<'info, GlobalRegistry>,

    #[account(
        mut,
        seeds = [b"carbon_token_mint_v3"],
        bump
    )]
    pub carbon_token_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = carbon_token_mint,
        associated_token::authority = recipient,
        associated_token::token_program = token_program
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

    pub owner: Signer<'info>,
    pub recipient: SystemAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct BatchMintCredits<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump,
        has_one = owner
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"registry_v3"],
        bump = registry.bump
    )]
    pub registry: Account<'info, GlobalRegistry>,

    #[account(
        mut,
        seeds = [b"carbon_token_mint_v3"],
        bump
    )]
    pub carbon_token_mint: InterfaceAccount<'info, Mint>,

    pub owner: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

// DEPRECATED: Legacy mint_credits account structure
#[derive(Accounts)]
pub struct MintCredits<'info> {
    #[account(mut)]
    /// CHECK: This is the mint account for the token
    pub mint: AccountInfo<'info>,

    #[account(
        mut,
        has_one = owner,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(mut)]
    /// CHECK: This is the recipient token account
    pub recipient_token_account: AccountInfo<'info>,

    /// CHECK: The mint authority is a PDA, so we validate it with seeds.
    #[account(
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub mint_authority: AccountInfo<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

// Accounts for the transfer_credits instruction
#[derive(Accounts)]
pub struct TransferCredits<'info> {
    #[account(mut)]
    /// CHECK: This is the source token account
    pub from_account: AccountInfo<'info>,
    
    #[account(mut)]
    /// CHECK: This is the destination token account
    pub to_account: AccountInfo<'info>,
    
    pub from_authority: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>, // Required for transfer_checked
    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
#[instruction(amount: u64, retirement_id: String)]
pub struct RetireCredits<'info> {
    #[account(mut)]
    pub credit_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        token::mint = credit_mint,
        token::authority = owner
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: Verified by seeds, initialized in instruction
    #[account(
        mut,
        seeds = [b"retirement", owner.key().as_ref(), retirement_id.as_bytes()],
        bump
    )]
    pub certificate_mint: UncheckedAccount<'info>,

    /// CHECK: Initialized in instruction
    #[account(mut)]
    pub certificate_token_account: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub token_2022_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Accounts for trade_credits (placeholder)
#[derive(Accounts)]
pub struct TradeCredits<'info> {
    pub authority: Signer<'info>,
}

// Enhanced account validation contexts for blue carbon features


#[derive(Accounts)]
#[instruction(verifier_data: VerifierData)]
pub struct RegisterVerifier<'info> {
    #[account(
        init,
        payer = verifier_authority,
        space = 8 + 1000,
        seeds = [b"verifier", verifier_authority.key().as_ref()],
        bump
    )]
    pub verifier: Account<'info, VerificationNode>,

    #[account(mut)]
    pub verifier_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MultiPartyVerifyProject<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"verifier", verifier_authority.key().as_ref()],
        bump
    )]
    pub verifier: Account<'info, VerificationNode>,

    pub verifier_authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(project_id: String, timestamp: i64)]
pub struct SubmitMonitoringData<'info> {
    #[account(
        init,
        payer = data_provider,
        space = 8 + 2000,
        seeds = [b"monitoring", project_id.as_bytes(), &timestamp.to_le_bytes()],
        bump
    )]
    pub monitoring_data: Account<'info, MonitoringData>,

    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub data_provider: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(project_id: String)]
pub struct CreateMarketplaceListing<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + CarbonCreditListing::LEN,
        seeds = [b"listing", project_id.as_bytes(), seller.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, CarbonCreditListing>,

    #[account(
        init,
        payer = seller,
        token::mint = credit_mint,
        token::authority = listing,
        token::token_program = token_program,
        seeds = [b"listing_vault", listing.key().as_ref()],
        bump
    )]
    pub listing_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut)]
    pub seller_credit_account: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyMarketplaceListing<'info> {
    #[account(
        mut,
        seeds = [b"listing", listing.project_id.as_bytes(), listing.seller.as_ref()],
        bump
    )]
    pub listing: Account<'info, CarbonCreditListing>,

    #[account(
        mut,
        seeds = [b"listing_vault", listing.key().as_ref()],
        bump
    )]
    pub listing_vault: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: We trust the seed derivation from listing data if we wanted to verify project. But we might not need project account here if listing has all info.
    // Actually, listing.seller is the one who listed.
    // We need seller's quote account to receive payment.
    #[account(mut)]
    pub seller_payment_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub buyer_payment_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_credit_account: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub currency_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct CancelMarketplaceListing<'info> {
    #[account(
        mut,
        seeds = [b"listing", listing.project_id.as_bytes(), seller.key().as_ref()],
        bump,
        close = seller // Rent returns to seller
    )]
    pub listing: Account<'info, CarbonCreditListing>,

    #[account(
        mut,
        seeds = [b"listing_vault", listing.key().as_ref()],
        bump,
        // We will close this in instruction manually or just empty it? 
        // Token accounts typically aren't closed via constraints unless empty?
        // We'll empty it in instruction.
    )]
    pub listing_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut)]
    pub seller_credit_account: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
#[instruction(project_id: String, reporting_period_end: i64)]
pub struct GenerateImpactReport<'info> {
    #[account(
        init,
        payer = report_generator,
        space = 8 + 1500,
        seeds = [b"impact_report", project_id.as_bytes(), &reporting_period_end.to_le_bytes()],
        bump
    )]
    pub impact_report: Account<'info, ImpactReport>,


    #[account(mut)]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub report_generator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// ========================================
// DEX CONTEXTS
// ========================================

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + LiquidityPool::LEN,
        seeds = [b"liquidity_pool", credit_mint.key().as_ref(), quote_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, LiquidityPool>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6, // 6 decimals for LP tokens
        mint::authority = pool,
        mint::token_program = token_program,
        seeds = [b"lp_mint", pool.key().as_ref()],
        bump
    )]
    pub lp_mint: InterfaceAccount<'info, Mint>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub quote_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = credit_mint,
        token::authority = pool,
        token::token_program = token_program,
        seeds = [b"credit_vault", pool.key().as_ref()],
        bump
    )]
    pub credit_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = quote_mint,
        token::authority = pool,
        token::token_program = token_program,
        seeds = [b"quote_vault", pool.key().as_ref()],
        bump
    )]
    pub quote_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(
        mut,
        seeds = [b"liquidity_pool", pool.credit_mint.as_ref(), pool.quote_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,

    #[account(
        mut,
        seeds = [b"lp_mint", pool.key().as_ref()],
        bump
    )]
    pub lp_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [b"credit_vault", pool.key().as_ref()],
        bump
    )]
    pub credit_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"quote_vault", pool.key().as_ref()],
        bump
    )]
    pub quote_vault: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub quote_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub user_credit_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_quote_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = lp_mint,
        associated_token::authority = provider,
        associated_token::token_program = token_program
    )]
    pub user_lp_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub provider: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(
        mut,
        seeds = [b"liquidity_pool", pool.credit_mint.as_ref(), pool.quote_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,

    #[account(
        mut,
        seeds = [b"lp_mint", pool.key().as_ref()],
        bump
    )]
    pub lp_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [b"credit_vault", pool.key().as_ref()],
        bump
    )]
    pub credit_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"quote_vault", pool.key().as_ref()],
        bump
    )]
    pub quote_vault: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub quote_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub user_credit_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_quote_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = lp_mint,
        associated_token::authority = provider,
        associated_token::token_program = token_program
    )]
    pub user_lp_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub provider: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(
        mut,
        seeds = [b"liquidity_pool", pool.credit_mint.as_ref(), pool.quote_mint.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,

    #[account(
        mut,
        seeds = [b"credit_vault", pool.key().as_ref()],
        bump
    )]
    pub credit_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"quote_vault", pool.key().as_ref()],
        bump
    )]
    pub quote_vault: InterfaceAccount<'info, TokenAccount>,

    pub credit_mint: InterfaceAccount<'info, Mint>,
    pub quote_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub user_source_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_destination_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct InitializeDoubleCountingRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = DoubleCountingRegistry::LEN,
        seeds = [b"double_counting_registry"],
        bump
    )]
    pub double_counting_registry: Account<'info, DoubleCountingRegistry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializePlatformStats<'info> {
    #[account(
        init,
        payer = authority,
        space = PlatformStats::LEN,
        seeds = [b"platform_stats"],
        bump
    )]
    pub stats: Account<'info, PlatformStats>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}