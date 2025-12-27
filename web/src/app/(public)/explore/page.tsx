"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_PROJECTS = [
    {
        id: "ICM-MH-2024-001",
        name: "Mangrove Restoration Mumbai",
        sector: "blueCarbon",
        status: "verified",
        carbonTons: 1000,
        creditsIssued: 800,
        location: { regionName: "Maharashtra", countryCode: "IN" },
        owner: "5abc...xyz",
        qualityRating: 4,
        vintageYear: 2024,
    },
    {
        id: "ICM-KA-2024-002",
        name: "Seagrass Meadow Karnataka",
        sector: "blueCarbon",
        status: "verified",
        carbonTons: 500,
        creditsIssued: 400,
        location: { regionName: "Karnataka", countryCode: "IN" },
        owner: "7def...uvw",
        qualityRating: 5,
        vintageYear: 2024,
    },
    {
        id: "ICM-AP-2024-003",
        name: "Forestry Conservation",
        sector: "forestry",
        status: "awaitingAudit",
        carbonTons: 2000,
        creditsIssued: 0,
        location: { regionName: "Andhra Pradesh", countryCode: "IN" },
        owner: "9ghi...rst",
        qualityRating: 0,
        vintageYear: 2024,
    },
];

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-gray-500/10 text-gray-400",
    awaitingAudit: "bg-yellow-500/10 text-yellow-400",
    underReview: "bg-blue-500/10 text-blue-400",
    verified: "bg-emerald-500/10 text-emerald-400",
    rejected: "bg-red-500/10 text-red-400",
};

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const filteredProjects = MOCK_PROJECTS.filter((project) => {
        const matchesSearch =
            project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Explore Projects</h1>
                    <p className="text-gray-400 mt-2">
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
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
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
                                        : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
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
                        { label: "Total Projects", value: MOCK_PROJECTS.length.toString() },
                        { label: "Verified Projects", value: MOCK_PROJECTS.filter(p => p.status === "verified").length.toString() },
                        { label: "Credits Issued", value: MOCK_PROJECTS.reduce((sum, p) => sum + p.creditsIssued, 0).toLocaleString() },
                        { label: "Countries", value: "1" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center"
                        >
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all card-hover"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-700/50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">{SECTOR_ICONS[project.sector]}</span>
                                        <span className="text-sm text-gray-400 capitalize">{project.sector}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
                                        {project.status.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{project.id}</p>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Estimated Tons</div>
                                        <div className="font-semibold text-white">{project.carbonTons.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Credits Issued</div>
                                        <div className="font-semibold text-emerald-400">{project.creditsIssued.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">
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

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
