"use client";

import { useState, useMemo } from "react";
import { usePlatformStats, useAllProjects } from "@/hooks/useOnChainData";
import { LoadingSpinner } from "@/components/ui/EmptyState";

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

    // Fetch real platform stats
    const { data: platformStats, isLoading: loadingStats } = usePlatformStats();
    const { data: allProjects, isLoading: loadingProjects } = useAllProjects();

    const loading = loadingStats || loadingProjects;

    // Calculate top projects by credits issued
    const topProjects = useMemo(() => {
        if (!allProjects) return [];
        return [...allProjects]
            .sort((a, b) => b.creditsIssued - a.creditsIssued)
            .slice(0, 5)
            .map((p, i) => ({
                rank: i + 1,
                id: p.projectId,
                name: p.projectId,
                credits: p.creditsIssued,
            }));
    }, [allProjects]);

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time insights into the Accord Registry</p>
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
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                        { label: "Total Projects", value: loading ? "..." : platformStats?.totalProjects ?? 0, icon: "📋" },
                        { label: "Verified", value: loading ? "..." : platformStats?.verifiedProjects ?? 0, icon: "✅", color: "text-emerald-400" },
                        { label: "Credits Issued", value: loading ? "..." : `${((platformStats?.totalCreditsIssued ?? 0) / 1000).toFixed(0)}K`, icon: "🌿" },
                        { label: "Credits Minted", value: loading ? "..." : `${((platformStats?.totalCreditsMinted ?? 0) / 1000).toFixed(0)}K`, icon: "🪙", color: "text-blue-400" },
                        { label: "Active Listings", value: loading ? "..." : platformStats?.totalActiveListings ?? 0, icon: "🏪", color: "text-purple-400" },
                        { label: "Countries", value: loading ? "..." : platformStats?.uniqueCountries ?? 0, icon: "🌍" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">{stat.icon}</span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                            </div>
                            <div className={`text-2xl font-bold ${stat.color || "text-gray-900 dark:text-white"}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>


                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Volume Chart Placeholder */}
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trading Volume</h3>
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
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Credit Issuance vs Retirement</h3>
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
                                <span className="text-sm text-gray-600 dark:text-gray-400">Issued</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-orange-500 rounded" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Retired</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Projects */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Projects by Credits</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : topProjects.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400 text-center py-8">No projects registered yet</p>
                            ) : (
                                topProjects.map((project) => (
                                    <div key={project.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${project.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                                                project.rank === 2 ? "bg-gray-300/20 text-gray-300" :
                                                    project.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                                                        "bg-gray-700 text-gray-600 dark:text-gray-400"
                                                }`}>
                                                {project.rank}
                                            </span>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{project.id}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-emerald-400">{project.credits.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">credits</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4 text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                On-chain activity tracking coming soon
                            </p>
                            <p className="text-xs text-gray-500">
                                Transaction history will be displayed here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
