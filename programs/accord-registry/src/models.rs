use anchor_lang::prelude::*;

// Universal Project Sectors
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum ProjectSector {
    BlueCarbon,      // Mangroves, Seagrass, etc.
    Forestry,        // ARR, REDD+
    RenewableEnergy, // Solar, Wind, Hydro
    WasteManagement,
    Agriculture,
    Industrial,
}

// Verification Status with enhanced options
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum VerificationStatus {
    Pending,
    AwaitingAudit,   // Pre-audit state
    UnderReview,
    Verified,
    Rejected,
    Monitoring,
    Expired,
}

// Verifier types for multi-party verification
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum VerifierType {
    ScientificInstitution,
    GovernmentAgency,
    CertificationBody,
    LocalCommunity,
    TechnicalAuditor,   // ACVA
    ThirdPartyValidator,
}

// Co-benefits tracking
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum CoBenefit {
    BiodiversityConservation,
    CommunityLivelihoods,
    CoastalProtection,
    WaterQuality,
    FisheryEnhancement,
    TourismDevelopment,
    EducationOutreach,
    EnergySecurity,
    AirQualityImprovement,
}

// Geographic location data
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct GeoLocation {
    pub latitude: f64,
    pub longitude: f64,
    pub polygon_coordinates: Vec<[f64; 2]>,
    pub country_code: String,
    pub region_name: String,
}

// Compliance State for Article 6 & Government Integration
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct ComplianceState {
    pub ccts_registry_id: String,           // ID in National Registry (e.g., ICM)
    pub loa_issued: bool,                   // Letter of Authorization (Article 6.2)
    pub double_counting_prevention_id: String, // Unique Hash to prevent collisions
    pub audit_status: String,               // Current audit status
    pub authorized_export_limit: u64,       // Amount authorized for international transfer
}

// Verification Data for DePIN and Satellites
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct VerificationData {
    pub satellite_data_hash: String,        // Hash of Sentinel-2/Landsat data
    pub iot_data_hash: String,              // Hash of IoT/Smart Inverter logs
    pub acva_report_cid: String,            // IPFS CID of ACVA Report
    pub last_verification_date: i64,
}

