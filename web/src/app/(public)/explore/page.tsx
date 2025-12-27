"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllProjects } from "@/hooks/useOnChainData";
import { formatAddress } from "@/lib/data/onchain";

interface Project {
    id: string;
    name: string;
    sector: string;
    status: string;
    carbonTons: number;
    creditsIssued: number;
    location: { regionName: string; countryCode: string };
    owner: string;
    qualityRating: number;
    vintageYear: number;
}

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    awaitingAudit: "bg-yellow-500/10 text-yellow-400",
    underReview: "bg-blue-500/10 text-blue-400",
    verified: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
};

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Fetch all projects from on-chain
    const { data: onChainProjects, isLoading: loading, error } = useAllProjects();

    // Transform on-chain data to UI format
    const projects = useMemo<Project[]>(() => {
        if (!onChainProjects) return [];

        return onChainProjects.map((p) => ({
            id: p.projectId,
            name: p.projectId,
            sector: p.projectSector,
            status: p.verificationStatus,
            carbonTons: p.carbonTonsEstimated,
            creditsIssued: p.creditsIssued,
            location: {
                regionName: p.location.regionName,
                countryCode: p.location.countryCode,
            },
            owner: formatAddress(p.owner),
            qualityRating: p.qualityRating,
            vintageYear: p.vintageYear,
        }));
    }, [onChainProjects]);

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = useMemo(() => ({
        totalProjects: projects.length,
        verifiedProjects: projects.filter(p => p.status === "verified").length,
        creditsIssued: projects.reduce((sum, p) => sum + p.creditsIssued, 0),
        countries: new Set(projects.map(p => p.location.countryCode).filter(Boolean)).size || 0,
    }), [projects]);

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Discover verified carbon credit projects from around the world
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search by Project ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        {[
                            { id: "all", label: "All" },
                            { id: "verified", label: "Verified" },
                            { id: "awaitingAudit", label: "Awaiting Audit" },
                        ].map((status) => (
                            <button
                                key={status.id}
                                onClick={() => setSelectedStatus(status.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === status.id
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-700/50 hover:border-gray-600"
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Projects", value: stats.totalProjects.toString() },
                        { label: "Verified Projects", value: stats.verifiedProjects.toString() },
                        { label: "Credits Issued", value: stats.creditsIssued.toLocaleString() },
                        { label: "Countries", value: stats.countries.toString() },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 text-center"
                        >
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && projects.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            Be the first to register a carbon credit project on the Accord Registry.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90"
                        >
                            Register a Project
                        </Link>
                    </div>
                )}

                {/* Projects Grid */}
                {!loading && filteredProjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/project/${project.id}`}
                                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all card-hover"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-gray-700/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl">{SECTOR_ICONS[project.sector] || "🌍"}</span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{project.sector}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] || STATUS_COLORS.pending}`}>
                                            {project.status.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.id}</p>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Tons</div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{project.carbonTons.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Credits Issued</div>
                                            <div className="font-semibold text-emerald-400">{project.creditsIssued.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            📍 {project.location.regionName}, {project.location.countryCode}
                                        </span>
                                        {project.qualityRating > 0 && (
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-sm ${i < project.qualityRating ? "text-yellow-400" : "text-gray-600"}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && projects.length > 0 && filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
