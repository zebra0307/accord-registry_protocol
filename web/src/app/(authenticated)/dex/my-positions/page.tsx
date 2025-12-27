"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

const MOCK_POSITIONS = [
    {
        id: "1",
        poolId: "accord-usdc",
        pair: "ACCORD / USDC",
        lpTokens: 50000,
        creditDeposited: 3333,
        quoteDeposited: 50000,
        currentCreditValue: 3450,
        currentQuoteValue: 51750,
        earnedFees: { credit: 117, quote: 1750 },
        poolShare: 22.7,
        apr: 12.5,
        depositedAt: "2024-12-01",
    },
    {
        id: "2",
        poolId: "accord-sol",
        pair: "ACCORD / SOL",
        lpTokens: 10000,
        creditDeposited: 666,
        quoteDeposited: 50, // 50 SOL
        currentCreditValue: 680,
        currentQuoteValue: 51,
        earnedFees: { credit: 14, quote: 1 },
        poolShare: 4.0,
        apr: 18.2,
        depositedAt: "2024-12-15",
    },
];

export default function MyPositionsPage() {
    const { connected } = useWallet();
    const [expandedPosition, setExpandedPosition] = useState<string | null>(null);

    const totalValueLocked = MOCK_POSITIONS.reduce(
        (sum, p) => sum + (p.currentCreditValue * 15) + p.currentQuoteValue,
        0
    );

    const totalEarnings = MOCK_POSITIONS.reduce(
        (sum, p) => sum + (p.earnedFees.credit * 15) + p.earnedFees.quote,
        0
    );

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to view your positions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/dex" className="text-emerald-400 hover:underline text-sm">
                            ← Back to DEX
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">My LP Positions</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your liquidity provider positions</p>
                    </div>
                    <Link
                        href="/dex/pools"
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90"
                    >
                        + Add Liquidity
                    </Link>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value Locked</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">${totalValueLocked.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Fees Earned</div>
                        <div className="text-3xl font-bold text-emerald-400">${totalEarnings.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Positions</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{MOCK_POSITIONS.length}</div>
                    </div>
                </div>

                {/* Positions List */}
                {MOCK_POSITIONS.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center">
                        <div className="text-4xl mb-4">🌊</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Positions Yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start earning fees by providing liquidity to a pool.
                        </p>
                        <Link
                            href="/dex/pools"
                            className="inline-flex px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 font-medium hover:bg-purple-500/20"
                        >
                            Browse Pools
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {MOCK_POSITIONS.map((position) => (
                            <div
                                key={position.id}
                                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden"
                            >
                                {/* Position Header */}
                                <button
                                    onClick={() => setExpandedPosition(
                                        expandedPosition === position.id ? null : position.id
                                    )}
                                    className="w-full p-6 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                                A
                                            </div>
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                                {position.pair.includes("SOL") ? "◎" : "$"}
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900 dark:text-white">{position.pair}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {position.lpTokens.toLocaleString()} LP tokens • {position.poolShare}% of pool
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Position Value</div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                ${((position.currentCreditValue * 15) + position.currentQuoteValue).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Fees Earned</div>
                                            <div className="font-semibold text-emerald-400">
                                                ${((position.earnedFees.credit * 15) + position.earnedFees.quote).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">APR</div>
                                            <div className="font-semibold text-purple-400">{position.apr}%</div>
                                        </div>
                                        <span className={`text-gray-600 dark:text-gray-400 transition-transform ${expandedPosition === position.id ? "rotate-180" : ""
                                            }`}>
                                            ▼
                                        </span>
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {expandedPosition === position.id && (
                                    <div className="px-6 pb-6 border-t border-gray-700/50">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">ACCORD Deposited</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{position.creditDeposited.toLocaleString()}</div>
                                                <div className="text-xs text-emerald-400">
                                                    Now: {position.currentCreditValue.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {position.pair.includes("SOL") ? "SOL" : "USDC"} Deposited
                                                </div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {position.quoteDeposited.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-emerald-400">
                                                    Now: {position.currentQuoteValue.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Fees Earned (ACCORD)</div>
                                                <div className="font-semibold text-emerald-400">
                                                    +{position.earnedFees.credit.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Fees Earned ({position.pair.includes("SOL") ? "SOL" : "USDC"})
                                                </div>
                                                <div className="font-semibold text-emerald-400">
                                                    +{position.earnedFees.quote.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Deposited on {position.depositedAt}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    href={`/dex/pools/${position.poolId}/add`}
                                                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/20"
                                                >
                                                    Add More
                                                </Link>
                                                <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/20">
                                                    Remove Liquidity
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl">💡</span>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Understanding LP Positions</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                When you provide liquidity, you deposit equal value of both tokens into a pool.
                                In return, you receive LP tokens representing your share. As trades occur,
                                you earn fees proportional to your share. Note that impermanent loss may occur
                                if token prices diverge significantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
