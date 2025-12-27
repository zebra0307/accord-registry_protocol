"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/stores/useWalletStore";
import Link from "next/link";

type RoleRequestType = "validator" | "government" | "admin";

interface RoleRequest {
    id: string;
    requestedRole: RoleRequestType;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
    documents: string[];
    justification: string;
}

const ROLE_INFO = {
    validator: {
        title: "Validator",
        description: "Verify carbon credit projects and earn fees",
        icon: "✅",
        color: "blue",
        requirements: [
            "Valid accreditation certificate",
            "Government-issued ID",
            "Proof of environmental expertise",
            "Clean background check",
        ],
    },
    government: {
        title: "Government Official",
        description: "Issue Letters of Authorization (LoA) for carbon credits",
        icon: "🏛️",
        color: "purple",
        requirements: [
            "Government agency verification",
            "Official appointment letter",
            "Government-issued ID",
            "Agency authorization document",
        ],
    },
    admin: {
        title: "Administrator",
        description: "Participate in platform governance",
        icon: "⚙️",
        color: "orange",
        requirements: [
            "Existing platform reputation",
            "Technical background verification",
            "Multi-sig participation agreement",
            "Security clearance",
        ],
    },
};

function SettingsContent() {
    const { publicKey, connected } = useWallet();
    const { role, isRegistered } = useWalletStore();

    const [activeTab, setActiveTab] = useState<"profile" | "request" | "history">("profile");
    const [selectedRole, setSelectedRole] = useState<RoleRequestType | null>(null);
    const [justification, setJustification] = useState("");
    const [documents, setDocuments] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [requests, setRequests] = useState<RoleRequest[]>([
        // Mock historical requests
        {
            id: "1",
            requestedRole: "validator",
            status: "rejected",
            submittedAt: "2024-12-20",
            documents: ["certificate.pdf", "id.pdf"],
            justification: "Previous application - incomplete documentation",
        },
    ]);

    const walletAddress = publicKey?.toBase58() || "";

    const handleSubmitRequest = async () => {
        if (!selectedRole || !justification.trim()) {
            alert("Please select a role and provide justification");
            return;
        }

        setSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newRequest: RoleRequest = {
            id: Date.now().toString(),
            requestedRole: selectedRole,
            status: "pending",
            submittedAt: new Date().toISOString().split("T")[0],
            documents: documents.map(d => d.name),
            justification,
        };

        setRequests([newRequest, ...requests]);
        setSelectedRole(null);
        setJustification("");
        setDocuments([]);
        setActiveTab("history");
        setSubmitting(false);

        alert("Role request submitted successfully! An admin will review your application.");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments([...documents, ...Array.from(e.target.files)]);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to access settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and request role upgrades</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8">
                    {[
                        { id: "profile", label: "Profile", icon: "👤" },
                        { id: "request", label: "Request Role", icon: "📋" },
                        { id: "history", label: "Request History", icon: "📜" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${activeTab === tab.id
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        {/* Account Info */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Wallet Address</div>
                                        <div className="font-mono text-gray-900 dark:text-white">{walletAddress}</div>
                                    </div>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(walletAddress)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-300 hover:bg-gray-600/50"
                                    >
                                        Copy
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Current Role</div>
                                        <div className="text-gray-900 dark:text-white capitalize font-semibold">
                                            {role === "none" ? "Unregistered" : role}
                                        </div>
                                    </div>
                                    {role === "none" && (
                                        <Link
                                            href="/dashboard"
                                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400"
                                        >
                                            Register Now
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Registration Status</div>
                                        <div className={`font-semibold ${isRegistered ? "text-emerald-400" : "text-yellow-400"}`}>
                                            {isRegistered ? "✅ Registered" : "⏳ Not Registered"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KYC Status */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">KYC Verification</h2>

                            {/* KYC Level Indicator */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="text-3xl">⚪</div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white">Level 0: Unverified</div>
                                        <div className="text-gray-600 dark:text-gray-400 text-sm">Complete verification to unlock platform features</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }} />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Level 0</span>
                                    <span>Level 1</span>
                                    <span>Level 2</span>
                                </div>
                            </div>

                            {/* Feature Restrictions */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="text-red-400 text-sm">❌ Cannot register projects</div>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="text-red-400 text-sm">❌ Cannot trade on DEX</div>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="text-red-400 text-sm">❌ Cannot request role upgrade</div>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="text-red-400 text-sm">❌ No marketplace access</div>
                                </div>
                            </div>

                            <Link
                                href="/settings/kyc"
                                className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold text-center hover:opacity-90 transition-opacity"
                            >
                                Start KYC Verification →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Request Role Tab */}
                {activeTab === "request" && (
                    <div className="space-y-6">
                        {/* Role Selection */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Request Role Upgrade</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Select the role you want to apply for and provide supporting documentation.</p>

                            <div className="grid gap-4">
                                {(Object.keys(ROLE_INFO) as RoleRequestType[]).map((roleKey) => {
                                    const info = ROLE_INFO[roleKey];
                                    const isSelected = selectedRole === roleKey;
                                    const colorMap = {
                                        blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
                                        purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
                                        orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
                                    };
                                    const colorClasses = colorMap[info.color as keyof typeof colorMap] || colorMap.blue;

                                    return (
                                        <button
                                            key={roleKey}
                                            onClick={() => setSelectedRole(roleKey)}
                                            className={`p-6 rounded-xl text-left transition-all ${isSelected
                                                ? `${colorClasses.bg} ${colorClasses.border} border-2`
                                                : "bg-gray-50 dark:bg-gray-900/50 border border-gray-700/50 hover:border-gray-600"
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <span className="text-3xl">{info.icon}</span>
                                                <div className="flex-1">
                                                    <div className={`font-semibold text-lg ${isSelected ? colorClasses.text : "text-gray-900 dark:text-white"}`}>
                                                        {info.title}
                                                    </div>
                                                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{info.description}</div>

                                                    {isSelected && (
                                                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                                                            <div className="text-sm font-medium text-gray-300 mb-2">Requirements:</div>
                                                            <ul className="space-y-1">
                                                                {info.requirements.map((req, i) => (
                                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                                        <span className="text-emerald-400 mr-2">•</span>
                                                                        {req}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                    ? `${colorClasses.border} ${colorClasses.bg}`
                                                    : "border-gray-600"
                                                    }`}>
                                                    {isSelected && <span className={colorClasses.text}>✓</span>}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Application Form */}
                        {selectedRole && (
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Application Details</h2>

                                {/* Justification */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Why do you want this role? *
                                    </label>
                                    <textarea
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        placeholder="Explain your qualifications and why you should be granted this role..."
                                    />
                                </div>

                                {/* Document Upload */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Supporting Documents
                                    </label>
                                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-gray-600 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            multiple
                                            className="hidden"
                                            id="file-upload"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="text-4xl mb-2">📎</div>
                                            <div className="text-gray-600 dark:text-gray-400">Click to upload files</div>
                                            <div className="text-gray-500 text-sm mt-1">PDF, JPG, PNG (max 10MB each)</div>
                                        </label>
                                    </div>

                                    {documents.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">📄</span>
                                                        <span className="text-gray-300">{doc.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeDocument(index)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmitRequest}
                                    disabled={submitting || !justification.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                >
                                    {submitting ? "Submitting..." : "Submit Role Request"}
                                </button>

                                <p className="text-gray-500 text-sm text-center mt-4">
                                    Your request will be reviewed by platform administrators. This usually takes 2-5 business days.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Request History Tab */}
                {activeTab === "history" && (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request History</h2>
                        </div>

                        {requests.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Requests Yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't submitted any role requests.</p>
                                <button
                                    onClick={() => setActiveTab("request")}
                                    className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium"
                                >
                                    Request a Role
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {requests.map((request) => {
                                    const roleInfo = ROLE_INFO[request.requestedRole];
                                    const statusStyles = {
                                        pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Pending Review" },
                                        approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Approved" },
                                        rejected: { bg: "bg-red-500/10", text: "text-red-400", label: "Rejected" },
                                    }[request.status];

                                    return (
                                        <div key={request.id} className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4">
                                                    <span className="text-3xl">{roleInfo.icon}</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{roleInfo.title} Role Request</div>
                                                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Submitted: {request.submittedAt}</div>
                                                        <div className="text-gray-500 text-sm mt-2">{request.justification}</div>
                                                        {request.documents.length > 0 && (
                                                            <div className="flex items-center space-x-2 mt-2">
                                                                <span className="text-gray-500 text-sm">Documents:</span>
                                                                {request.documents.map((doc, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
                                                                        {doc}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                                                    {statusStyles.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function SettingsPage() {
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

    return <SettingsContent />;
}
