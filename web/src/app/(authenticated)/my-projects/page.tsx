"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

interface Project {
    id: string;
    projectId: string;
    name: string;
    sector: string;
    status: "draft" | "pending" | "verified" | "rejected";
    carbonTons: number;
    creditsIssued: number;
    createdAt: string;
    location: string;
}

// Mock data - will be replaced with real on-chain data
const MOCK_PROJECTS: Project[] = [
    {
        id: "1",
        projectId: "ICM-MH-2024-001",
        name: "Mangrove Restoration Mumbai",
        sector: "blueCarbon",
        status: "verified",
        carbonTons: 1500,
        creditsIssued: 1200,
        createdAt: "2024-01-15",
        location: "Maharashtra, IN",
    },
    {
        id: "2",
        projectId: "ICM-KA-2024-002",
        name: "Seagrass Meadow Karnataka",
        sector: "blueCarbon",
        status: "pending",
        carbonTons: 800,
        creditsIssued: 0,
        createdAt: "2024-06-20",
        location: "Karnataka, IN",
    },
    {
        id: "3",
        projectId: "ICM-GO-2023-005",
        name: "Solar Farm Initiative",
        sector: "renewableEnergy",
        status: "draft",
        carbonTons: 500,
        creditsIssued: 0,
        createdAt: "2024-12-01",
        location: "Goa, IN",
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

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Draft" },
    pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Pending Verification" },
    verified: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Verified" },
    rejected: { bg: "bg-red-500/10", text: "text-red-400", label: "Rejected" },
};

function MyProjectsContent() {
    const { publicKey, connected } = useWallet();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "draft" | "pending" | "verified">("all");

    useEffect(() => {
        // Simulate loading projects
        const loadProjects = async () => {
            // In a real app, fetch from on-chain
            await new Promise(resolve => setTimeout(resolve, 500));
            setProjects(MOCK_PROJECTS);
            setLoading(false);
        };

        if (connected) {
            loadProjects();
        } else {
            setLoading(false);
        }
    }, [connected]);

    const filteredProjects = projects.filter(p =>
        filter === "all" || p.status === filter
    );

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-400">Please connect your wallet to view your projects.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Projects</h1>
                        <p className="text-gray-400 mt-1">Manage and track your carbon credit projects</p>
                    </div>
                    <Link
                        href="/register"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        + New Project
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="text-gray-400 text-sm">Total Projects</div>
                        <div className="text-3xl font-bold text-white mt-1">{projects.length}</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="text-gray-400 text-sm">Verified</div>
                        <div className="text-3xl font-bold text-emerald-400 mt-1">
                            {projects.filter(p => p.status === "verified").length}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="text-gray-400 text-sm">Total Carbon Tons</div>
                        <div className="text-3xl font-bold text-white mt-1">
                            {projects.reduce((sum, p) => sum + p.carbonTons, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="text-gray-400 text-sm">Credits Issued</div>
                        <div className="text-3xl font-bold text-teal-400 mt-1">
                            {projects.reduce((sum, p) => sum + p.creditsIssued, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 mb-6">
                    {["all", "draft", "pending", "verified"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${filter === f
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                }`}
                        >
                            {f === "all" ? "All Projects" : f}
                        </button>
                    ))}
                </div>

                {/* Projects List */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
                        <p className="text-gray-400 mb-6">
                            {filter === "all"
                                ? "Start your carbon credit journey by registering your first project."
                                : `No ${filter} projects found.`}
                        </p>
                        {filter === "all" && (
                            <Link
                                href="/register"
                                className="inline-flex px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90"
                            >
                                Register Your First Project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map((project) => {
                            const statusStyle = STATUS_STYLES[project.status];
                            return (
                                <div
                                    key={project.id}
                                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-14 h-14 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl">
                                                {SECTOR_ICONS[project.sector] || "🌍"}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                                        {statusStyle.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {project.projectId} • {project.location}
                                                </p>
                                                <div className="flex items-center space-x-6 mt-3">
                                                    <div>
                                                        <span className="text-gray-500 text-xs">Carbon Tons</span>
                                                        <div className="text-white font-semibold">{project.carbonTons.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">Credits Issued</span>
                                                        <div className="text-emerald-400 font-semibold">{project.creditsIssued.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">Created</span>
                                                        <div className="text-gray-300">{project.createdAt}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {project.status === "verified" && (
                                                <Link
                                                    href={`/marketplace/create?project=${project.projectId}`}
                                                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20"
                                                >
                                                    List for Sale
                                                </Link>
                                            )}
                                            <Link
                                                href={`/project/${project.projectId}`}
                                                className="px-4 py-2 bg-gray-700/50 rounded-lg text-white text-sm font-medium hover:bg-gray-600/50"
                                            >
                                                Manage
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function MyProjectsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <MyProjectsContent />;
}
