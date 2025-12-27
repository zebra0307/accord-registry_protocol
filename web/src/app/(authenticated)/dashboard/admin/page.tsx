"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/providers/ProgramProvider";
import { useWalletStore, isSuperAdminWallet } from "@/stores/useWalletStore";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";

// Type definitions
interface Proposal {
    id: number;
    type: string;
    target: string;
    proposer: string;
    createdAt: string;
    expiresAt: string;
    approvals: string[];
    requiredApprovals: number;
    executed: boolean;
    cancelled: boolean;
    data: string;
}

interface Admin {
    pubkey: string;
    role: string;
    addedAt: string;
}

interface AuditLog {
    action: string;
    performedBy: string;
    target: string;
    time: string;
    success: boolean;
}

interface KYCReview {
    id: string;
    wallet: string;
    currentLevel: number;
    requestedLevel: number;
    submittedAt: string;
    email: string;
    phone: string;
    documents: { type: string; fileName: string; status: string }[];
}


const PROPOSAL_TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    AssignRole: { label: "Assign Role", icon: "👤", color: "text-blue-400" },
    RevokeRole: { label: "Revoke Role", icon: "🚫", color: "text-red-400" },
    AddAdmin: { label: "Add Admin", icon: "➕", color: "text-emerald-400" },
    RemoveAdmin: { label: "Remove Admin", icon: "➖", color: "text-orange-400" },
    UpdateRegistry: { label: "Update Registry", icon: "⚙️", color: "text-purple-400" },
    EmergencyPause: { label: "Emergency Pause", icon: "⏸️", color: "text-red-400" },
    TransferAuthority: { label: "Transfer Authority", icon: "🔑", color: "text-yellow-400" },
    UpdateThreshold: { label: "Update Threshold", icon: "🎚️", color: "text-teal-400" },
};

