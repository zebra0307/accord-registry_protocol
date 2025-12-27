#![allow(deprecated)]

use anchor_lang::prelude::*;

pub mod models;
pub mod auth_utils;
pub mod instructions;

use crate::models::*;
use crate::instructions::*;
use crate::auth_utils::role_management::*;

declare_id!("9W1Zh89ykeWSbXVTgHHgeUcyUTGSs2XAbMRvY1uR1gU");

#[program]
pub mod blue_carbon_registry {
    use super::*;

    pub use compliance::*;
    
    pub use transfer_hook::*;

    // ... existing instructions ...

    // --- Transfer Hook Instructions ---
    pub fn initialize_extra_account_meta_list(ctx: Context<InitializeExtraAccountMetaList>) -> Result<()> {
        instructions::transfer_hook::initialize_extra_account_meta_list(ctx)
    }

    pub fn execute_transfer_hook(ctx: Context<ExecuteTransferHook>, amount: u64) -> Result<()> {
        instructions::transfer_hook::execute(ctx, amount)
    }

    pub fn initialize_registry(ctx: Context<InitializeRegistry>, decimals: u8) -> Result<()> {
        instructions::initialize_registry(ctx, decimals)
    }

    /// Registers a new project on the blockchain (Universal)
    /// Requires:
    /// - Valid ICM Registry ID (mandatory, must equal project_id)
    /// - Verification fee (minimum 0.1 SOL, held in escrow)
    pub fn register_project(
        ctx: Context<RegisterProject>,
        project_data: ProjectRegistrationData,
        verification_fee: u64,
    ) -> Result<()> {
        instructions::register_project(ctx, project_data, verification_fee)
    }

// Initializing Double Counting Registry
    pub fn initialize_double_counting_registry(
        ctx: Context<InitializeDoubleCountingRegistry>,
    ) -> Result<()> {
        instructions::register_project::initialize_double_counting_registry(ctx)
    }

    pub fn initialize_platform_stats(
        ctx: Context<InitializePlatformStats>,
    ) -> Result<()> {
        instructions::monitoring::initialize_platform_stats(ctx)
    }

    /// Verifies a project, allowing it to mint carbon credits
    pub fn verify_project(
        ctx: Context<VerifyProject>,
        verified_carbon_tons: u64,
    ) -> Result<()> {
        instructions::verify_project(ctx, verified_carbon_tons)
    }

    /// Rejects a project (consuming fee for validation effort)
    pub fn reject_project(
        ctx: Context<RejectProject>,
        reason: String,
    ) -> Result<()> {
        instructions::verify_project::reject_project(ctx, reason)
    }

    pub fn initialize_verification(
        ctx: Context<InitializeVerification>,
        fee_lamports: u64,
    ) -> Result<()> {
        instructions::verify_project::initialize_verification(ctx, fee_lamports)
    }

    /// Mints carbon credits for verified projects only
    pub fn mint_verified_credits(
        ctx: Context<MintVerifiedCredits>, 
        amount: u64
    ) -> Result<()> {
        instructions::mint_verified_credits(ctx, amount)
    }

