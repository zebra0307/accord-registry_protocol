"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PROPOSAL_TYPES = [
    { id: "AssignRole", label: "Assign Role", description: "Grant a role to a user", icon: "👤" },
    { id: "RevokeRole", label: "Revoke Role", description: "Remove a role from a user", icon: "🚫" },
    { id: "AddAdmin", label: "Add Admin", description: "Add new admin to multi-sig", icon: "➕" },
    { id: "RemoveAdmin", label: "Remove Admin", description: "Remove admin from multi-sig", icon: "➖" },
    { id: "UpdateRegistry", label: "Update Registry", description: "Modify registry settings", icon: "⚙️" },
    { id: "UpdateThreshold", label: "Update Threshold", description: "Change approval threshold", icon: "🎚️" },
    { id: "EmergencyPause", label: "Emergency Pause", description: "Pause system operations", icon: "⏸️" },
    { id: "TransferAuthority", label: "Transfer Authority", description: "Transfer registry ownership", icon: "🔑" },
];

const USER_ROLES = [
    { id: "user", label: "User (Developer)" },
    { id: "validator", label: "Validator" },
    { id: "government", label: "Government" },
    { id: "admin", label: "Admin" },
    { id: "superAdmin", label: "Super Admin" },
];

export default function CreateProposalPage() {
    const { connected } = useWallet();
    const router = useRouter();

    const [proposalType, setProposalType] = useState("");
    const [targetAddress, setTargetAddress] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [newThreshold, setNewThreshold] = useState("");
    const [description, setDescription] = useState("");
    const [expiresIn, setExpiresIn] = useState("7");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedProposal = PROPOSAL_TYPES.find(p => p.id === proposalType);

    const handleSubmit = async () => {
        if (!proposalType || !description) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert("Proposal created successfully!");
            router.push("/dashboard/admin");
        } catch (e) {
            alert("Failed to create proposal");
        }
        setIsSubmitting(false);
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to create proposals.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/admin" className="text-purple-400 hover:underline text-sm">
                        ← Back to Admin Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Create Proposal</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Proposals require multi-sig approval before execution
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8">
                    {/* Proposal Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Proposal Type *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {PROPOSAL_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setProposalType(type.id)}
                                    className={`p-4 rounded-xl border text-left transition-colors ${proposalType === type.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-600"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{type.icon}</span>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">{type.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Fields based on Proposal Type */}
                    {proposalType && (
                        <>
                            {/* Target Address (for role changes, admin changes) */}
                            {["AssignRole", "RevokeRole", "AddAdmin", "RemoveAdmin", "TransferAuthority"].includes(proposalType) && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target Wallet Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={targetAddress}
                                        onChange={(e) => setTargetAddress(e.target.value)}
                                        placeholder="Enter Solana wallet address..."
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            )}

                            {/* Role Selection (for assign/revoke role) */}
                            {["AssignRole", "RevokeRole"].includes(proposalType) && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Role *
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Select a role...</option>
                                        {USER_ROLES.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Threshold (for update threshold) */}
                            {proposalType === "UpdateThreshold" && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Threshold Value *
                                    </label>
                                    <input
                                        type="number"
                                        value={newThreshold}
                                        onChange={(e) => setNewThreshold(e.target.value)}
                                        min={1}
                                        max={10}
                                        placeholder="e.g., 2"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Current threshold: 2 of 3 admins
                                    </p>
                                </div>
                            )}

                            {/* Emergency Warning */}
                            {proposalType === "EmergencyPause" && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">⚠️</span>
                                        <div>
                                            <p className="text-red-400 font-medium">Critical Action</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                Pausing the system will halt all operations including project registration,
                                                credit minting, and trading. Use only in genuine emergencies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Proposal Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Explain the reason for this proposal..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            {/* Expiration */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Proposal Expiration
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {["3", "7", "14", "30"].map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => setExpiresIn(days)}
                                            className={`py-2 rounded-lg text-sm font-medium transition-colors ${expiresIn === days
                                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                                                    : "bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            {days} days
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Proposal Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Type</span>
                                        <span className="text-gray-900 dark:text-white flex items-center space-x-2">
                                            <span>{selectedProposal?.icon}</span>
                                            <span>{selectedProposal?.label}</span>
                                        </span>
                                    </div>
                                    {targetAddress && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Target</span>
                                            <span className="text-gray-900 dark:text-white font-mono text-xs">{targetAddress.slice(0, 12)}...</span>
                                        </div>
                                    )}
                                    {selectedRole && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Role</span>
                                            <span className="text-gray-900 dark:text-white">{USER_ROLES.find(r => r.id === selectedRole)?.label}</span>
                                        </div>
                                    )}
                                    {newThreshold && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">New Threshold</span>
                                            <span className="text-gray-900 dark:text-white">{newThreshold}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Expires In</span>
                                        <span className="text-gray-900 dark:text-white">{expiresIn} days</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Required Approvals</span>
                                        <span className="text-purple-400 font-medium">2 of 3 admins</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting ||
                                    !description ||
                                    (["AssignRole", "RevokeRole", "AddAdmin", "RemoveAdmin", "TransferAuthority"].includes(proposalType) && !targetAddress) ||
                                    (["AssignRole", "RevokeRole"].includes(proposalType) && !selectedRole) ||
                                    (proposalType === "UpdateThreshold" && !newThreshold)
                                }
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                            >
                                {isSubmitting ? "Creating Proposal..." : "Create Proposal"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
