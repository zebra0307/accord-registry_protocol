use anchor_lang::prelude::*;
use crate::models::*;

#[derive(Accounts)]
pub struct ApproveCompliance<'info> {
    #[account(
        mut,
        seeds = [b"project", project.owner.as_ref(), project.project_id.as_bytes()],
        bump = project.bump
    )]
    pub project: Account<'info, Project>,

    // The authority verifying compliance (Government Agency)
    #[account(mut)]
    pub authority: Signer<'info>,

    // Authority's role account to verify permissions
    #[account(
        seeds = [b"user", authority.key().as_ref()],
        bump = user_account.bump,
        constraint = user_account.role == UserRole::Government || 
                     user_account.role == UserRole::Admin @ ErrorCode::UnauthorizedGovernment
    )]
    pub user_account: Account<'info, UserAccount>,
}

pub fn approve_project_compliance(
    ctx: Context<ApproveCompliance>,
    ccts_registry_id: String,
    authorized_export_limit: u64,
    loa_issued: bool,
) -> Result<()> {
    let project = &mut ctx.accounts.project;

    // Update compliance state
    project.compliance.ccts_registry_id = ccts_registry_id;
    project.compliance.authorized_export_limit = authorized_export_limit;
    project.compliance.loa_issued = loa_issued;
    project.compliance.audit_status = String::from("Approved");

    // Generate Double Counting Prevention ID (Hash of project + registry ID)
    let double_counting_id = format!("{}_{}_{}", project.project_id, project.compliance.ccts_registry_id, project.location.country_code);
    project.compliance.double_counting_prevention_id = double_counting_id;

    msg!("Compliance Approved for Project: {}", project.project_id);
    msg!("Registry ID: {}", project.compliance.ccts_registry_id);
    msg!("LoA Issued: {}", loa_issued);

    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Only Government role can approve compliance")]
    UnauthorizedGovernment,
}
