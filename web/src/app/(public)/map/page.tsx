"use client";

import { useState } from "react";
import Link from "next/link";

// Mock project locations
const projects = [
    {
        id: "ICM-MH-2024-001",
        name: "Mangrove Restoration Mumbai",
        lat: 19.076,
        lng: 72.877,
        sector: "blueCarbon",
        status: "verified",
        carbonTons: 1000,
        h3Index: "8c2a100d2dbffff",
    },
    {
        id: "ICM-KA-2024-002",
        name: "Seagrass Meadow Karnataka",
        lat: 13.935,
        lng: 74.613,
        sector: "blueCarbon",
        status: "verified",
        carbonTons: 500,
        h3Index: "8c2a100d2dcffff",
    },
    {
        id: "ICM-AP-2024-003",
        name: "Forestry Conservation",
        lat: 15.912,
        lng: 79.740,
        sector: "forestry",
        status: "awaitingAudit",
        carbonTons: 2000,
        h3Index: "8c2a100d2ddffff",
    },
    {
        id: "ICM-GO-2023-005",
        name: "Solar Farm Initiative",
        lat: 15.299,
        lng: 74.124,
        sector: "renewableEnergy",
        status: "verified",
        carbonTons: 800,
        h3Index: "8c2a100d2deffff",
    },
];

const SECTOR_COLORS: Record<string, string> = {
    blueCarbon: "#14b8a6",
    forestry: "#22c55e",
    renewableEnergy: "#eab308",
    wasteManagement: "#8b5cf6",
    agriculture: "#f97316",
    industrial: "#6b7280",
};

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

export default function MapPage() {
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const [mapView, setMapView] = useState<"satellite" | "terrain">("satellite");

    // Calculate map bounds for India
    const centerLat = 20.5937;
    const centerLng = 78.9629;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Map</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Explore carbon credit projects geospatially with H3 hexagon indexing
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setMapView("satellite")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mapView === "satellite"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                                }`}
                        >
                            🛰️ Satellite
                        </button>
                        <button
                            onClick={() => setMapView("terrain")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mapView === "terrain"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                                }`}
                        >
                            🗺️ Terrain
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Map Area */}
                    <div className="flex-1">
                        <div className="relative bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden aspect-[4/3]">
                            {/* Map Background (placeholder - would be replaced with real map) */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: mapView === "satellite"
                                        ? "linear-gradient(135deg, #1a365d 0%, #1e3a5f 25%, #234e52 50%, #22543d 75%, #1a365d 100%)"
                                        : "linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #2d3748 100%)",
                                }}
                            >
                                {/* Grid overlay for H3 effect */}
                                <svg className="absolute inset-0 w-full h-full opacity-20">
                                    <defs>
                                        <pattern id="hexPattern" width="60" height="52" patternUnits="userSpaceOnUse">
                                            <path
                                                d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
                                                fill="none"
                                                stroke="#10b981"
                                                strokeWidth="0.5"
                                            />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#hexPattern)" />
                                </svg>

                                {/* Project Markers */}
                                {projects.map((project, index) => {
                                    // Calculate position on the placeholder map (normalized)
                                    const x = ((project.lng - 70) / 20) * 100; // 70-90 range for India
                                    const y = ((25 - project.lat) / 15) * 100; // 10-25 range for India

                                    return (
                                        <button
                                            key={project.id}
                                            onClick={() => setSelectedProject(project)}
                                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${selectedProject?.id === project.id ? "scale-125 z-10" : "hover:scale-110"
                                                }`}
                                            style={{
                                                left: `${Math.max(10, Math.min(90, x))}%`,
                                                top: `${Math.max(10, Math.min(90, y))}%`,
                                            }}
                                        >
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border-2"
                                                style={{
                                                    backgroundColor: `${SECTOR_COLORS[project.sector]}20`,
                                                    borderColor: SECTOR_COLORS[project.sector],
                                                }}
                                            >
                                                {SECTOR_ICONS[project.sector]}
                                            </div>
                                            {/* Pulse effect for verified projects */}
                                            {project.status === "verified" && (
                                                <span
                                                    className="absolute inset-0 rounded-xl animate-ping opacity-30"
                                                    style={{ backgroundColor: SECTOR_COLORS[project.sector] }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Map Controls */}
                            <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                    +
                                </button>
                                <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                    −
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Project Types</h4>
                                <div className="space-y-2">
                                    {Object.entries(SECTOR_ICONS).slice(0, 4).map(([sector, icon]) => (
                                        <div key={sector} className="flex items-center space-x-2 text-sm">
                                            <span>{icon}</span>
                                            <span className="text-gray-300 capitalize">{sector.replace(/([A-Z])/g, " $1")}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* H3 Index Info */}
                            <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-emerald-400">⬡</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">H3 Hexagon Grid</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px]">
                                    Projects are indexed using H3 geospatial system for double-counting prevention
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        {/* Selected Project */}
                        {selectedProject ? (
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl">{SECTOR_ICONS[selectedProject.sector]}</span>
                                        <div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${selectedProject.status === "verified"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                                }`}>
                                                {selectedProject.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="text-gray-500 hover:text-gray-900 dark:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{selectedProject.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedProject.id}</p>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">Carbon Tons</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{selectedProject.carbonTons.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">Location</span>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {selectedProject.lat.toFixed(3)}, {selectedProject.lng.toFixed(3)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">H3 Index</span>
                                        <span className="text-emerald-400 font-mono text-xs">{selectedProject.h3Index}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/project/${selectedProject.id}`}
                                    className="block w-full mt-6 py-3 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium hover:bg-emerald-500/20"
                                >
                                    View Project Details
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 mb-6 text-center">
                                <div className="text-4xl mb-3">📍</div>
                                <p className="text-gray-600 dark:text-gray-400">Click a project marker to view details</p>
                            </div>
                        )}

                        {/* Project List */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                            <div className="p-4 border-b border-gray-700/50">
                                <h3 className="font-semibold text-gray-900 dark:text-white">All Projects ({projects.length})</h3>
                            </div>
                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700/50">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className={`w-full p-4 text-left hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors ${selectedProject?.id === project.id ? "bg-gray-700/30" : ""
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{SECTOR_ICONS[project.sector]}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 dark:text-white truncate">{project.name}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">{project.id}</div>
                                            </div>
                                            <span className={`w-2 h-2 rounded-full ${project.status === "verified" ? "bg-emerald-400" : "bg-yellow-400"
                                                }`} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Total Projects</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-400">
                                    {projects.reduce((sum, p) => sum + p.carbonTons, 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Total Tons</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
