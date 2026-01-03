"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useInitializePool, useAddLiquidity } from "@/hooks";
import { showToast } from "@/components/ui/Toast";
import { PublicKey } from "@solana/web3.js";

export default function AddLiquidityPage() {
    const { connected } = useWallet();
    const [creditAmount, setCreditAmount] = useState("");
    const [quoteAmount, setQuoteAmount] = useState("");
    const [slippage, setSlippage] = useState("0.5");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock pool data
    const pool = {
        pair: "ACCORD / USDC",
        creditMint: "ACCORD",
        quoteMint: "USDC",
        creditReserve: 56666,
        quoteReserve: 850000,
        totalLpTokens: 219544,
        apr: 12.5,
        feeBps: 30,
        userCreditBalance: 1500,
        userQuoteBalance: 25000,
    };

    // Calculate exchange rate
    const exchangeRate = pool.quoteReserve / pool.creditReserve;

    const handleCreditChange = (value: string) => {
        setCreditAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const quoteNeeded = parseFloat(value) * exchangeRate;
            setQuoteAmount(quoteNeeded.toFixed(2));
        } else {
            setQuoteAmount("");
        }
    };

    const handleQuoteChange = (value: string) => {
        setQuoteAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const creditNeeded = parseFloat(value) / exchangeRate;
            setCreditAmount(creditNeeded.toFixed(6));
        } else {
            setCreditAmount("");
        }
    };

    // Calculate LP tokens to receive
    const lpTokensToReceive = creditAmount && quoteAmount
        ? ((parseFloat(creditAmount) / pool.creditReserve) * pool.totalLpTokens).toFixed(2)
        : "0.00";

    // Calculate pool share
    const poolShare = creditAmount && quoteAmount
        ? ((parseFloat(creditAmount) / (pool.creditReserve + parseFloat(creditAmount))) * 100).toFixed(4)
        : "0.0000";

    const initializePoolMutation = useInitializePool();
    const addLiquidityMutation = useAddLiquidity();

    const handleAddLiquidity = async () => {
        if (!creditAmount || !quoteAmount) return;

        setIsSubmitting(true);
        const loadingToast = showToast.loading("Adding liquidity...");

        try {
            // Note: In a real scenario, we would check if pool exists. 
            // If not, initialize it first. For MVP, we'll try to initialize then add liquidity
            // or just add if it already exists (handled by program logic or separate flow).
            // Here we assume we might need to initialize if it's a new pair.

            // For simplicity in this MVP implementation, we'll assume we are adding to an existing pool
            // OR initializing a new one if this page is reached with intent to create.
            // Let's try to initialize first, if it fails (likely because it exists), we proceed to add liquidity.
            // Ideally, we'd check existence first.

            // Note: The UI currently mocks pool data. In production, 'pool' should come from on-chain data.
            // We'll use the mock mints for now but cast them to PublicKeys.
            // Replace these with REAL mint addresses in production!
            const creditMint = new PublicKey("CreditMintAddress1111111111111111111111111");
            const quoteMint = new PublicKey("QuoteMintAddress1111111111111111111111111");

            // 1. Initialize Pool (if needed) - This would typically be a separate "Create Pool" flow
            // caused by a "Pool not found" state.
            // await initializePoolMutation.mutateAsync({
            //    creditMint,
            //    quoteMint,
            //    feeBasisPoints: 30
            // });

            // 2. Add Liquidity
            const result = await addLiquidityMutation.mutateAsync({
                creditMint,
                quoteMint,
                amountA: parseFloat(creditAmount),
                amountB: parseFloat(quoteAmount),
            });

            showToast.dismiss(loadingToast as any);
            showToast.success("Liquidity added successfully!", result.signature);

            setCreditAmount("");
            setQuoteAmount("");
        } catch (error: any) {
            showToast.dismiss(loadingToast as any);
            showToast.error("Failed to add liquidity", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to add liquidity.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-lg mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dex/pools" className="text-emerald-400 hover:underline">
                        ← Back to Pools
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Liquidity</h1>
                    <div className="w-20" />
                </div>

                {/* Pool Info */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex -space-x-2">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                    A
                                </div>
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                    $
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{pool.pair}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{pool.feeBps / 100}% fee tier</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">APR</div>
                            <div className="font-semibold text-emerald-400">{pool.apr}%</div>
                        </div>
                    </div>
                </div>

                {/* Add Liquidity Form */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6">
                    {/* Credit Input */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{pool.creditMint}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Balance: {pool.userCreditBalance.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center bg-gray-900 rounded-xl p-4">
                            <input
                                type="number"
                                value={creditAmount}
                                onChange={(e) => handleCreditChange(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl text-gray-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleCreditChange(pool.userCreditBalance.toString())}
                                    className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium hover:bg-emerald-500/20"
                                >
                                    MAX
                                </button>
                                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold">
                                        A
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">{pool.creditMint}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plus Icon */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <div className="w-10 h-10 bg-gray-700 border-4 border-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                            +
                        </div>
                    </div>

                    {/* Quote Input */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{pool.quoteMint}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Balance: {pool.userQuoteBalance.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center bg-gray-900 rounded-xl p-4">
                            <input
                                type="number"
                                value={quoteAmount}
                                onChange={(e) => handleQuoteChange(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl text-gray-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuoteChange(pool.userQuoteBalance.toString())}
                                    className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/20"
                                >
                                    MAX
                                </button>
                                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold">
                                        $
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-medium">{pool.quoteMint}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prices & Pool Share */}
                    {creditAmount && quoteAmount && parseFloat(creditAmount) > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
                                <span className="text-gray-900 dark:text-white">
                                    1 {pool.creditMint} = {exchangeRate.toFixed(2)} {pool.quoteMint}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">LP Tokens to Receive</span>
                                <span className="text-gray-900 dark:text-white">{lpTokensToReceive} LP</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Share of Pool</span>
                                <span className="text-emerald-400">{poolShare}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Slippage Tolerance</span>
                                <div className="flex items-center space-x-2">
                                    {["0.1", "0.5", "1.0"].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSlippage(s)}
                                            className={`px-2 py-1 rounded text-xs ${slippage === s
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            {s}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <span className="text-xl">💡</span>
                            <div className="text-sm">
                                <p className="text-purple-400 font-medium">Earning Fees</p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    As a liquidity provider, you'll earn {pool.feeBps / 100}% of all trades in this pool
                                    proportional to your share. Current APR: {pool.apr}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleAddLiquidity}
                        disabled={
                            !creditAmount ||
                            !quoteAmount ||
                            parseFloat(creditAmount) <= 0 ||
                            parseFloat(creditAmount) > pool.userCreditBalance ||
                            parseFloat(quoteAmount) > pool.userQuoteBalance ||
                            isSubmitting
                        }
                        className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {isSubmitting ? "Adding Liquidity..." : "Add Liquidity"}
                    </button>
                </div>

                {/* Current Pool Stats */}
                <div className="mt-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Current Pool Stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Credit Reserve</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{pool.creditReserve.toLocaleString()} {pool.creditMint}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Quote Reserve</div>
                            <div className="font-semibold text-gray-900 dark:text-white">${pool.quoteReserve.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Total LP Supply</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{pool.totalLpTokens.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <div className="text-gray-600 dark:text-gray-400">Fee Tier</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{pool.feeBps / 100}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
