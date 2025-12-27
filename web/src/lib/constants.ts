// Program constants
export const PROGRAM_ID = "9W1Zh89ykeWSbXVTgHHgeUcyUTGSs2XAbMRvY1uR1gU";

// RPC endpoints
export const RPC_ENDPOINTS = {
    mainnet: "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    localnet: "http://127.0.0.1:8899",
} as const;

// Default to localnet for development
export const DEFAULT_RPC = process.env.NEXT_PUBLIC_RPC_URL || RPC_ENDPOINTS.localnet;

// Token decimals
export const CREDIT_DECIMALS = 6;

// Minimum fees
export const MINIMUM_VERIFICATION_FEE = 0.1; // SOL
export const MINIMUM_VERIFICATION_FEE_LAMPORTS = 100_000_000;

// Role IDs (matching on-chain enum)
export const UserRole = {
    None: 0,
    User: 1,
    Validator: 2,
    Government: 3,
    Admin: 4,
    SuperAdmin: 5,
} as const;

// Permission bit flags (matching on-chain)
export const Permissions = {
    REGISTER_PROJECT: 1 << 0,
    VERIFY_PROJECT: 1 << 1,
    MINT_CREDITS: 1 << 2,
    TRANSFER_CREDITS: 1 << 3,
    RETIRE_CREDITS: 1 << 4,
    ASSIGN_ROLES: 1 << 5,
    CREATE_PROPOSAL: 1 << 6,
    APPROVE_PROPOSAL: 1 << 7,
    EXECUTE_PROPOSAL: 1 << 8,
    VIEW_AUDIT_LOGS: 1 << 9,
    EMERGENCY_PAUSE: 1 << 10,
} as const;

// Verification status (matching on-chain enum)
export const VerificationStatus = {
    Pending: "pending",
    AwaitingAudit: "awaitingAudit",
    UnderReview: "underReview",
    Verified: "verified",
    Rejected: "rejected",
    Monitoring: "monitoring",
    Expired: "expired",
} as const;

// Project sectors (matching on-chain enum)
export const ProjectSector = {
    BlueCarbon: "blueCarbon",
    Forestry: "forestry",
    RenewableEnergy: "renewableEnergy",
    WasteManagement: "wasteManagement",
    Agriculture: "agriculture",
    Industrial: "industrial",
} as const;

// Co-benefits
export const CoBenefits = [
    "biodiversityConservation",
    "communityLivelihoods",
    "coastalProtection",
    "waterQuality",
    "fisheryEnhancement",
    "tourismDevelopment",
    "educationOutreach",
    "energySecurity",
    "airQualityImprovement",
] as const;
