"use client";

import { useState } from "react";
import Link from "next/link";

export default function DEXPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Carbon Credit DEX</h1>
                    <p className="text-gray-400 mt-2">
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
                        <h3 className="text-xl font-semibold text-white mb-2">Swap</h3>
                        <p className="text-gray-400">
                            Exchange carbon credits for stablecoins instantly
                        </p>
                    </Link>

                    <Link
                        href="/dex/pools"
                        className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl hover:border-purple-500/50 transition-colors group"
                    >
                        <div className="text-4xl mb-4">🌊</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Liquidity Pools</h3>
                        <p className="text-gray-400">
                            Provide liquidity and earn trading fees
                        </p>
                    </Link>

                    <Link
                        href="/dex/my-positions"
                        className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-colors group"
                    >
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-white mb-2">My Positions</h3>
                        <p className="text-gray-400">
                            View and manage your LP positions
                        </p>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Value Locked", value: "$1.2M" },
                        { label: "24h Volume", value: "$45,230" },
                        { label: "Total Pools", value: "3" },
                        { label: "Total Traders", value: "128" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Available Pools */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <div className="p-6 border-b border-gray-700/50">
                        <h2 className="text-xl font-semibold text-white">Available Pools</h2>
                    </div>

                    <div className="divide-y divide-gray-700/50">
                        {[
                            {
                                pair: "ACCORD / USDC",
                                tvl: "$850,000",
                                apr: "12.5%",
                                volume24h: "$32,100",
                            },
                            {
                                pair: "ACCORD / SOL",
                                tvl: "$250,000",
                                apr: "18.2%",
                                volume24h: "$8,450",
                            },
                            {
                                pair: "ACCORD / USDT",
                                tvl: "$100,000",
                                apr: "9.8%",
                                volume24h: "$4,680",
                            },
                        ].map((pool) => (
                            <div
                                key={pool.pair}
                                className="p-6 hover:bg-gray-700/20 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-800">
                                                A
                                            </div>
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-800">
                                                $
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{pool.pair}</div>
                                            <div className="text-sm text-gray-400">0.3% fee</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">TVL</div>
                                            <div className="font-semibold text-white">{pool.tvl}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">APR</div>
                                            <div className="font-semibold text-emerald-400">{pool.apr}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">24h Volume</div>
                                            <div className="font-semibold text-white">{pool.volume24h}</div>
                                        </div>
                                        <Link
                                            href={`/dex/pools/${pool.pair.replace(" / ", "-").toLowerCase()}`}
                                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                        >
                                            Add Liquidity
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
