use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, MintTo, Burn, TransferChecked};

use crate::instructions::{contexts::*, errors::ErrorCode};

pub fn initialize_pool(
    ctx: Context<InitializePool>,
    fee_basis_points: u16,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    
    pool.authority = ctx.accounts.authority.key();
    pool.credit_mint = ctx.accounts.credit_mint.key();
    pool.quote_mint = ctx.accounts.quote_mint.key();
    pool.credit_vault = ctx.accounts.credit_vault.key();
    pool.quote_vault = ctx.accounts.quote_vault.key();
    pool.lp_mint = ctx.accounts.lp_mint.key();
    pool.fee_basis_points = fee_basis_points;
    pool.total_liquidity = 0;
    pool.bump = ctx.bumps.pool;

    msg!("Liquidity Pool initialized for Credit/Quote pair");

    Ok(())
}

pub fn add_liquidity(
    ctx: Context<AddLiquidity>,
    credit_amount: u64,
    quote_amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let total_liquidity = pool.total_liquidity;
    let lp_supply = ctx.accounts.lp_mint.supply;
    
    let current_credit_reserve = ctx.accounts.credit_vault.amount;
    let current_quote_reserve = ctx.accounts.quote_vault.amount;

    let liquidity_to_mint: u64;

    if total_liquidity == 0 {
        // Initial liquidity: sqrt(x * y)
        // Adjust for decimals if needed, but assuming standard logic
        let product = (credit_amount as u128)
            .checked_mul(quote_amount as u128)
            .ok_or(ErrorCode::MathOverflow)?;
        liquidity_to_mint = (product as f64).sqrt() as u64;
        
        // Lock minimum liquidity could be here, but skipping for simplicity
    } else {
        // Subsequent liquidity: min(x / reserve_x * total_lp, y / reserve_y * total_lp)
        // This enforces price ratio maintenance
        let credit_share = (credit_amount as u128)
            .checked_mul(lp_supply as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(current_credit_reserve as u128)
            .unwrap_or(0);
            
        let quote_share = (quote_amount as u128)
            .checked_mul(lp_supply as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(current_quote_reserve as u128)
            .unwrap_or(0);
            
        liquidity_to_mint = std::cmp::min(credit_share, quote_share) as u64;
    }

    require!(liquidity_to_mint > 0, ErrorCode::LiquidityZero);
    
    // Transfer Credit Tokens to Vault
    let cpi_accounts_credit = TransferChecked {
        from: ctx.accounts.user_credit_account.to_account_info(),
        mint: ctx.accounts.credit_mint.to_account_info(),
        to: ctx.accounts.credit_vault.to_account_info(),
        authority: ctx.accounts.provider.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_credit),
        credit_amount,
        ctx.accounts.credit_mint.decimals,
    )?;

    // Transfer Quote Tokens to Vault
    let cpi_accounts_quote = TransferChecked {
        from: ctx.accounts.user_quote_account.to_account_info(),
        mint: ctx.accounts.quote_mint.to_account_info(),
        to: ctx.accounts.quote_vault.to_account_info(),
        authority: ctx.accounts.provider.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_quote),
        quote_amount,
        ctx.accounts.quote_mint.decimals,
    )?;

    // Mint LP Tokens to User
    let seeds = &[
        b"liquidity_pool", 
        pool.credit_mint.as_ref(), 
        pool.quote_mint.as_ref(), 
        &[pool.bump]
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts_mint = MintTo {
        mint: ctx.accounts.lp_mint.to_account_info(),
        to: ctx.accounts.user_lp_account.to_account_info(),
        authority: pool.to_account_info(),
    };
    token_interface::mint_to(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_mint, signer),
        liquidity_to_mint,
    )?;

    pool.total_liquidity += liquidity_to_mint;
    
    msg!("Added Liquidity: {} Credit, {} Quote. Minted {} LP.", credit_amount, quote_amount, liquidity_to_mint);

    Ok(())
}