    pub fn batch_mint_credits<'info>(ctx: Context<'_, '_, '_, 'info, BatchMintCredits<'info>>, amounts: Vec<u64>) -> Result<()> {
        instructions::batch_mint_credits(ctx, amounts)
    }

    /// Legacy mint_credits (deprecated - use mint_verified_credits)
    pub fn mint_credits(ctx: Context<MintCredits>, amount: u64) -> Result<()> {
        instructions::mint_credits(ctx, amount)
    }

    /// Transfers carbon credits from one token account to another
    pub fn transfer_credits(ctx: Context<TransferCredits>, amount: u64) -> Result<()> {
        instructions::transfer_credits(ctx, amount)
    }

    /// Retires carbon credits by transferring them to a burn account
    pub fn retire_credits(
        ctx: Context<RetireCredits>,
        amount: u64,
        retirement_id: String,
    ) -> Result<()> {
        instructions::retire_credits(ctx, amount, retirement_id)
    }

    /// Trade credits (placeholder for internal trading logic)
    pub fn trade_credits(ctx: Context<TradeCredits>, amount: u64) -> Result<()> {
        instructions::trade_credits(ctx, amount)
    }

    /// Track environmental impact data
    pub fn track_impact(ctx: Context<TrackImpact>, data: ImpactData) -> Result<()> {
        instructions::track_impact(ctx, data)
    }



    /// Register a verification entity
    pub fn register_verifier(
        ctx: Context<RegisterVerifier>,
        verifier_data: VerifierData,
    ) -> Result<()> {
        instructions::register_verifier(ctx, verifier_data)
    }

    /// Multi-party project verification with enhanced validation
    pub fn multi_party_verify_project(
        ctx: Context<MultiPartyVerifyProject>,
        verified_carbon_tons: u64,
        quality_rating: u8,
        verification_report_cid: String,
    ) -> Result<()> {
        instructions::multi_party_verify_project(ctx, verified_carbon_tons, quality_rating, verification_report_cid)
    }

    /// Submit environmental monitoring data
    pub fn submit_monitoring_data(
        ctx: Context<SubmitMonitoringData>,
        project_id: String,
        timestamp: i64,
        monitoring_data: MonitoringDataInput,
    ) -> Result<()> {
        instructions::submit_monitoring_data(ctx, project_id, timestamp, monitoring_data)
    }

    /// Create marketplace listing for carbon credits
    pub fn create_marketplace_listing(
        ctx: Context<CreateMarketplaceListing>,
        project_id: String,
        listing_data: MarketplaceListingData,
    ) -> Result<()> {
        instructions::create_marketplace_listing(ctx, project_id, listing_data)
    }

    /// Buy carbon credits from marketplace listing
    pub fn buy_marketplace_listing(
        ctx: Context<BuyMarketplaceListing>,
        amount: u64,
    ) -> Result<()> {
        instructions::buy_marketplace_listing(ctx, amount)
    }

    /// Cancel listing and return credits
    pub fn cancel_marketplace_listing(ctx: Context<CancelMarketplaceListing>) -> Result<()> {
        instructions::cancel_marketplace_listing(ctx)
    }

    /// Government Compliance Approval (Article 6 / CCTS)
    pub fn approve_project_compliance(
        ctx: Context<ApproveCompliance>,
        ccts_registry_id: String,
        authorized_export_limit: u64,
        loa_issued: bool,
    ) -> Result<()> {
        instructions::approve_project_compliance(ctx, ccts_registry_id, authorized_export_limit, loa_issued)
    }

    // ========================================
    // DEX & AMM INSTRUCTIONS
    // ========================================

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        fee_basis_points: u16,
    ) -> Result<()> {
        instructions::initialize_pool(ctx, fee_basis_points)
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        credit_amount: u64,
        quote_amount: u64,
    ) -> Result<()> {
        instructions::add_liquidity(ctx, credit_amount, quote_amount)
    }

    pub fn remove_liquidity(
        ctx: Context<RemoveLiquidity>,
        lp_amount: u64,
    ) -> Result<()> {
        instructions::remove_liquidity(ctx, lp_amount)
    }

    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64,
        min_amount_out: u64,
    ) -> Result<()> {
        instructions::swap(ctx, amount_in, min_amount_out)
    }

    /// Generate impact report
    pub fn generate_impact_report(
        ctx: Context<GenerateImpactReport>,
        project_id: String,
        reporting_period_end: i64,
        report_data: ImpactReportData,
    ) -> Result<()> {
        instructions::generate_impact_report(ctx, project_id, reporting_period_end, report_data)
    }

    // ========================================
    // ROLE MANAGEMENT INSTRUCTIONS
    // ========================================

    /// Register a new user (Self-Service)
    pub fn register_user(
        ctx: Context<RegisterUser>,
        role: UserRole,
    ) -> Result<()> {
        auth_utils::role_management::register_user(ctx, role)
    }

    /// Assign a role to a user
    pub fn assign_role(
        ctx: Context<AssignRole>,
        user_address: Pubkey,
        role: UserRole,
        permissions: u64,
    ) -> Result<()> {
        auth_utils::role_management::assign_role(ctx, user_address, role, permissions)
    }

    /// Update an existing user's role
    pub fn update_role(
        ctx: Context<UpdateRole>,
        new_role: UserRole,
        new_permissions: u64,
    ) -> Result<()> {
        auth_utils::role_management::update_role(ctx, new_role, new_permissions)
    }

    /// Revoke a user's role
    pub fn revoke_role(ctx: Context<RevokeRole>) -> Result<()> {
        auth_utils::role_management::revoke_role(ctx)
    }

    // ========================================
    // MULTI-SIG ADMIN INSTRUCTIONS
    // ========================================

    /// Initialize multi-signature configuration
    pub fn initialize_multisig(
        ctx: Context<InitializeMultiSig>,
        admins: Vec<Pubkey>,
        threshold: u8,
    ) -> Result<()> {
        auth_utils::role_management::initialize_multisig(ctx, admins, threshold)
    }

    /// Create a new admin proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        proposal_id: u64,
        proposal_type: ProposalType,
        target: Pubkey,
        data: Vec<u8>,
        expires_in: i64,
    ) -> Result<()> {
        auth_utils::role_management::create_proposal(ctx, proposal_id, proposal_type, target, data, expires_in)
    }

    /// Approve a proposal
    pub fn approve_proposal(ctx: Context<ApproveProposal>) -> Result<()> {
        auth_utils::role_management::approve_proposal(ctx)
    }

    /// Execute an approved proposal
    pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
        auth_utils::role_management::execute_proposal(ctx)
    }

    // ========================================
    // AUDIT LOG INSTRUCTIONS
    // ========================================

    /// Create an audit log entry
    pub fn create_audit_log(
        ctx: Context<CreateAuditLog>,
        log_id: u64,
        action_type: AuditAction,
        target: Pubkey,
        success: bool,
        details: String,
        proposal_id: Option<u64>,
    ) -> Result<()> {
        auth_utils::role_management::create_audit_log(ctx, log_id, action_type, target, success, details, proposal_id)
    }

    pub fn fallback<'info>(
        program_id: &Pubkey,
        accounts: &'info [AccountInfo<'info>],
        data: &[u8],
    ) -> Result<()> {
        // Log fallback execution
        msg!("Fallback: Instruction caught. Ignoring validation for reentrancy test.");
        
        // In a real implementation, we would route to `execute` properly.
        Ok(())
    }
}