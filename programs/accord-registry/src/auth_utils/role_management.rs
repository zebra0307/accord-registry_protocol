use anchor_lang::prelude::*;
use crate::models::*;

// ========================================
// ROLE MANAGEMENT INSTRUCTIONS
// ========================================

/// Register a new user (Self-Service)
#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserAccount::LEN,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        seeds = [b"registry_v3"],
        bump = registry.bump
    )]
    pub registry: Account<'info, GlobalRegistry>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Initialize a user account with a role
#[derive(Accounts)]
#[instruction(user_address: Pubkey)]
pub struct AssignRole<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + UserAccount::LEN,
        seeds = [b"user", user_address.as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        seeds = [b"registry_v3"],
        bump = registry.bump,
        constraint = registry.admin == admin.key() @ ErrorCode::UnauthorizedAdmin
    )]
    pub registry: Account<'info, GlobalRegistry>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Update an existing user's role
#[derive(Accounts)]
pub struct UpdateRole<'info> {
    #[account(
        mut,
        seeds = [b"user", user_account.authority.as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        seeds = [b"registry_v3"],
        bump = registry.bump,
        constraint = registry.admin == admin.key() @ ErrorCode::UnauthorizedAdmin
    )]
    pub registry: Account<'info, GlobalRegistry>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

/// Revoke a user's role
#[derive(Accounts)]
pub struct RevokeRole<'info> {
    #[account(
        mut,
        seeds = [b"user", user_account.authority.as_ref()],
        bump = user_account.bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(
        seeds = [b"registry_v3"],
        bump = registry.bump,
        constraint = registry.admin == admin.key() @ ErrorCode::UnauthorizedAdmin
    )]
    pub registry: Account<'info, GlobalRegistry>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

// ========================================
// MULTI-SIG ADMIN INSTRUCTIONS
// ========================================

/// Initialize multi-sig configuration
#[derive(Accounts)]
pub struct InitializeMultiSig<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + MultiSigConfig::LEN,
        seeds = [b"multisig"],
        bump
    )]
    pub multisig_config: Account<'info, MultiSigConfig>,
    
    #[account(
        mut,
        seeds = [b"registry_v3"],
        bump = registry.bump,
        constraint = registry.admin == admin.key() @ ErrorCode::UnauthorizedAdmin
    )]
    pub registry: Account<'info, GlobalRegistry>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Create a new admin proposal
#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + AdminProposal::LEN,
        seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal: Account<'info, AdminProposal>,
    
    #[account(
        mut,
        seeds = [b"multisig"],
        bump = multisig_config.bump
    )]
    pub multisig_config: Account<'info, MultiSigConfig>,
    
    #[account(
        seeds = [b"user", proposer.key().as_ref()],
        bump = proposer_account.bump,
        constraint = proposer_account.role == UserRole::Admin || 
                     proposer_account.role == UserRole::SuperAdmin @ ErrorCode::UnauthorizedAdmin
    )]
    pub proposer_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Approve a proposal
#[derive(Accounts)]
pub struct ApproveProposal<'info> {
    #[account(
        mut,
        seeds = [b"proposal", proposal.proposal_id.to_le_bytes().as_ref()],
        bump = proposal.bump,
        constraint = !proposal.executed @ ErrorCode::ProposalAlreadyExecuted,
        constraint = !proposal.cancelled @ ErrorCode::ProposalCancelled
    )]
    pub proposal: Account<'info, AdminProposal>,
    
    #[account(
        seeds = [b"multisig"],
        bump = multisig_config.bump
    )]
    pub multisig_config: Account<'info, MultiSigConfig>,
    
    #[account(
        seeds = [b"user", approver.key().as_ref()],
        bump = approver_account.bump,
        constraint = approver_account.role == UserRole::Admin || 
                     approver_account.role == UserRole::SuperAdmin @ ErrorCode::UnauthorizedAdmin
    )]
    pub approver_account: Account<'info, UserAccount>,
    
    pub approver: Signer<'info>,
}