// Water quality measurements
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct WaterQuality {
    pub ph_level: f64,
    pub salinity: f64,
    pub dissolved_oxygen: f64,
    pub turbidity: f64,
    pub nutrients: NutrientLevels,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct NutrientLevels {
    pub nitrogen: f64,
    pub phosphorus: f64,
    pub potassium: f64,
}

// Tide reading data
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TideReading {
    pub timestamp: i64,
    pub tide_height: f64,
    pub tide_type: String,
}

// IoT sensor reading
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SensorReading {
    pub sensor_id: String,
    pub timestamp: i64,
    pub co2_flux: f64,
    pub soil_moisture: f64,
    pub ph_level: f64,
    pub temperature: f64,
    pub humidity: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CommunityBenefit {
    pub benefit_type: String,
    pub households_affected: u32,
    pub jobs_created: u32,
    pub income_increase_percentage: f64,
    pub capacity_building_programs: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EconomicImpact {
    pub direct_revenue: u64,
    pub indirect_benefits: u64,
    pub cost_savings: u64,
    pub roi_percentage: f64,
    pub payback_period_years: f64,
}

// Global registry account for tracking overall system state
#[account]
#[derive(Debug, Default)]
pub struct GlobalRegistry {
    pub total_credits_issued: u64,
    pub total_projects: u64,
    pub admin: Pubkey,
    pub government_authority: Pubkey, // Key for signing Compliance IDs
    pub mint_authority: Pubkey,
    pub carbon_token_mint: Pubkey,
    pub bump: u8,
    pub mint_authority_bump: u8,
}

impl GlobalRegistry {
    pub const LEN: usize = 
        8 + // total_credits_issued
        8 + // total_projects  
        32 + // admin
        32 + // mint_authority
        32 + // carbon_token_mint
        1 + // bump
        1; // mint_authority_bump
}

// Universal Project Account
#[account]
#[derive(Debug, Default)]
pub struct Project {
    pub project_id: String,
    pub owner: Pubkey,
    pub ipfs_cid: String,           // PDD CID
    pub carbon_tons_estimated: u64,
    pub verification_status: VerificationStatus,
    pub credits_issued: u64,
    pub tokens_minted: u64,
    pub bump: u8,
    
    // Universal Sectors
    pub project_sector: ProjectSector,
    pub location: GeoLocation,
    pub area_hectares: f64,         // 0.0 for things like Waste/Industrial
    pub establishment_date: i64,
    
    // Compliance & Governance
    pub compliance: ComplianceState,
    pub verifier: Option<Pubkey>,       // Assigned Verifier (for fee payout)
    pub verification_fee_lamports: u64, // Fee agreed/paid
    pub audit_escrow_balance: u64,      // Locked Audit Fee
    
    // DePIN & Verification Data
    pub verification_data: VerificationData,
    
    // Trading Data
    pub vintage_year: u16,
    pub price_per_ton: u64,
    pub available_quantity: u64,
    
    // Quality & Impact
    pub quality_rating: u8,
    pub co_benefits: Vec<CoBenefit>,
}

impl Project {
    const ID_LEN: usize = 32;
    const CID_LEN: usize = 46;
    const COUNTRY_CODE_LEN: usize = 4;
    const REGION_NAME_LEN: usize = 50;
    
    pub const LEN: usize =
        4 + Self::ID_LEN + // project_id
        32 + // owner
        4 + Self::CID_LEN + // ipfs_cid
        8 + // carbon_tons_estimated
        1 + // verification_status
        8 + // credits_issued
        8 + // tokens_minted
        1 + // bump
        1 + // project_sector
        8 + 8 + 4 + 100 + 4 + Self::COUNTRY_CODE_LEN + 4 + Self::REGION_NAME_LEN + // location
        8 + // area_hectares
        8 + // establishment_date
        // ComplianceState
        4 + 50 + // ccts_registry_id
        1 + // loa_issued
        4 + 64 + // double_counting_prevention_id
        4 + 20 + // audit_status
        8 + // authorized_export_limit
        // Verifier & Escrow
        1 + 32 + // verifier (Option<Pubkey>)
        8 + // verification_fee_lamports
        8 + // audit_escrow_balance
        // VerificationData
        4 + 64 + // satellite_data_hash
        4 + 64 + // iot_data_hash
        4 + Self::CID_LEN + // acva_report_cid
        8 + // last_verification_date
        // Trading
        2 + 8 + 8;
}

// Carbon measurement data structure
#[account]
pub struct CarbonMeasurement {
    pub project_id: String,
    pub measurement_date: i64,
    pub above_ground_biomass: f64,
    pub below_ground_biomass: f64,
    pub soil_carbon_0_30cm: f64,
    pub soil_carbon_30_100cm: f64,
    pub sequestration_rate_annual: f64,
    pub methodology: String,
    pub uncertainty_percentage: f64,
    pub measurer_authority: Pubkey,
    pub verification_status: VerificationStatus,
    pub satellite_imagery_cid: String,
    pub field_data_cid: String,
}

// Multi-party verification node
#[account]
pub struct VerificationNode {
    pub verifier_pubkey: Pubkey,
    pub verifier_type: VerifierType,
    pub credentials: Vec<String>,
    pub reputation_score: u64,
    pub verification_count: u64,
    pub is_active: bool,
    pub registration_date: i64,
    pub specializations: Vec<ProjectSector>,
}

// Environmental monitoring data
#[account]
pub struct MonitoringData {
    pub project_id: String,
    pub timestamp: i64,
    pub satellite_imagery_cid: String,
    pub ndvi_index: f64,
    pub water_quality: WaterQuality,
    pub temperature_data: Vec<f64>,
    pub tide_data: Vec<TideReading>,
    pub iot_sensor_data: Vec<SensorReading>,
    pub ecosystem_health_score: f64,
}

// Marketplace listing for carbon credits
#[account]
pub struct CarbonCreditListing {
    pub project_id: String,
    pub seller: Pubkey,
    pub vintage_year: u16,
    pub quantity_available: u64,
    pub price_per_ton: u64,
    pub quality_rating: u8,
    pub co_benefits: Vec<CoBenefit>,
    pub certification_standards: Vec<String>,
    pub currency_mint: Pubkey,
    pub listing_date: i64,
    pub expiry_date: i64,
    pub is_active: bool,
}

impl CarbonCreditListing {
    pub const LEN: usize = 
        4 + 32 + // project_id
        32 + // seller
        2 + // vintage_year
        8 + // quantity_available
        8 + // price_per_ton
        1 + // quality_rating
        4 + (1 * 10) + // co_benefits vec (approx)
        4 + (32 * 5) + // certification_standards vec
        32 + // currency_mint
        8 + // listing_date
        8 + // expiry_date
        1; // is_active
}

// Impact reporting structure
#[account]
pub struct ImpactReport {
    pub project_id: String,
    pub reporting_period_start: i64,
    pub reporting_period_end: i64,
    pub carbon_sequestered: f64,
    pub ecosystem_health_improvement: f64,
    pub biodiversity_increase: f64,
    pub community_benefits: Vec<CommunityBenefit>,
    pub economic_impact: EconomicImpact,
    pub sdg_contributions: Vec<u8>,
    pub verification_report_cid: String,
}

// Default implementations
impl Default for VerificationStatus {
    fn default() -> Self {
        VerificationStatus::Pending
    }
}

impl Default for ProjectSector {
    fn default() -> Self {
        ProjectSector::BlueCarbon
    }
}

// Input data structures for enhanced functions
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProjectRegistrationData {
    pub project_id: String,
    pub ipfs_cid: String,
    pub carbon_tons_estimated: u64,
    pub project_sector: ProjectSector,
    pub location: GeoLocation,
    pub area_hectares: f64,
    pub establishment_date: i64,
    pub vintage_year: u16,
    pub price_per_ton: u64,
    pub ccts_registry_id: String,       // ID from Gov Agency (e.g. ICM)
    pub compliance_id_signature: Vec<u8>, // Signature from Gov Authority verifying ID
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BlueProjectData {
    pub project_id: String,
    pub ipfs_cid: String,
    pub carbon_tons_estimated: u64,
    pub project_sector: ProjectSector,
    pub location: GeoLocation,
    pub area_hectares: f64,
    pub species_composition: Vec<String>,
    pub biodiversity_index: f64,
    pub above_ground_biomass: f64,
    pub below_ground_biomass: f64,
    pub soil_carbon_0_30cm: f64,
    pub soil_carbon_30_100cm: f64,
    pub sequestration_rate_annual: f64,
    pub measurement_methodology: String,
    pub uncertainty_percentage: f64,
    pub vcs_methodology: String,
    pub additionality_proof_cid: String,
    pub permanence_guarantee_years: u16,
    pub leakage_assessment: f64,
    pub monitoring_plan_cid: String,
    pub baseline_ecosystem_health: f64,
    pub species_count_baseline: u32,
    pub co_benefits: Vec<CoBenefit>,
    pub vintage_year: u16,
    pub price_per_ton: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VerifierData {
    pub verifier_type: VerifierType,
    pub credentials: Vec<String>,
    pub specializations: Vec<ProjectSector>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MonitoringDataInput {
    pub project_id: String,
    pub satellite_imagery_cid: String,
    pub ndvi_index: f64,
    pub water_quality: WaterQuality,
    pub temperature_data: Vec<f64>,
    pub tide_data: Vec<TideReading>,
    pub iot_sensor_data: Vec<SensorReading>,
    pub ecosystem_health_score: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MarketplaceListingData {
    pub project_id: String,
    pub vintage_year: u16,
    pub quantity_available: u64,
    pub price_per_ton: u64,
    pub certification_standards: Vec<String>,
    pub currency_mint: Pubkey,
    pub expiry_date: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ImpactReportData {
    pub project_id: String,
    pub reporting_period_start: i64,
    pub reporting_period_end: i64,
    pub carbon_sequestered: f64,
    pub ecosystem_health_improvement: f64,
    pub community_benefits: Vec<CommunityBenefit>,
    pub economic_impact: EconomicImpact,
    pub sdg_contributions: Vec<u8>,
    pub verification_report_cid: String,
    pub species_count_current: u32,
}

// ========================================
// ROLE MANAGEMENT & GOVERNANCE SYSTEM
// ========================================

/// User roles for on-chain access control
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum UserRole {
    None,           // Default - no special permissions
    User,           // Can register projects
    Validator,      // Can verify projects
    Government,     // Can approve compliance/LoA
    Admin,          // Full system access
    SuperAdmin,     // Can manage other admins
}

impl Default for UserRole {
    fn default() -> Self {
        UserRole::None
    }
}

/// On-chain user account storing role and permissions
#[account]
#[derive(Debug)]
pub struct UserAccount {
    pub authority: Pubkey,      // User's wallet address
    pub role: UserRole,          // Assigned role
    pub assigned_by: Pubkey,     // Who assigned this role
    pub assigned_at: i64,        // When role was assigned
    pub is_active: bool,         // Can be deactivated without deletion
    pub permissions: u64,        // Bit flags for granular permissions
    pub bump: u8,
}

impl UserAccount {
    pub const LEN: usize = 
        32 + // authority
        1 +  // role (enum)
        32 + // assigned_by
        8 +  // assigned_at
        1 +  // is_active
        8 +  // permissions
        1;   // bump
}

/// Multi-signature admin proposal
#[account]
#[derive(Debug)]
pub struct AdminProposal {
    pub proposal_id: u64,
    pub proposal_type: ProposalType,
    pub proposer: Pubkey,
    pub target: Pubkey,               // Target of action (user, project, etc.)
    pub created_at: i64,
    pub expires_at: i64,
    pub executed: bool,
    pub cancelled: bool,
    pub approvals: Vec<Pubkey>,       // Admins who approved
    pub rejections: Vec<Pubkey>,      // Admins who rejected
    pub required_approvals: u8,       // Threshold for execution
    pub data: Vec<u8>,                // Serialized proposal-specific data
    pub bump: u8,
}

impl AdminProposal {
    pub const MAX_APPROVALS: usize = 10;
    pub const MAX_DATA_SIZE: usize = 256;
    
    pub const LEN: usize = 
        8 +   // proposal_id
        1 +   // proposal_type (enum)
        32 +  // proposer
        32 +  // target
        8 +   // created_at
        8 +   // expires_at
        1 +   // executed
        1 +   // cancelled
        4 + (32 * Self::MAX_APPROVALS) + // approvals vec
        4 + (32 * Self::MAX_APPROVALS) + // rejections vec
        1 +   // required_approvals
        4 + Self::MAX_DATA_SIZE +       // data vec
        1;    // bump
}

/// Types of proposals that can be created
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum ProposalType {
    AssignRole,         // Assign role to user
    RevokeRole,         // Revoke user role
    AddAdmin,           // Add new admin to multi-sig
    RemoveAdmin,        // Remove admin from multi-sig
    UpdateRegistry,     // Update registry settings
    EmergencyPause,     // Pause system operations
    TransferAuthority,  // Transfer registry ownership
    UpdateThreshold,    // Change approval threshold
}

/// Audit log entry for tracking all admin actions
#[account]
#[derive(Debug)]
pub struct AuditLog {
    pub log_id: u64,
    pub action_type: AuditAction,
    pub performed_by: Pubkey,
    pub target: Pubkey,
    pub timestamp: i64,
    pub success: bool,
    pub details: String,
    pub proposal_id: Option<u64>,  // Link to proposal if applicable
    pub bump: u8,
}

impl AuditLog {
    const DETAILS_LEN: usize = 200;
    
    pub const LEN: usize = 
        8 +   // log_id
        1 +   // action_type (enum)
        32 +  // performed_by
        32 +  // target
        8 +   // timestamp
        1 +   // success
        4 + Self::DETAILS_LEN + // details
        1 + 8 + // Option<u64>
        1;    // bump
}

/// Types of actions to audit
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum AuditAction {
    RoleAssigned,
    RoleRevoked,
    ProjectVerified,
    ProjectRejected,
    CreditsMinted,
    CreditsRetired,
    ProposalCreated,
    ProposalApproved,
    ProposalRejected,
    ProposalExecuted,
    AdminAdded,
    AdminRemoved,
    RegistryInitialized,
    SystemPaused,
    SystemUnpaused,
    SettingsUpdated,
}

/// Multi-sig configuration
#[account]
#[derive(Debug)]
pub struct MultiSigConfig {
    pub admins: Vec<Pubkey>,          // List of admin public keys
    pub threshold: u8,                 // Minimum approvals needed
    pub proposal_count: u64,           // Counter for proposal IDs
    pub is_enabled: bool,              // Can disable multi-sig temporarily
    pub emergency_admin: Pubkey,       // Can act alone in emergencies
    pub bump: u8,
}

impl MultiSigConfig {
    pub const MAX_ADMINS: usize = 10;
    
    pub const LEN: usize = 
        4 + (32 * Self::MAX_ADMINS) + // admins vec
        1 +   // threshold
        8 +   // proposal_count
        1 +   // is_enabled
        32 +  // emergency_admin
        1;    // bump
}

/// Permission bit flags
pub mod permissions {
    pub const REGISTER_PROJECT: u64 = 1 << 0;
    pub const VERIFY_PROJECT: u64 = 1 << 1;
    pub const MINT_CREDITS: u64 = 1 << 2;
    pub const TRANSFER_CREDITS: u64 = 1 << 3;
    pub const RETIRE_CREDITS: u64 = 1 << 4;
    pub const ASSIGN_ROLES: u64 = 1 << 5;
    pub const CREATE_PROPOSAL: u64 = 1 << 6;
    pub const APPROVE_PROPOSAL: u64 = 1 << 7;
    pub const EXECUTE_PROPOSAL: u64 = 1 << 8;
    pub const VIEW_AUDIT_LOGS: u64 = 1 << 9;
    pub const EMERGENCY_PAUSE: u64 = 1 << 10;
    
    pub const ADMIN_PERMISSIONS: u64 = 
        REGISTER_PROJECT | VERIFY_PROJECT | MINT_CREDITS | 
        TRANSFER_CREDITS | RETIRE_CREDITS | ASSIGN_ROLES |
        CREATE_PROPOSAL | APPROVE_PROPOSAL | EXECUTE_PROPOSAL |
        VIEW_AUDIT_LOGS | EMERGENCY_PAUSE;
    
    pub const VALIDATOR_PERMISSIONS: u64 = 
        VERIFY_PROJECT | VIEW_AUDIT_LOGS;
    
    pub const USER_PERMISSIONS: u64 = 
        REGISTER_PROJECT | TRANSFER_CREDITS | RETIRE_CREDITS;
}

// ========================================
// DEX & AMM MODELS
// ========================================

#[account]
#[derive(Debug)]
pub struct LiquidityPool {
    pub authority: Pubkey,      // Authority to manage the pool (or PDA)
    pub credit_mint: Pubkey,    // The Carbon Credit Mint (Token A)
    pub quote_mint: Pubkey,     // The Quote Token Mint (Token B, e.g. USDC)
    pub credit_vault: Pubkey,   // Vault holding Carbon Credits
    pub quote_vault: Pubkey,    // Vault holding Quote Tokens
    pub lp_mint: Pubkey,        // Mint for Liquidity Provider Tokens
    pub fee_basis_points: u16,  // Swap fee (e.g. 30 = 0.3%)
    pub total_liquidity: u64,
    pub bump: u8,
}

impl LiquidityPool {
    pub const LEN: usize = 
        32 + // authority
        32 + // credit_mint
        32 + // quote_mint
        32 + // credit_vault
        32 + // quote_vault
        32 + // lp_mint
        2 +  // fee_basis_points
        8 +  // total_liquidity
        1;   // bump
}

// Double Counting Prevention Registry
#[account]
pub struct DoubleCountingRegistry {
    pub registered_locations: Vec<u64>, // List of H3 cell indices that are already registered
    pub authority: Pubkey,              // Authority to manage this (e.g. Registry Admin)
    pub bump: u8,
}

impl DoubleCountingRegistry {
    // 8 (discriminator) + 4 (vec len) + (8 * 2000) (cells) + 32 (authority) + 1 (bump)
    pub const LEN: usize = 8 + 4 + (8 * 2000) + 32 + 1; 
}

// Platform Analytics for Dashboard
#[account]
pub struct PlatformStats {
    pub total_registered_users: u64,
    pub total_validators: u64,
    pub total_transactions: u64, // Increment on mint/trade/retire
    pub total_volume_credits: u64,
    pub bump: u8,
}

impl PlatformStats {
    pub const LEN: usize = 8 + 8 + 8 + 8 + 8 + 1;
}