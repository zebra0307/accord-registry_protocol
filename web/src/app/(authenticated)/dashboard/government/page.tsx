"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/stores/useWalletStore";
import Link from "next/link";

interface PendingLoA {
    id: string;
    projectId: string;
    name: string;
    developer: string;
    validator: string;
    verifiedTons: number;
    submittedAt: string;
    location: string;
    sector: string;
    article6Status: {
        additionality: boolean;
        noDoubleCount: boolean;
        ndcAligned: boolean;
    };
}

interface IssuedLoA {
    id: string;
    projectId: string;
    name: string;
    carbonAmount: number;
    issuedAt: string;
    expiresAt: string;
    status: "active" | "expired" | "revoked";
}

const pendingLoAs: PendingLoA[] = [
    {
        id: "1",
        projectId: "ICM-MH-2024-001",
        name: "Mangrove Restoration Mumbai",
        developer: "5abc...xyz",
        validator: "7def...uvw",
        verifiedTons: 1500,
        submittedAt: "2024-12-24",
        location: "Maharashtra, IN",
        sector: "blueCarbon",
        article6Status: { additionality: true, noDoubleCount: true, ndcAligned: true },
    },
    {
        id: "2",
        projectId: "ICM-KA-2024-002",
        name: "Seagrass Meadow Karnataka",
        developer: "9ghi...rst",
        validator: "7def...uvw",
        verifiedTons: 800,
        submittedAt: "2024-12-25",
        location: "Karnataka, IN",
        sector: "blueCarbon",
        article6Status: { additionality: true, noDoubleCount: true, ndcAligned: false },
    },
];

const issuedLoAs: IssuedLoA[] = [
    {
        id: "1",
        projectId: "ICM-KL-2023-001",
        name: "Backwater Protection Kerala",
        carbonAmount: 950,
        issuedAt: "2024-06-15",
        expiresAt: "2025-06-15",
        status: "active",
    },
    {
        id: "2",
        projectId: "ICM-TN-2023-005",
        name: "Coral Restoration Tamil Nadu",
        carbonAmount: 1200,
        issuedAt: "2024-03-10",
        expiresAt: "2025-03-10",
        status: "active",
    },
    {
        id: "3",
        projectId: "ICM-MH-2022-001",
        name: "Old Mangrove Project",
        carbonAmount: 500,
        issuedAt: "2023-01-01",
        expiresAt: "2024-01-01",
        status: "expired",
    },
];

