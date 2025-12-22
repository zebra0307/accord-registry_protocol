use anchor_lang::prelude::*;
use crate::models::*;
use crate::instructions::{contexts::*, errors::ErrorCode};

pub fn verify_project(
    ctx: Context<VerifyProject>,
    verified_carbon_tons: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    
    require!(
        project.verification_status == VerificationStatus::Pending || 
        project.verification_status == VerificationStatus::AwaitingAudit,
        ErrorCode::ProjectAlreadyProcessed
    );

    project.verification_status = VerificationStatus::Verified;
    project.carbon_tons_estimated = verified_carbon_tons;
    project.available_quantity = verified_carbon_tons;

    msg!("Project {} verified successfully!", project.project_id);
    msg!("Verified carbon tons: {}", verified_carbon_tons);

    // Release Escrow if funds are available
    let fee = project.verification_fee_lamports;
    if fee > 0 {
        // Validation: Ensure the signer is the assigned verifier
        if let Some(assigned_verifier) = project.verifier {
            require!(assigned_verifier == ctx.accounts.admin.key(), ErrorCode::UnauthorizedVerifier);
        }

        **project.to_account_info().try_borrow_mut_lamports()? = project
            .to_account_info()
            .lamports()
            .checked_sub(fee)
            .ok_or(ErrorCode::MathOverflow)?;
            
        **ctx.accounts.admin.to_account_info().try_borrow_mut_lamports()? = ctx
            .accounts.admin
            .to_account_info()
            .lamports()
            .checked_add(fee)
            .ok_or(ErrorCode::MathOverflow)?;

        project.verification_fee_lamports = 0;
        project.audit_escrow_balance = 0;
        msg!("Verification Fee Released: {} lamports", fee);
    }

    Ok(())
}

pub fn multi_party_verify_project(
    ctx: Context<MultiPartyVerifyProject>,
    verified_carbon_tons: u64,
    quality_rating: u8,
    _verification_report_cid: String,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    let verifier = &mut ctx.accounts.verifier;
    
    require!(
        project.verification_status == VerificationStatus::Pending ||
        project.verification_status == VerificationStatus::UnderReview,
        ErrorCode::ProjectAlreadyProcessed
    );

    require!(verifier.is_active, ErrorCode::VerifierNotActive);
    require!(quality_rating >= 1 && quality_rating <= 5, ErrorCode::InvalidQualityRating);

    // Update project verification
    project.verification_status = VerificationStatus::Verified;
    project.carbon_tons_estimated = verified_carbon_tons;
    project.quality_rating = quality_rating;
    project.available_quantity = verified_carbon_tons;

    // Update verifier stats
    verifier.verification_count += 1;
    verifier.reputation_score += 10; // Reward for verification

    msg!("Project {} verified by {:?}", project.project_id, verifier.verifier_type);
    msg!("Verified carbon tons: {}", verified_carbon_tons);
    msg!("Quality rating: {}/5", quality_rating);

    Ok(())
}

pub fn register_verifier(
    ctx: Context<RegisterVerifier>,
    verifier_data: VerifierData,
) -> Result<()> {
    let verifier = &mut ctx.accounts.verifier;

    verifier.verifier_pubkey = ctx.accounts.verifier_authority.key();
    verifier.verifier_type = verifier_data.verifier_type;
    verifier.credentials = verifier_data.credentials;
    verifier.reputation_score = 100; // Starting score
    verifier.verification_count = 0;
    verifier.is_active = true;
    verifier.registration_date = Clock::get()?.unix_timestamp;
    verifier.specializations = verifier_data.specializations;

    msg!("Verifier registered: {:?}", verifier.verifier_type);

    Ok(())
}

pub fn initialize_verification(
    ctx: Context<InitializeVerification>,
    fee_lamports: u64,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    let owner = &ctx.accounts.owner;
    let verifier = &ctx.accounts.verifier;
    
    // Transfer SOL from Owner to Project PDA (Escrow)
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &owner.key(),
        &project.key(),
        fee_lamports,
    );
    
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            owner.to_account_info(),
            project.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // Update State
    project.verifier = Some(verifier.key());
    project.verification_fee_lamports = fee_lamports;
    project.audit_escrow_balance += fee_lamports;
    project.verification_status = VerificationStatus::AwaitingAudit;

    msg!("Verification Escrow Funded: {} lamports", fee_lamports);
    msg!("Assigned Verifier: {}", verifier.key());

    Ok(())
}