import { PublicKey } from "@solana/web3.js";

export interface LiquidityPool {
    authority: PublicKey;
    creditMint: PublicKey;
    quoteMint: PublicKey;
    creditReserve: number;
    quoteReserve: number;
    lpTokenSupply: number;
    feeBps: number;
    bump: number;
}

export interface PoolPosition {
    poolPda: PublicKey;
    lpBalance: number;
    creditValue: number;
    quoteValue: number;
    sharePercentage: number;
}

export interface SwapQuote {
    amountIn: number;
    amountOut: number;
    priceImpact: number;
    fee: number;
    minAmountOut: number;
}

export interface AddLiquidityPreview {
    creditAmount: number;
    quoteAmount: number;
    lpTokensToReceive: number;
    shareOfPool: number;
}

export interface RemoveLiquidityPreview {
    lpTokensToRemove: number;
    creditToReceive: number;
    quoteToReceive: number;
}