function GovernmentDashboardContent() {
    const { publicKey, connected } = useWallet();
    const { role } = useWalletStore();

    const [activeTab, setActiveTab] = useState<"pending" | "issued" | "compliance" | "policy">("pending");
    const [selectedLoA, setSelectedLoA] = useState<PendingLoA | null>(null);
    const [loaNotes, setLoaNotes] = useState("");

    const stats = {
        loasIssued: 45,
        pendingRequests: pendingLoAs.length,
        creditsExported: 50000,
        exportLimit: 100000,
        ndcProgress: 45,
    };

    const isAuthorized = role === "government" || role === "superAdmin";

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to access the government dashboard.</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏛️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Government Access Required</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You need Government role to access this dashboard.</p>
                    <Link
                        href="/settings"
                        className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 font-medium"
                    >
                        Request Government Role
                    </Link>
                </div>
            </div>
        );
    }

    const handleIssueLoA = (loa: PendingLoA) => {
        alert(`LoA issued for project ${loa.projectId}!`);
        setSelectedLoA(null);
        setLoaNotes("");
    };

    const handleRejectLoA = (loa: PendingLoA) => {
        if (!loaNotes.trim()) {
            alert("Please provide rejection reason");
            return;
        }
        alert(`LoA rejected for ${loa.projectId}. Reason: ${loaNotes}`);
        setSelectedLoA(null);
        setLoaNotes("");
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Government Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage Letters of Authorization and compliance</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">📜</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">LoAs Issued</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.loasIssued}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">⏳</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Pending</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.pendingRequests}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">📤</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Credits Exported</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">{(stats.creditsExported / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">📊</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Export Quota</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400">{Math.round((stats.creditsExported / stats.exportLimit) * 100)}%</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">🎯</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">NDC Progress</span>
                        </div>
                        <div className="text-2xl font-bold text-teal-400">{stats.ndcProgress}%</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto">
                    {[
                        { id: "pending", label: "Pending LoA", count: pendingLoAs.length },
                        { id: "issued", label: "Issued LoAs", count: issuedLoAs.length },
                        { id: "compliance", label: "Article 6 Compliance" },
                        { id: "policy", label: "Policy Settings" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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

                {/* Pending LoA Tab */}
                {activeTab === "pending" && (
                    <div className="space-y-4">
                        {pendingLoAs.map((loa) => (
                            <div
                                key={loa.id}
                                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{loa.name}</h3>
                                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                                                Awaiting LoA
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                            {loa.projectId} • {loa.location}
                                        </p>

                                        <div className="flex items-center space-x-6 mt-3">
                                            <div>
                                                <span className="text-gray-500 text-xs">Verified Carbon</span>
                                                <div className="text-gray-900 dark:text-white font-semibold">{loa.verifiedTons.toLocaleString()} tons</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Validator</span>
                                                <div className="text-gray-300 font-mono text-sm">{loa.validator}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Submitted</span>
                                                <div className="text-gray-300">{loa.submittedAt}</div>
                                            </div>
                                        </div>

                                        {/* Article 6 Compliance Status */}
                                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-300 mb-2">Article 6 Compliance Check</div>
                                            <div className="flex items-center space-x-4">
                                                <span className={`text-sm ${loa.article6Status.additionality ? "text-emerald-400" : "text-red-400"}`}>
                                                    {loa.article6Status.additionality ? "✅" : "❌"} Additionality
                                                </span>
                                                <span className={`text-sm ${loa.article6Status.noDoubleCount ? "text-emerald-400" : "text-red-400"}`}>
                                                    {loa.article6Status.noDoubleCount ? "✅" : "❌"} No Double Counting
                                                </span>
                                                <span className={`text-sm ${loa.article6Status.ndcAligned ? "text-emerald-400" : "text-yellow-400"}`}>
                                                    {loa.article6Status.ndcAligned ? "✅" : "⚠️"} NDC Aligned
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedLoA(loa)}
                                            className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/20"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Issued LoAs Tab */}
                {activeTab === "issued" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Project</th>
                                    <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Carbon Amount</th>
                                    <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Issued</th>
                                    <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Expires</th>
                                    <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Status</th>
                                    <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {issuedLoAs.map((loa) => (
                                    <tr key={loa.id} className="hover:bg-gray-200 dark:hover:bg-gray-700/20">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{loa.name}</div>
                                            <div className="text-gray-600 dark:text-gray-400 text-sm">{loa.projectId}</div>
                                        </td>
                                        <td className="p-4 text-gray-900 dark:text-white">{loa.carbonAmount.toLocaleString()} tons</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{loa.issuedAt}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{loa.expiresAt}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loa.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : loa.status === "expired"
                                                        ? "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                                        : "bg-red-500/10 text-red-400"
                                                }`}>
                                                {loa.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Compliance Tab */}
                {activeTab === "compliance" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* National Carbon Budget */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 National Carbon Budget</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Annual Budget Used</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{stats.ndcProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                                            style={{ width: `${stats.ndcProgress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Allocated</div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">100,000 tons</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Remaining</div>
                                        <div className="text-xl font-bold text-emerald-400">55,000 tons</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Controls */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📤 Export Controls</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Export Quota Usage</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">
                                            {Math.round((stats.creditsExported / stats.exportLimit) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                                            style={{ width: `${(stats.creditsExported / stats.exportLimit) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Exported</div>
                                        <div className="text-xl font-bold text-purple-400">{(stats.creditsExported / 1000).toFixed(0)}K tons</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Limit</div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-white">{(stats.exportLimit / 1000).toFixed(0)}K tons</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corresponding Adjustments */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚖️ Corresponding Adjustments (Article 6.2)</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                                    <div className="text-3xl mb-2">📝</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">98</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">Projects Adjusted</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                                    <div className="text-3xl mb-2">🔄</div>
                                    <div className="text-2xl font-bold text-emerald-400">45K</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">ITMOs Transferred</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                                    <div className="text-3xl mb-2">📥</div>
                                    <div className="text-2xl font-bold text-blue-400">12K</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">ITMOs Received</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
                                    <div className="text-3xl mb-2">✅</div>
                                    <div className="text-2xl font-bold text-teal-400">100%</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm">UNFCCC Reported</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Policy Tab */}
                {activeTab === "policy" && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Policy Configuration</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-gray-900 dark:text-white font-medium">Annual Export Limit</div>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Maximum carbon credits that can be exported</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="number"
                                            defaultValue={100000}
                                            className="w-32 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-right"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400">tons</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-gray-900 dark:text-white font-medium">Minimum Verification Level</div>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Required verification tier for LoA issuance</div>
                                    </div>
                                    <select className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
                                        <option>Gold Standard</option>
                                        <option>Verra VCS</option>
                                        <option>CDM</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-gray-900 dark:text-white font-medium">Auto-Approve Threshold</div>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Projects below this size auto-approve</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="number"
                                            defaultValue={500}
                                            className="w-32 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-right"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400">tons</span>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold">
                                Save Policy Settings
                            </button>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {selectedLoA && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Issue Letter of Authorization</h2>
                                    <button onClick={() => setSelectedLoA(null)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">✕</button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedLoA.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedLoA.projectId}</p>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <span className="text-gray-500 text-xs">Verified Carbon</span>
                                            <div className="text-gray-900 dark:text-white font-semibold">{selectedLoA.verifiedTons} tons</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs">Validator</span>
                                            <div className="text-gray-300 font-mono text-sm">{selectedLoA.validator}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">LoA Notes</label>
                                    <textarea
                                        value={loaNotes}
                                        onChange={(e) => setLoaNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                        placeholder="Add notes for this LoA..."
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleIssueLoA(selectedLoA)}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold"
                                    >
                                        📜 Issue LoA
                                    </button>
                                    <button
                                        onClick={() => handleRejectLoA(selectedLoA)}
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

export default function GovernmentDashboard() {
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

    return <GovernmentDashboardContent />;
}
