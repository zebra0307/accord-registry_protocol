"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAllPools } from "@/hooks/useOnChainData";
import { formatAddress, lamportsToSol } from "@/lib/data/onchain";
import { LoadingSpinner, EmptyState } from "@/components/ui/EmptyState";

interface PoolDisplay {
    id: string;
    pair: string;
    creditMint: string;
    quoteMint: string;
    tvl: number;
    apr: number;
    volume24h: number;
    feePercent: number;
}

export default function DEXPage() {
    // Fetch pools from on-chain
    const { data: onChainPools, isLoading: loading, error } = useAllPools();

    // Transform on-chain pools to display format
    const pools = useMemo<PoolDisplay[]>(() => {
        if (!onChainPools) return [];

        return onChainPools.filter(p => p.isActive).map((p) => {
            // Calculate TVL based on reserves (simplified)
            const tvl = lamportsToSol(p.creditReserve + p.quoteReserve);
            // Calculate fee percentage
            const feePercent = p.feeDenominator > 0
                ? (p.feeNumerator / p.feeDenominator) * 100
                : 0.3;

            return {
                id: p.publicKey.toString(),
                pair: `${formatAddress(p.creditMint)} / ${formatAddress(p.quoteMint)}`,
                creditMint: p.creditMint.toString(),
                quoteMint: p.quoteMint.toString(),
                tvl,
                apr: 0, // Would need historical data to calculate
                volume24h: 0, // Would need historical data
                feePercent,
            };
        });
    }, [onChainPools]);

    // Calculate stats
    const stats = useMemo(() => ({
        totalValueLocked: pools.reduce((sum, p) => sum + p.tvl, 0),
        volume24h: pools.reduce((sum, p) => sum + p.volume24h, 0),
        totalPools: pools.length,
        totalTraders: 0, // Would need on-chain tracking
    }), [pools]);

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Carbon Credit DEX</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Swap carbon credits or provide liquidity to earn fees
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Link
                        href="/dex/swap"
                        className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl hover:border-emerald-500/50 transition-colors group"
                    >
                        <div className="text-4xl mb-4">💱</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Swap</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Exchange carbon credits for stablecoins instantly
                        </p>
                    </Link>

                    <Link
                        href="/dex/pools"
                        className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl hover:border-purple-500/50 transition-colors group"
                    >
                        <div className="text-4xl mb-4">🌊</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Liquidity Pools</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Provide liquidity and earn trading fees
                        </p>
                    </Link>

                    <Link
                        href="/dex/my-positions"
                        className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">My Positions</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            View and manage your LP positions
                        </p>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Value Locked", value: loading ? "..." : `${stats.totalValueLocked.toFixed(2)} SOL` },
                        { label: "24h Volume", value: loading ? "..." : `${stats.volume24h.toFixed(2)} SOL` },
                        { label: "Total Pools", value: loading ? "..." : stats.totalPools.toString() },
                        { label: "Total Traders", value: loading ? "..." : stats.totalTraders.toString() },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 text-center"
                        >
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Available Pools */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                    <div className="p-6 border-b border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Pools</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : pools.length === 0 ? (
                        <div className="p-12">
                            <EmptyState
                                icon="🌊"
                                title="No Pools Available"
                                description="Be the first to create a liquidity pool for carbon credits"
                                actionLabel="Create Pool"
                                actionHref="/dex/pools/add"
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                            {pools.map((pool) => (
                                <div
                                    key={pool.id}
                                    className="p-6 hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                                    C
                                                </div>
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold border-2 border-gray-800">
                                                    $
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{pool.pair}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{pool.feePercent.toFixed(2)}% fee</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-8">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">TVL</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{pool.tvl.toFixed(2)} SOL</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">APR</div>
                                                <div className="font-semibold text-emerald-400">
                                                    {pool.apr > 0 ? `${pool.apr.toFixed(1)}%` : "—"}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {pool.volume24h > 0 ? `${pool.volume24h.toFixed(2)} SOL` : "—"}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dex/pools/add?pool=${pool.id}`}
                                                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                            >
                                                Add Liquidity
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

