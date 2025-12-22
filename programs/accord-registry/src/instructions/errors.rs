use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Project is not verified")]
    ProjectNotVerified,
    #[msg("Amount exceeds verified carbon capacity")]
    ExceedsVerifiedCapacity,
    #[msg("Project has already been processed")]
    ProjectAlreadyProcessed,
    #[msg("Verifier is not active")]
    VerifierNotActive,
    #[msg("Invalid quality rating (must be 1-5)")]
    InvalidQualityRating,
    #[msg("Exceeds available quantity")]
    ExceedsAvailableQuantity,
    #[msg("Invalid ecosystem type")]
    InvalidEcosystemType,
    #[msg("Insufficient monitoring data")]
    InsufficientMonitoringData,
    #[msg("Invalid carbon measurement")]
    InvalidCarbonMeasurement,
    #[msg("Compliance validation failed")]
    ComplianceValidationFailed,
    #[msg("Not enough credits to trade.")]
    InsufficientCredits,
    #[msg("Government Compliance Audit Not Approved")]
    ComplianceNotApproved,
    #[msg("Liquidity amount must be greater than zero")]
    LiquidityZero,
    #[msg("Math overflow occurred")]
    MathOverflow,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Insufficient funds for operation")]
    InsufficientFunds,
    #[msg("Instruction failed")]
    InstructionFailed,
    #[msg("User account is not active")]
    UserNotActive,
    #[msg("User does not have required permissions")]
    InsufficientPermissions,
    #[msg("Unauthorized: Verifier does not match assigned project verifier")]
    UnauthorizedVerifier,
}