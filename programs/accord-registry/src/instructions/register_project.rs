use anchor_lang::prelude::*;
use crate::models::*;
use crate::instructions::contexts::*;
use crate::instructions::errors::ErrorCode;
use h3o::{LatLng, Resolution};

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
) -> Result<()> {
    let project_account = &mut ctx.accounts.project;
    let registry = &mut ctx.accounts.registry;
    let double_counting_registry = &mut ctx.accounts.double_counting_registry;

    // H3 Geospatial Check
    let lat = project_data.location.latitude;
    let lng = project_data.location.longitude;
    
    // Validate LatLng
    let coord = LatLng::new(lat, lng).map_err(|_| ErrorCode::InvalidQualityRating)?; // Using existing error or add new one
    
    // Get H3 Cell (Resolution 8 is approx 0.73 km2, Res 9 is 0.1km2. Res 8 is standard for project zones)
    let cell_index = coord.to_cell(Resolution::Eight);
    let cell_u64: u64 = cell_index.into();

    // Check for duplicates
    if double_counting_registry.registered_locations.contains(&cell_u64) {
        return Err(ErrorCode::ProjectAlreadyProcessed.into()); // "Project Already Registered at this location"
    }

    // Register Location
    double_counting_registry.registered_locations.push(cell_u64);

    // Set universal project data
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
    project_account.available_quantity = project_data.carbon_tons_estimated; // Initially all available

    // Initialize status and counters
    project_account.verification_status = VerificationStatus::Pending;
    project_account.credits_issued = 0;
    project_account.tokens_minted = 0;
    project_account.bump = ctx.bumps.project;
    project_account.verifier = None;
    project_account.verification_fee_lamports = 0;
    project_account.audit_escrow_balance = 0; // Initialize escrow

    // Initialize Default Compliance State
    // We store the provided ID and Signature. 
    // In a production environment, we would inspect the previous instruction (Ed25519) to verify the signature matches.
    project_account.compliance = ComplianceState {
        ccts_registry_id: project_data.ccts_registry_id,
        loa_issued: false,
        double_counting_prevention_id: cell_index.to_string(), // Store the H3 Index
        audit_status: String::from("Submitted"), // Status is Submitted since they have an ID
        authorized_export_limit: 0,
    };

    // Initialize Default Verification Data
    project_account.verification_data = VerificationData::default();

    // Initialize Quality & Impact
    project_account.quality_rating = 0;
    project_account.co_benefits = Vec::new();

    // Update global registry
    registry.total_projects += 1;

    msg!("Universal Project registered successfully!");
    msg!("Project ID: {}", project_account.project_id);
    msg!("Sector: {:?}", project_account.project_sector);
    msg!("Estimated Tons: {}", project_account.carbon_tons_estimated);

    Ok(())
}