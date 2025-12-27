use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::models::*;
use crate::instructions::contexts::*;
use crate::instructions::errors::ErrorCode;
use h3o::{LatLng, Resolution};

/// Minimum verification fee in lamports (0.1 SOL)
pub const MINIMUM_VERIFICATION_FEE: u64 = 100_000_000;

pub fn initialize_double_counting_registry(
    ctx: Context<InitializeDoubleCountingRegistry>,
) -> Result<()> {
    let registry = &mut ctx.accounts.double_counting_registry;
    registry.authority = ctx.accounts.authority.key();
    registry.bump = ctx.bumps.double_counting_registry;
    msg!("Double Counting Registry Initialized");
    Ok(())
}

pub fn register_project(
    ctx: Context<RegisterProject>,
    project_data: ProjectRegistrationData,
    verification_fee: u64,
) -> Result<()> {
    let project_account = &mut ctx.accounts.project;
    let registry = &mut ctx.accounts.registry;
    let double_counting_registry = &mut ctx.accounts.double_counting_registry;

    // ========================================
    // VALIDATION 1: ICM Registry ID is Mandatory
    // ========================================
    require!(
        !project_data.ccts_registry_id.is_empty(),
        ErrorCode::MissingRegistryId
    );

    // ========================================
    // VALIDATION 2: Project ID must equal ICM Registry ID
    // ========================================
    require!(
        project_data.project_id == project_data.ccts_registry_id,
        ErrorCode::RegistryIdMismatch
    );

    // ========================================
    // VALIDATION 3: Minimum Verification Fee Required
    // ========================================
    require!(
        verification_fee >= MINIMUM_VERIFICATION_FEE,
        ErrorCode::InsufficientVerificationFee
    );

    // ========================================
    // H3 Geospatial Double-Counting Check
    // ========================================
    let lat = project_data.location.latitude;
    let lng = project_data.location.longitude;
    
    let coord = LatLng::new(lat, lng).map_err(|_| ErrorCode::InvalidCoordinates)?;
    let cell_index = coord.to_cell(Resolution::Eight);
    let cell_u64: u64 = cell_index.into();

    if double_counting_registry.registered_locations.contains(&cell_u64) {
        return Err(ErrorCode::ProjectAlreadyProcessed.into());
    }

    // Register Location
    double_counting_registry.registered_locations.push(cell_u64);

    // ========================================
    // COLLECT VERIFICATION ESCROW
    // Transfer from developer to project PDA
    // ========================================
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.project_owner.to_account_info(),
            to: project_account.to_account_info(),
        },
    );
    system_program::transfer(cpi_context, verification_fee)?;

    // ========================================
    // SET PROJECT DATA
    // ========================================
    project_account.project_id = project_data.project_id.clone();
    project_account.owner = ctx.accounts.project_owner.key();
    project_account.ipfs_cid = project_data.ipfs_cid;
    project_account.carbon_tons_estimated = project_data.carbon_tons_estimated;
    project_account.project_sector = project_data.project_sector;
    project_account.location = project_data.location;
    project_account.area_hectares = project_data.area_hectares;
    project_account.establishment_date = project_data.establishment_date;
    project_account.vintage_year = project_data.vintage_year;
    project_account.price_per_ton = project_data.price_per_ton;
    project_account.available_quantity = project_data.carbon_tons_estimated;

    // Status is now AwaitingAudit since escrow is collected
    project_account.verification_status = VerificationStatus::AwaitingAudit;
    project_account.credits_issued = 0;
    project_account.tokens_minted = 0;
    project_account.bump = ctx.bumps.project;
    project_account.verifier = None;
    project_account.verification_fee_lamports = verification_fee;
    project_account.audit_escrow_balance = verification_fee; // Escrow is now funded

    // Compliance State - ICM Registry ID is now verified as project_id
    project_account.compliance = ComplianceState {
        ccts_registry_id: project_data.ccts_registry_id.clone(),
        loa_issued: false,
        double_counting_prevention_id: cell_index.to_string(),
        audit_status: String::from("EscrowFunded"),
        authorized_export_limit: 0,
    };

    // Initialize DePIN Verification Data (to be filled by oracle/monitoring)
    project_account.verification_data = VerificationData::default();

    // Initialize Quality & Impact
    project_account.quality_rating = 0;
    project_account.co_benefits = Vec::new();

    // Update global registry
    registry.total_projects += 1;

    msg!("✅ Project registered with ICM Registry ID: {}", project_account.project_id);
    msg!("📍 H3 Cell: {}", cell_index.to_string());
    msg!("💰 Escrow Funded: {} lamports", verification_fee);
    msg!("📊 Status: AwaitingAudit");

    Ok(())
}