"use client";

import { useState, useMemo } from "react";
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
    volume24h: number;
    apr: number;
    feeBps: number;
    creditReserve: number;
    quoteReserve: number;
}

export default function PoolsPage() {
    const [sortBy, setSortBy] = useState<"tvl" | "apr" | "volume">("tvl");

    // Fetch pools from on-chain
    const { data: onChainPools, isLoading: loading } = useAllPools();

    // Transform on-chain pools to display format
    const pools = useMemo<PoolDisplay[]>(() => {
        if (!onChainPools) return [];

        return onChainPools.filter(p => p.isActive).map((p) => {
            const feePercent = p.feeDenominator > 0
                ? (p.feeNumerator / p.feeDenominator) * 100
                : 0.3;

            return {
                id: p.publicKey.toString(),
                pair: `${formatAddress(p.creditMint)} / ${formatAddress(p.quoteMint)}`,
                creditMint: p.creditMint.toString(),
                quoteMint: p.quoteMint.toString(),
                tvl: lamportsToSol(p.creditReserve + p.quoteReserve),
                volume24h: 0, // Would need historical data
                apr: 0, // Would need historical calculation
                feeBps: Math.round(feePercent * 100),
                creditReserve: lamportsToSol(p.creditReserve),
                quoteReserve: lamportsToSol(p.quoteReserve),
            };
        });
    }, [onChainPools]);

    const sortedPools = useMemo(() => {
        return [...pools].sort((a, b) => {
            switch (sortBy) {
                case "tvl":
                    return b.tvl - a.tvl;
                case "apr":
                    return b.apr - a.apr;
                case "volume":
                    return b.volume24h - a.volume24h;
                default:
                    return 0;
            }
        });
    }, [pools, sortBy]);

    const stats = useMemo(() => ({
        totalTvl: pools.reduce((sum, p) => sum + p.tvl, 0),
        totalVolume: pools.reduce((sum, p) => sum + p.volume24h, 0),
        activePools: pools.length,
    }), [pools]);


    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/dex" className="text-emerald-400 hover:underline text-sm">
                            ← Back to DEX
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Liquidity Pools</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Provide liquidity and earn trading fees</p>
                    </div>
                    <Link
                        href="/dex/pools/create"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        + Create Pool
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Total Value Locked", value: loading ? "..." : `${stats.totalTvl.toFixed(2)} SOL` },
                        { label: "24h Trading Volume", value: loading ? "..." : `${stats.totalVolume.toFixed(2)} SOL` },
                        { label: "Active Pools", value: loading ? "..." : stats.activePools.toString() },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 text-center"
                        >
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>


                {/* Sort Options */}
                <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Sort by:</span>
                    {[
                        { id: "tvl", label: "TVL" },
                        { id: "apr", label: "APR" },
                        { id: "volume", label: "Volume" },
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSortBy(option.id as any)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${sortBy === option.id
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Pools Table */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Pool</th>
                                <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">TVL</th>
                                <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">APR</th>
                                <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">24h Volume</th>
                                <th className="text-center p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Fee</th>
                                <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                            {sortedPools.map((pool) => (
                                <tr key={pool.id} className="hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold border-2 border-gray-800">
                                                    A
                                                </div>
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold border-2 border-gray-800">
                                                    {pool.quoteMint === "SOL" ? "◎" : "$"}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{pool.pair}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{pool.feeBps / 100}% fee tier</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">${pool.tvl.toLocaleString()}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-medium text-emerald-400">{pool.apr}%</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">${pool.volume24h.toLocaleString()}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded text-xs text-gray-300">
                                            {pool.feeBps / 100}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/dex/pools/${pool.id}/add`}
                                                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                                            >
                                                Add
                                            </Link>
                                            <Link
                                                href={`/dex/pools/${pool.id}`}
                                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-600/50 transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* How it Works */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">How Liquidity Providing Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                step: "1",
                                title: "Add Liquidity",
                                description: "Deposit equal value of both tokens into a pool",
                            },
                            {
                                step: "2",
                                title: "Earn Fees",
                                description: "Earn a share of trading fees proportional to your pool share",
                            },
                            {
                                step: "3",
                                title: "Withdraw Anytime",
                                description: "Remove liquidity and claim your tokens plus earned fees",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6"
                            >
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