pub fn remove_liquidity(
    ctx: Context<RemoveLiquidity>,
    lp_amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let lp_supply = ctx.accounts.lp_mint.supply;
    
    let current_credit_reserve = ctx.accounts.credit_vault.amount;
    let current_quote_reserve = ctx.accounts.quote_vault.amount;

    require!(lp_amount > 0, ErrorCode::LiquidityZero);
    require!(lp_amount <= ctx.accounts.user_lp_account.amount, ErrorCode::InsufficientFunds);

    // Calculate amounts to return
    let credit_amount = (lp_amount as u128)
        .checked_mul(current_credit_reserve as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(lp_supply as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;

    let quote_amount = (lp_amount as u128)
        .checked_mul(current_quote_reserve as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(lp_supply as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;

    // Burn LP tokens
    let cpi_accounts_burn = Burn {
        mint: ctx.accounts.lp_mint.to_account_info(),
        from: ctx.accounts.user_lp_account.to_account_info(),
        authority: ctx.accounts.provider.to_account_info(),
    };
    token_interface::burn(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_burn),
        lp_amount,
    )?;

    // Transfer amounts back
    let seeds = &[
        b"liquidity_pool", 
        pool.credit_mint.as_ref(), 
        pool.quote_mint.as_ref(), 
        &[pool.bump]
    ];
    let signer = &[&seeds[..]];

    // Transfer Credit
    let cpi_accounts_credit = TransferChecked {
        from: ctx.accounts.credit_vault.to_account_info(),
        mint: ctx.accounts.credit_mint.to_account_info(),
        to: ctx.accounts.user_credit_account.to_account_info(),
        authority: pool.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_credit, signer),
        credit_amount,
        ctx.accounts.credit_mint.decimals,
    )?;

    // Transfer Quote
    let cpi_accounts_quote = TransferChecked {
        from: ctx.accounts.quote_vault.to_account_info(),
        mint: ctx.accounts.quote_mint.to_account_info(),
        to: ctx.accounts.user_quote_account.to_account_info(),
        authority: pool.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_quote, signer),
        quote_amount,
        ctx.accounts.quote_mint.decimals,
    )?;

    pool.total_liquidity -= lp_amount;

    msg!("Removed Liquidity: burned {} LP, returned {} Credit, {} Quote.", lp_amount, credit_amount, quote_amount);
    
    Ok(())
}

pub fn swap(
    ctx: Context<Swap>,
    amount_in: u64,
    min_amount_out: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    
    let is_credit_input = ctx.accounts.user_source_account.mint == pool.credit_mint;
    
    // Determine Reserves
    let (input_reserve, output_reserve, input_vault, output_vault) = if is_credit_input {
        (
            ctx.accounts.credit_vault.amount, 
            ctx.accounts.quote_vault.amount,
            &ctx.accounts.credit_vault,
            &ctx.accounts.quote_vault
        )
    } else {
        (
            ctx.accounts.quote_vault.amount,
            ctx.accounts.credit_vault.amount,
            &ctx.accounts.quote_vault,
            &ctx.accounts.credit_vault
        )
    };

    // Calculate Fees
    let fee_amount = (amount_in as u128)
        .checked_mul(pool.fee_basis_points as u128)
        .unwrap()
        .checked_div(10000)
        .unwrap() as u64;
    
    let amount_in_after_fee = amount_in - fee_amount;

    // Constant Product Formula: k = x * y
    // (x + dx) * (y - dy) = xy
    // y - dy = xy / (x + dx)
    // dy = y - (xy / (x + dx))
    
    let k = (input_reserve as u128) .checked_mul(output_reserve as u128).unwrap();
    let new_input_reserve = (input_reserve as u128).checked_add(amount_in_after_fee as u128).unwrap();
    
    let new_output_reserve = k.checked_div(new_input_reserve).unwrap();
    let amount_out = (output_reserve as u128).checked_sub(new_output_reserve).unwrap() as u64;

    require!(amount_out >= min_amount_out, ErrorCode::SlippageExceeded);

    // Transfer Input to Vault
    let cpi_accounts_in = TransferChecked {
        from: ctx.accounts.user_source_account.to_account_info(),
        mint: if is_credit_input { ctx.accounts.credit_mint.to_account_info() } else { ctx.accounts.quote_mint.to_account_info() },
        to: input_vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_in),
        amount_in,
        if is_credit_input { ctx.accounts.credit_mint.decimals } else { ctx.accounts.quote_mint.decimals },
    )?;

    // Transfer Output from Vault
    let seeds = &[
        b"liquidity_pool", 
        pool.credit_mint.as_ref(), 
        pool.quote_mint.as_ref(), 
        &[pool.bump]
    ];
    let signer = &[&seeds[..]];

    // Transfer Output from Vault
    let cpi_accounts_out = TransferChecked {
        from: output_vault.to_account_info(),
        mint: if is_credit_input { ctx.accounts.quote_mint.to_account_info() } else { ctx.accounts.credit_mint.to_account_info() },
        to: ctx.accounts.user_destination_account.to_account_info(),
        authority: pool.to_account_info(),
    };
    token_interface::transfer_checked(
        CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts_out, signer),
        amount_out,
        if is_credit_input { ctx.accounts.quote_mint.decimals } else { ctx.accounts.credit_mint.decimals },
    )?;

    msg!("Swap Success: In {}, Out {}", amount_in, amount_out);

    Ok(())
}
