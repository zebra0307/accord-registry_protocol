"use client";

import { useState } from "react";

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

    // Mock data
    const platformStats = {
        totalProjects: 45,
        verifiedProjects: 38,
        totalCreditsIssued: 125000,
        creditsRetired: 45000,
        tvl: 1200000,
        totalTraders: 1250,
    };

    const recentTransactions = [
        { type: "mint", project: "ICM-MH-2024-001", amount: 500, time: "2 hours ago" },
        { type: "retire", project: "ICM-KA-2024-002", amount: 100, time: "5 hours ago" },
        { type: "trade", from: "5abc...", to: "7def...", amount: 250, time: "8 hours ago" },
        { type: "verify", project: "ICM-AP-2024-003", time: "1 day ago" },
        { type: "register", project: "ICM-TN-2024-006", time: "2 days ago" },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
                        <p className="text-gray-400 mt-1">Real-time insights into the Accord Registry</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {[
                            { id: "7d", label: "7 Days" },
                            { id: "30d", label: "30 Days" },
                            { id: "all", label: "All Time" },
                        ].map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range.id
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {[
                        { label: "Total Projects", value: platformStats.totalProjects, icon: "📋" },
                        { label: "Verified", value: platformStats.verifiedProjects, icon: "✅", color: "text-emerald-400" },
                        { label: "Credits Issued", value: `${(platformStats.totalCreditsIssued / 1000).toFixed(0)}K`, icon: "🌿" },
                        { label: "Credits Retired", value: `${(platformStats.creditsRetired / 1000).toFixed(0)}K`, icon: "🔥", color: "text-orange-400" },
                        { label: "TVL", value: `$${(platformStats.tvl / 1000000).toFixed(1)}M`, icon: "💰", color: "text-purple-400" },
                        { label: "Total Traders", value: platformStats.totalTraders.toLocaleString(), icon: "👥" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">{stat.icon}</span>
                                <span className="text-xs text-gray-400">{stat.label}</span>
                            </div>
                            <div className={`text-2xl font-bold ${stat.color || "text-white"}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Volume Chart Placeholder */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Trading Volume</h3>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t"
                                    style={{ height: `${Math.random() * 80 + 20}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-500">
                            <span>Dec 13</span>
                            <span>Dec 27</span>
                        </div>
                    </div>

                    {/* Credit Issuance Placeholder */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Credit Issuance vs Retirement</h3>
                        <div className="h-64 flex items-end justify-between space-x-1">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col space-y-1">
                                    <div
                                        className="bg-emerald-500 rounded-t"
                                        style={{ height: `${Math.random() * 50 + 30}%` }}
                                    />
                                    <div
                                        className="bg-orange-500 rounded-t"
                                        style={{ height: `${Math.random() * 30 + 10}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center space-x-6 mt-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded" />
                                <span className="text-sm text-gray-400">Issued</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-orange-500 rounded" />
                                <span className="text-sm text-gray-400">Retired</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Projects */}
                    <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Top Projects by Credits</h3>
                        <div className="space-y-4">
                            {[
                                { rank: 1, id: "ICM-MH-2024-001", name: "Mangrove Restoration", credits: 12500 },
                                { rank: 2, id: "ICM-KA-2024-002", name: "Seagrass Meadow", credits: 8400 },
                                { rank: 3, id: "ICM-GO-2023-005", name: "Solar Farm Initiative", credits: 6200 },
                                { rank: 4, id: "ICM-AP-2024-003", name: "Forestry Conservation", credits: 5100 },
                                { rank: 5, id: "ICM-TN-2024-006", name: "Wind Energy Project", credits: 4800 },
                            ].map((project) => (
                                <div key={project.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${project.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                                                project.rank === 2 ? "bg-gray-300/20 text-gray-300" :
                                                    project.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                                                        "bg-gray-700 text-gray-400"
                                            }`}>
                                            {project.rank}
                                        </span>
                                        <div>
                                            <div className="font-medium text-white">{project.name}</div>
                                            <div className="text-sm text-gray-400">{project.id}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-emerald-400">{project.credits.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">credits</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentTransactions.map((tx, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                    <span className="text-lg">
                                        {tx.type === "mint" ? "🌿" :
                                            tx.type === "retire" ? "🔥" :
                                                tx.type === "trade" ? "💱" :
                                                    tx.type === "verify" ? "✅" : "📋"}
                                    </span>
                                    <div className="flex-1">
                                        <div className="text-sm text-white">
                                            {tx.type === "mint" && `Minted ${tx.amount} credits`}
                                            {tx.type === "retire" && `Retired ${tx.amount} credits`}
                                            {tx.type === "trade" && `Traded ${tx.amount} credits`}
                                            {tx.type === "verify" && `Project verified`}
                                            {tx.type === "register" && `New project registered`}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {tx.project} • {tx.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