function SuperAdminDashboardContent() {
    const { publicKey, connected } = useWallet();
    const { role } = useWalletStore();
    const { program } = useProgram();

    const [activeTab, setActiveTab] = useState<"proposals" | "admins" | "audit" | "kyc">("proposals");
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [kycReviews, setKycReviews] = useState<KYCReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [multisigConfig, setMultisigConfig] = useState({
        threshold: 2,
        adminCount: 0,
        isEnabled: true,
        emergencyAdmin: "",
        proposalCount: 0,
    });

    // Fetch admin data from on-chain
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: Implement actual on-chain data fetching
                // const onChainProposals = await program.account.proposal.all();
                setProposals([]);
                setAdmins([]);
                setAuditLogs([]);
                setKycReviews([]);
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (connected && publicKey) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [connected, publicKey, program]);

    // Check if user is authorized - MUST check wallet address directly
    const walletAddress = publicKey?.toBase58() || "";
    const isWalletSuperAdmin = isSuperAdminWallet(walletAddress);
    const isAuthorized = connected && isWalletSuperAdmin;

    // Show access denied if not authorized
    if (!connected || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You need SuperAdmin privileges to access this dashboard.
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        Connected: {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Not connected"}
                    </p>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium hover:bg-gray-600"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                            👑
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SuperAdmin Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400">Multi-signature governance & system administration</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/dashboard/admin/users"
                            className="px-6 py-3 bg-gray-700 border border-gray-600 rounded-xl text-gray-900 dark:text-white font-semibold hover:bg-gray-600 transition-colors"
                        >
                            👥 Manage Users
                        </Link>
                        <Link
                            href="/dashboard/admin/proposal"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                            + Create Proposal
                        </Link>
                    </div>
                </div>

                {/* Multi-sig Status */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-Signature Status</h2>
                            <div className="flex items-center space-x-6 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Threshold:</span>
                                    <span className="text-gray-900 dark:text-white ml-2 font-medium">{multisigConfig.threshold} of {multisigConfig.adminCount}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className={`ml-2 font-medium ${multisigConfig.isEnabled ? "text-emerald-400" : "text-red-400"}`}>
                                        {multisigConfig.isEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Total Proposals:</span>
                                    <span className="text-gray-900 dark:text-white ml-2 font-medium">{multisigConfig.proposalCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {multisigConfig.isEnabled ? (
                                <span className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 rounded-lg">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-emerald-400 text-sm font-medium">Active</span>
                                </span>
                            ) : (
                                <span className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 rounded-lg">
                                    <span className="w-2 h-2 bg-red-400 rounded-full" />
                                    <span className="text-red-400 text-sm font-medium">Paused</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Pending Proposals", value: proposals.filter(p => !p.executed && !p.cancelled).length.toString(), icon: "📋", color: "text-yellow-400" },
                        { label: "Active Admins", value: admins.length.toString(), icon: "👥", color: "text-blue-400" },
                        { label: "System Status", value: "Online", icon: "🟢", color: "text-emerald-400" },
                        { label: "Audit Logs", value: "128", icon: "📜", color: "text-purple-400" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6"
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</span>
                            </div>
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-2 mb-6">
                    {[
                        { id: "proposals", label: "Proposals", icon: "📋" },
                        { id: "kyc", label: "KYC Reviews", icon: "🪪" },
                        { id: "admins", label: "Admins", icon: "👥" },
                        { id: "audit", label: "Audit Logs", icon: "📜" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.id
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === "proposals" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Proposals</h2>
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium">
                                {proposals.filter(p => !p.executed && !p.cancelled).length} pending
                            </span>
                        </div>

                        {proposals.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-4">📋</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Proposals</h3>
                                <p className="text-gray-600 dark:text-gray-400">Create a new proposal to get started.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {proposals.map((proposal) => {
                                    const typeInfo = PROPOSAL_TYPE_LABELS[proposal.type];
                                    const approvalProgress = (proposal.approvals.length / proposal.requiredApprovals) * 100;

                                    return (
                                        <div key={proposal.id} className="p-6 hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl">
                                                        {typeInfo.icon}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proposal #{proposal.id}</h3>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color} bg-gray-100 dark:bg-gray-700/50`}>
                                                                {typeInfo.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{proposal.data}</p>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Proposed by {proposal.proposer}</span>
                                                            <span>•</span>
                                                            <span>Expires: {new Date(proposal.expiresAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    {/* Approval Progress */}
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            {proposal.approvals.length} / {proposal.requiredApprovals} approvals
                                                        </div>
                                                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                                                                style={{ width: `${approvalProgress}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center space-x-2">
                                                        <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20">
                                                            Approve
                                                        </button>
                                                        <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/20">
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Approvers */}
                                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Approved by:</div>
                                                <div className="flex items-center space-x-2">
                                                    {proposal.approvals.map((approver, i) => (
                                                        <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                                                            {approver}
                                                        </span>
                                                    ))}
                                                    {proposal.approvals.length === 0 && (
                                                        <span className="text-gray-500 text-xs">No approvals yet</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "admins" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Multi-Sig Admins</h2>
                            <button className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/20">
                                + Add Admin (via Proposal)
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Admin</th>
                                        <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Role</th>
                                        <th className="text-left p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Added</th>
                                        <th className="text-center p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Status</th>
                                        <th className="text-right p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {admins.map((admin) => (
                                        <tr key={admin.pubkey} className="hover:bg-gray-200 dark:hover:bg-gray-700/20">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold">
                                                        {admin.pubkey.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white font-mono">{admin.pubkey}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${admin.role === "SuperAdmin"
                                                    ? "bg-yellow-500/10 text-yellow-400"
                                                    : "bg-purple-500/10 text-purple-400"
                                                    }`}>
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-400">{admin.addedAt}</td>
                                            <td className="p-4 text-center">
                                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {admin.role !== "SuperAdmin" && (
                                                    <button className="text-sm text-red-400 hover:underline">
                                                        Remove (via Proposal)
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audit Logs</h2>
                            <button className="px-4 py-2 bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-600">
                                Export Logs
                            </button>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                            {auditLogs.map((log, i) => (
                                <div key={i} className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${log.success ? "bg-emerald-500/10" : "bg-red-500/10"
                                                }`}>
                                                {log.success ? "✓" : "✗"}
                                            </div>
                                            <div>
                                                <div className="text-gray-900 dark:text-white font-medium">{log.action.replace(/([A-Z])/g, " $1").trim()}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="text-purple-400">{log.performedBy}</span>
                                                    <span className="mx-2">→</span>
                                                    <span>{log.target}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KYC Reviews Tab */}
                {activeTab === "kyc" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending KYC Reviews</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Review and approve Level 2 KYC verification requests</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-medium">
                                {kycReviews.length} pending
                            </span>
                        </div>

                        {kycReviews.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Reviews</h3>
                                <p className="text-gray-600 dark:text-gray-400">All KYC requests have been processed</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {kycReviews.map((review) => (
                                    <div key={review.id} className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-2xl">
                                                    🪪
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-mono text-gray-900 dark:text-white">{review.wallet}</span>
                                                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                                                            Level {review.currentLevel} → {review.requestedLevel}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Submitted: {new Date(review.submittedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => alert(`KYC approved for ${review.wallet}! User will be upgraded to Level 2.`)}
                                                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt("Enter rejection reason:");
                                                        if (reason) {
                                                            alert(`KYC rejected for ${review.wallet}. Reason: ${reason}`);
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/20"
                                                >
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                            <div>
                                                <span className="text-gray-500 text-xs">Email</span>
                                                <div className="text-gray-900 dark:text-white">{review.email}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Phone</span>
                                                <div className="text-gray-900 dark:text-white">{review.phone}</div>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Submitted Documents</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {review.documents.map((doc, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => alert(`Viewing document: ${doc.fileName}`)}
                                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-600/50 flex items-center space-x-2"
                                                    >
                                                        <span>📄</span>
                                                        <span>{doc.type}</span>
                                                        <span className="text-gray-500">({doc.fileName})</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Emergency Actions */}
                <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-2xl">
                                ⚠️
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Emergency Actions</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Only available to the designated Emergency Admin. Use with extreme caution.
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-semibold hover:bg-red-500/20">
                            🛑 Emergency Pause System
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function SuperAdminDashboard() {
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

    return <SuperAdminDashboardContent />;
}
