use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, TransferChecked, CloseAccount};
use crate::models::*;
use crate::instructions::{contexts::*, errors::ErrorCode};

pub fn create_marketplace_listing(
    ctx: Context<CreateMarketplaceListing>,
    _project_id: String,
    listing_data: MarketplaceListingData,
) -> Result<()> {
    let listing = &mut ctx.accounts.listing;
    let project = &ctx.accounts.project;

    require!(
        project.verification_status == VerificationStatus::Verified,
        ErrorCode::ProjectNotVerified
    );

    require!(
        project.verification_status == VerificationStatus::Verified,
        ErrorCode::ProjectNotVerified
    );

    // Removed specific quantity check against project.available_quantity as it conflates units (tons vs tokens)
    // and transfer_checked below enforces that the seller has enough tokens.

    listing.project_id = listing_data.project_id.clone();
    listing.seller = ctx.accounts.seller.key();
    listing.vintage_year = listing_data.vintage_year;
    listing.quantity_available = listing_data.quantity_available;
    listing.price_per_ton = listing_data.price_per_ton;
    listing.quality_rating = project.quality_rating;
    listing.co_benefits = project.co_benefits.clone();
    listing.certification_standards = listing_data.certification_standards;
    listing.currency_mint = listing_data.currency_mint;
    listing.listing_date = Clock::get()?.unix_timestamp;
    listing.expiry_date = listing_data.expiry_date;
    listing.is_active = true;

    // Transfer Carbon Credits to Listing Vault
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.seller_credit_account.to_account_info(),
        mint: ctx.accounts.credit_mint.to_account_info(),
        to: ctx.accounts.listing_vault.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
        listing_data.quantity_available,
        ctx.accounts.credit_mint.decimals,
    )?;

    msg!("Marketplace listing created for project: {}", listing.project_id);
    msg!("Quantity: {} tons at {} per ton", listing.quantity_available, listing.price_per_ton);

    Ok(())
}

pub fn buy_marketplace_listing(
    ctx: Context<BuyMarketplaceListing>,
    amount: u64,
) -> Result<()> {
    let listing = &mut ctx.accounts.listing;

    require!(listing.is_active, ErrorCode::InstructionFailed); // Add specific error later
    require!(amount <= listing.quantity_available, ErrorCode::ExceedsAvailableQuantity);
    require!(ctx.accounts.currency_mint.key() == listing.currency_mint, ErrorCode::InstructionFailed);

    // Calculate total cost (Price is per whole token)
    // amount (raw) * price (per whole) / 10^decimals
    let decimals = ctx.accounts.credit_mint.decimals;
    let factor = 10u128.checked_pow(decimals as u32).ok_or(ErrorCode::MathOverflow)?;
    
    let cost_u128 = (amount as u128)
        .checked_mul(listing.price_per_ton as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(factor)
        .ok_or(ErrorCode::MathOverflow)?;
        
    let total_cost = u64::try_from(cost_u128).map_err(|_| ErrorCode::MathOverflow)?;

    // 1. Transfer Payment (Buyer -> Seller)
    let cpi_accounts_payment = TransferChecked {
        from: ctx.accounts.buyer_payment_account.to_account_info(),
        mint: ctx.accounts.currency_mint.to_account_info(),
        to: ctx.accounts.seller_payment_account.to_account_info(),
        authority: ctx.accounts.buyer.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_payment),
        total_cost,
        ctx.accounts.currency_mint.decimals,
    )?;

    // 2. Transfer Credits (Vault -> Buyer)
    let (_, listing_bump) = Pubkey::find_program_address(
        &[b"listing", listing.project_id.as_bytes(), listing.seller.as_ref()],
        ctx.program_id
    );
    
    let signer_seeds = &[
        b"listing".as_ref(),
        listing.project_id.as_bytes(),
        listing.seller.as_ref(),
        &[listing_bump]
    ];
    let signer = &[&signer_seeds[..]];

    let cpi_accounts_credits = TransferChecked {
        from: ctx.accounts.listing_vault.to_account_info(),
        mint: ctx.accounts.credit_mint.to_account_info(),
        to: ctx.accounts.buyer_credit_account.to_account_info(),
        authority: listing.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_credits, signer),
        amount,
        ctx.accounts.credit_mint.decimals,
    )?;

    // 3. Update Listing
    listing.quantity_available -= amount;
    
    msg!("Bought {} credits from listing.", amount);

    Ok(())
}

pub fn cancel_marketplace_listing(ctx: Context<CancelMarketplaceListing>) -> Result<()> {
    let listing = &ctx.accounts.listing;
    
    // 1. Return remaining tokens to seller
    let amount_remaining = ctx.accounts.listing_vault.amount;
    
    // Seed derivation for signer
    let (_, listing_bump) = Pubkey::find_program_address(
        &[b"listing", listing.project_id.as_bytes(), listing.seller.as_ref()],
        ctx.program_id
    );
    let signer_seeds = &[
        b"listing".as_ref(),
        listing.project_id.as_bytes(),
        listing.seller.as_ref(),
        &[listing_bump]
    ];
    let signer = &[&signer_seeds[..]];

    if amount_remaining > 0 {
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.listing_vault.to_account_info(),
            mint: ctx.accounts.credit_mint.to_account_info(),
            to: ctx.accounts.seller_credit_account.to_account_info(),
            authority: listing.to_account_info(),
        };
        token_interface::transfer_checked(
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer),
            amount_remaining,
            ctx.accounts.credit_mint.decimals,
        )?;
    }
    
    // 2. Close Vault
    let cpi_accounts_close = CloseAccount {
        account: ctx.accounts.listing_vault.to_account_info(),
        destination: ctx.accounts.seller.to_account_info(),
        authority: listing.to_account_info(),
    };
    token_interface::close_account(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_close, signer)
    )?;

    msg!("Marketplace listing cancelled.");

    Ok(())
}