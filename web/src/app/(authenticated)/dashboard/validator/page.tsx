"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/stores/useWalletStore";
import Link from "next/link";

interface PendingProject {
    id: string;
    projectId: string;
    name: string;
    developer: string;
    claimedTons: number;
    escrowAmount: number;
    submittedAt: string;
    sector: string;
    location: string;
    depinData: {
        satellite: boolean;
        iot: boolean;
        drone: boolean;
    };
}

interface CompletedVerification {
    id: string;
    projectId: string;
    name: string;
    verifiedTons: number;
    fee: number;
    completedAt: string;
    status: "approved" | "rejected";
}

// Sector icons configuration
const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    wetlands: "🏞️",
    forestry: "🌲",
    renewableEnergy: "⚡",
};

function ValidatorDashboardContent() {
    const { publicKey, connected } = useWallet();
    const { role } = useWalletStore();

    const [activeTab, setActiveTab] = useState<"pending" | "completed" | "tools">("pending");
    const [selectedProject, setSelectedProject] = useState<PendingProject | null>(null);
    const [verificationNotes, setVerificationNotes] = useState("");
    const [calculatedTons, setCalculatedTons] = useState<number | null>(null);
    const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
    const [completedVerifications, setCompletedVerifications] = useState<CompletedVerification[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch validator data from on-chain
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: Implement actual on-chain data fetching
                setPendingProjects([]);
                setCompletedVerifications([]);
            } catch (error) {
                console.error("Failed to fetch validator data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (connected) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [connected]);

    const stats = {
        verifiedProjects: completedVerifications.filter(v => v.status === "approved").length,
        pendingQueue: pendingProjects.length,
        totalEarnings: completedVerifications.reduce((sum, v) => sum + v.fee, 0),
        stakedAmount: 0,
    };

    const isAuthorized = role === "validator" || role === "superAdmin";

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-400">Please connect your wallet to access the validator dashboard.</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Validator Access Required</h2>
                    <p className="text-gray-400 mb-6">You need Validator role to access this dashboard.</p>
                    <Link
                        href="/settings"
                        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium"
                    >
                        Request Validator Role
                    </Link>
                </div>
            </div>
        );
    }

    const handleApprove = (project: PendingProject) => {
        alert(`Approved project ${project.projectId} with ${calculatedTons || project.claimedTons} tons!`);
        setSelectedProject(null);
        setVerificationNotes("");
        setCalculatedTons(null);
    };

    const handleReject = (project: PendingProject) => {
        if (!verificationNotes.trim()) {
            alert("Please provide rejection reason");
            return;
        }
        alert(`Rejected project ${project.projectId}. Reason: ${verificationNotes}`);
        setSelectedProject(null);
        setVerificationNotes("");
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Validator Dashboard</h1>
                        <p className="text-gray-400 mt-1">Verify carbon credit projects and earn fees</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/settings"
                            className="px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-600/50"
                        >
                            ⚙️ Settings
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">✅</span>
                            <span className="text-gray-400 text-sm">Verified Projects</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.verifiedProjects}</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">⏳</span>
                            <span className="text-gray-400 text-sm">Pending Queue</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.pendingQueue}</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">💰</span>
                            <span className="text-gray-400 text-sm">Total Earnings</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400">{stats.totalEarnings} SOL</div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">🔒</span>
                            <span className="text-gray-400 text-sm">Staked Amount</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-400">{stats.stakedAmount} SOL</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    {[
                        { id: "pending", label: "Pending Verifications", count: pendingProjects.length },
                        { id: "completed", label: "Completed", count: completedVerifications.length },
                        { id: "tools", label: "Validator Tools" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === tab.id
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-2 px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Pending Verifications Tab */}
                {activeTab === "pending" && (
                    <div className="space-y-4">
                        {pendingProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-14 h-14 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl">
                                            {SECTOR_ICONS[project.sector] || "🌍"}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                                                    Awaiting Review
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1">
                                                {project.projectId} • {project.location} • Developer: {project.developer}
                                            </p>

                                            {/* Project Stats */}
                                            <div className="flex items-center space-x-6 mt-3">
                                                <div>
                                                    <span className="text-gray-500 text-xs">Claimed Carbon</span>
                                                    <div className="text-white font-semibold">{project.claimedTons.toLocaleString()} tons</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 text-xs">Escrow</span>
                                                    <div className="text-emerald-400 font-semibold">{project.escrowAmount} SOL</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 text-xs">Submitted</span>
                                                    <div className="text-gray-300">{project.submittedAt}</div>
                                                </div>
                                            </div>

                                            {/* DePIN Data Status */}
                                            <div className="flex items-center space-x-4 mt-3">
                                                <span className={`text-sm ${project.depinData.satellite ? "text-emerald-400" : "text-gray-500"}`}>
                                                    {project.depinData.satellite ? "✅" : "❌"} Satellite
                                                </span>
                                                <span className={`text-sm ${project.depinData.iot ? "text-emerald-400" : "text-gray-500"}`}>
                                                    {project.depinData.iot ? "✅" : "❌"} IoT Sensors
                                                </span>
                                                <span className={`text-sm ${project.depinData.drone ? "text-emerald-400" : "text-gray-500"}`}>
                                                    {project.depinData.drone ? "✅" : "❌"} Drone Survey
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium hover:bg-blue-500/20"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Completed Tab */}
                {activeTab === "completed" && (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Project</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Verified Tons</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Fee Earned</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Date</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {completedVerifications.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-700/20">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{item.name}</div>
                                            <div className="text-gray-400 text-sm">{item.projectId}</div>
                                        </td>
                                        <td className="p-4 text-white">{item.verifiedTons.toLocaleString()}</td>
                                        <td className="p-4 text-emerald-400">{item.fee} SOL</td>
                                        <td className="p-4 text-gray-400">{item.completedAt}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "approved"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-red-500/10 text-red-400"
                                                }`}>
                                                {item.status === "approved" ? "Approved" : "Rejected"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tools Tab */}
                {activeTab === "tools" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Verification Workflow */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">📋 Verification Workflow</h3>
                            <div className="space-y-3">
                                {[
                                    { step: 1, title: "Review Documents", desc: "Check project documentation" },
                                    { step: 2, title: "Verify DePIN Data", desc: "Cross-reference IoT & satellite" },
                                    { step: 3, title: "Calculate Carbon", desc: "Use methodology calculator" },
                                    { step: 4, title: "Submit Report", desc: "File verification report" },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 font-bold">
                                            {item.step}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{item.title}</div>
                                            <div className="text-gray-400 text-sm">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Tools */}
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">🛠️ Quick Tools</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/map" className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                                        <div className="text-2xl mb-2">🗺️</div>
                                        <div className="text-white font-medium">Map View</div>
                                        <div className="text-gray-400 text-sm">Satellite data</div>
                                    </Link>
                                    <Link href="/analytics" className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                                        <div className="text-2xl mb-2">📊</div>
                                        <div className="text-white font-medium">Analytics</div>
                                        <div className="text-gray-400 text-sm">Project metrics</div>
                                    </Link>
                                    <button className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                                        <div className="text-2xl mb-2">📡</div>
                                        <div className="text-white font-medium">DePIN Console</div>
                                        <div className="text-gray-400 text-sm">IoT dashboard</div>
                                    </button>
                                    <button className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left">
                                        <div className="text-2xl mb-2">🧮</div>
                                        <div className="text-white font-medium">Calculator</div>
                                        <div className="text-gray-400 text-sm">Carbon estimation</div>
                                    </button>
                                </div>
                            </div>

                            {/* Stake Management */}
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">🔒 Stake Management</h3>
                                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg mb-4">
                                    <div>
                                        <div className="text-gray-400 text-sm">Current Stake</div>
                                        <div className="text-2xl font-bold text-purple-400">{stats.stakedAmount} SOL</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm">
                                            Add Stake
                                        </button>
                                        <button className="px-4 py-2 bg-gray-700/50 rounded-lg text-gray-300 text-sm">
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Validators must maintain a minimum stake of 5 SOL. Higher stakes unlock more verification slots.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {selectedProject && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white">Review Project</h2>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Project Info */}
                                <div className="p-4 bg-gray-900/50 rounded-xl">
                                    <h3 className="font-semibold text-white mb-2">{selectedProject.name}</h3>
                                    <p className="text-gray-400 text-sm">{selectedProject.projectId}</p>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <span className="text-gray-500 text-xs">Claimed</span>
                                            <div className="text-white font-semibold">{selectedProject.claimedTons} tons</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs">Escrow</span>
                                            <div className="text-emerald-400 font-semibold">{selectedProject.escrowAmount} SOL</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Carbon Calculator */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Verified Carbon Tons (your calculation)
                                    </label>
                                    <input
                                        type="number"
                                        value={calculatedTons || ""}
                                        onChange={(e) => setCalculatedTons(Number(e.target.value))}
                                        placeholder={String(selectedProject.claimedTons)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Verification Notes
                                    </label>
                                    <textarea
                                        value={verificationNotes}
                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
                                        placeholder="Add notes about your verification..."
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleApprove(selectedProject)}
                                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold"
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedProject)}
                                        className="flex-1 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-semibold"
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function ValidatorDashboard() {
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

    return <ValidatorDashboardContent />;
}