/// Execute an approved proposal
#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(
        mut,
        seeds = [b"proposal", proposal.proposal_id.to_le_bytes().as_ref()],
        bump = proposal.bump,
        constraint = !proposal.executed @ ErrorCode::ProposalAlreadyExecuted,
        constraint = !proposal.cancelled @ ErrorCode::ProposalCancelled
    )]
    pub proposal: Account<'info, AdminProposal>,
    
    #[account(
        seeds = [b"multisig"],
        bump = multisig_config.bump
    )]
    pub multisig_config: Account<'info, MultiSigConfig>,
    
    #[account(
        seeds = [b"user", executor.key().as_ref()],
        bump = executor_account.bump,
        constraint = executor_account.role == UserRole::Admin || 
                     executor_account.role == UserRole::SuperAdmin @ ErrorCode::UnauthorizedAdmin
    )]
    pub executor_account: Account<'info, UserAccount>,
    
    pub executor: Signer<'info>,
}

// ========================================
// AUDIT LOG INSTRUCTIONS
// ========================================

/// Create an audit log entry
#[derive(Accounts)]
#[instruction(log_id: u64)]
pub struct CreateAuditLog<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AuditLog::LEN,
        seeds = [b"audit_log", log_id.to_le_bytes().as_ref()],
        bump
    )]
    pub audit_log: Account<'info, AuditLog>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// ========================================
// ROLE MANAGEMENT INSTRUCTION HANDLERS
// ========================================

pub fn register_user(
    ctx: Context<RegisterUser>,
    role: UserRole,
) -> Result<()> {
    // Only allow User or Validator self-registration for now
    require!(
        role == UserRole::User || role == UserRole::Validator, 
        ErrorCode::UnauthorizedAdmin // Using existing error for simplicity
    );

    let user_account = &mut ctx.accounts.user_account;
    let user = &ctx.accounts.user;
    let clock = Clock::get()?;
    
    user_account.authority = user.key();
    user_account.role = role.clone();
    user_account.assigned_by = user.key(); // Self-assigned
    user_account.assigned_at = clock.unix_timestamp;
    user_account.is_active = true;
    user_account.bump = ctx.bumps.user_account;
    
    // Assign default permissions
    user_account.permissions = match role {
        UserRole::User => permissions::USER_PERMISSIONS,
        UserRole::Validator => permissions::VALIDATOR_PERMISSIONS,
        _ => 0,
    };
    
    msg!("User registered self as: {:?} with perms {}", role, user_account.permissions);
    
    Ok(())
}

pub fn assign_role(
    ctx: Context<AssignRole>,
    user_address: Pubkey,
    role: UserRole,
    permissions: u64,
) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let admin = &ctx.accounts.admin;
    let clock = Clock::get()?;
    
    user_account.authority = user_address;
    user_account.role = role;
    user_account.assigned_by = admin.key();
    user_account.assigned_at = clock.unix_timestamp;
    user_account.is_active = true;
    user_account.permissions = permissions;
    user_account.bump = ctx.bumps.user_account;
    
    msg!("Role assigned: {:?} to {}", user_account.role, user_address);
    Ok(())
}

pub fn update_role(
    ctx: Context<UpdateRole>,
    new_role: UserRole,
    new_permissions: u64,
) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    let admin = &ctx.accounts.admin;
    let clock = Clock::get()?;
    
    msg!("Updating role from {:?} to {:?}", user_account.role, new_role);
    
    user_account.role = new_role;
    user_account.permissions = new_permissions;
    user_account.assigned_by = admin.key();
    user_account.assigned_at = clock.unix_timestamp;
    
    Ok(())
}

pub fn revoke_role(ctx: Context<RevokeRole>) -> Result<()> {
    let user_account = &mut ctx.accounts.user_account;
    
    msg!("Revoking role: {:?} from {}", user_account.role, user_account.authority);
    
    user_account.is_active = false;
    user_account.role = UserRole::None;
    user_account.permissions = 0;
    
    Ok(())
}

// ========================================
// MULTI-SIG INSTRUCTION HANDLERS
// ========================================

pub fn initialize_multisig(
    ctx: Context<InitializeMultiSig>,
    admins: Vec<Pubkey>,
    threshold: u8,
) -> Result<()> {
    require!(admins.len() >= threshold as usize, ErrorCode::InvalidThreshold);
    require!(admins.len() <= MultiSigConfig::MAX_ADMINS, ErrorCode::TooManyAdmins);
    require!(threshold > 0, ErrorCode::InvalidThreshold);
    
    let multisig_config = &mut ctx.accounts.multisig_config;
    
    multisig_config.admins = admins;
    multisig_config.threshold = threshold;
    multisig_config.proposal_count = 0;
    multisig_config.is_enabled = true;
    multisig_config.emergency_admin = ctx.accounts.admin.key();
    multisig_config.bump = ctx.bumps.multisig_config;
    
    msg!("Multi-sig initialized with {} admins, threshold: {}", multisig_config.admins.len(), threshold);
    Ok(())
}

pub fn create_proposal(
    ctx: Context<CreateProposal>,
    proposal_id: u64,
    proposal_type: ProposalType,
    target: Pubkey,
    data: Vec<u8>,
    expires_in: i64,
) -> Result<()> {
    require!(data.len() <= AdminProposal::MAX_DATA_SIZE, ErrorCode::DataTooLarge);
    
    let proposal = &mut ctx.accounts.proposal;
    let multisig_config = &mut ctx.accounts.multisig_config;
    let clock = Clock::get()?;
    
    proposal.proposal_id = proposal_id;
    proposal.proposal_type = proposal_type.clone();
    proposal.proposer = ctx.accounts.proposer.key();
    proposal.target = target;
    proposal.created_at = clock.unix_timestamp;
    proposal.expires_at = clock.unix_timestamp + expires_in;
    proposal.executed = false;
    proposal.cancelled = false;
    proposal.approvals = vec![];
    proposal.rejections = vec![];
    proposal.required_approvals = multisig_config.threshold;
    proposal.data = data;
    proposal.bump = ctx.bumps.proposal;
    
    multisig_config.proposal_count += 1;
    
    msg!("Proposal created: ID {}, Type: {:?}", proposal_id, proposal_type);
    Ok(())
}

pub fn approve_proposal(ctx: Context<ApproveProposal>) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let approver = ctx.accounts.approver.key();
    let clock = Clock::get()?;
    
    require!(clock.unix_timestamp < proposal.expires_at, ErrorCode::ProposalExpired);
    require!(!proposal.approvals.contains(&approver), ErrorCode::AlreadyApproved);
    
    proposal.approvals.push(approver);
    
    msg!("Proposal {} approved by {}. Approvals: {}/{}", 
         proposal.proposal_id, 
         approver, 
         proposal.approvals.len(), 
         proposal.required_approvals);
    
    Ok(())
}

pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let clock = Clock::get()?;
    
    require!(clock.unix_timestamp < proposal.expires_at, ErrorCode::ProposalExpired);
    require!(
        proposal.approvals.len() >= proposal.required_approvals as usize,
        ErrorCode::InsufficientApprovals
    );
    
    proposal.executed = true;
    
    msg!("Proposal {} executed", proposal.proposal_id);
    Ok(())
}

// ========================================
// AUDIT LOG HANDLERS
// ========================================

pub fn create_audit_log(
    ctx: Context<CreateAuditLog>,
    log_id: u64,
    action_type: AuditAction,
    target: Pubkey,
    success: bool,
    details: String,
    proposal_id: Option<u64>,
) -> Result<()> {
    let audit_log = &mut ctx.accounts.audit_log;
    let clock = Clock::get()?;
    
    audit_log.log_id = log_id;
    audit_log.action_type = action_type;
    audit_log.performed_by = ctx.accounts.authority.key();
    audit_log.target = target;
    audit_log.timestamp = clock.unix_timestamp;
    audit_log.success = success;
    audit_log.details = details;
    audit_log.proposal_id = proposal_id;
    audit_log.bump = ctx.bumps.audit_log;
    
    Ok(())
}

// ========================================
// ERROR CODES
// ========================================

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Only admin can perform this action")]
    UnauthorizedAdmin,
    
    #[msg("Invalid threshold: Must be > 0 and <= number of admins")]
    InvalidThreshold,
    
    #[msg("Too many admins: Maximum is 10")]
    TooManyAdmins,
    
    #[msg("Proposal already executed")]
    ProposalAlreadyExecuted,
    
    #[msg("Proposal has been cancelled")]
    ProposalCancelled,
    
    #[msg("Proposal has expired")]
    ProposalExpired,
    
    #[msg("Already approved this proposal")]
    AlreadyApproved,
    
    #[msg("Insufficient approvals to execute")]
    InsufficientApprovals,
    
    #[msg("Data size exceeds maximum")]
    DataTooLarge,
    
    #[msg("User does not have required permissions")]
    InsufficientPermissions,
    
    #[msg("User account is not active")]
    UserNotActive,
}