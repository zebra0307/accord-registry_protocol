"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function RetireCreditsPage() {
    const { connected } = useWallet();
    const [selectedProject, setSelectedProject] = useState("");
    const [retireAmount, setRetireAmount] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock holdings
    const holdings = [
        { projectId: "ICM-MH-2024-001", name: "Mangrove Restoration", balance: 800, vintage: 2024 },
        { projectId: "ICM-KA-2024-002", name: "Seagrass Meadow", balance: 500, vintage: 2024 },
        { projectId: "ICM-GO-2023-005", name: "Solar Farm Initiative", balance: 200, vintage: 2023 },
    ];

    const selectedHolding = holdings.find(h => h.projectId === selectedProject);
    const maxAmount = selectedHolding?.balance || 0;

    const handleRetire = async () => {
        if (!selectedProject || !retireAmount || parseFloat(retireAmount) <= 0) return;

        setIsSubmitting(true);
        try {
            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Successfully retired ${retireAmount} credits!`);
        } catch (e) {
            alert("Retirement failed");
        }
        setIsSubmitting(false);
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to retire credits.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/wallet" className="text-emerald-400 hover:underline text-sm">
                        ← Back to Wallet
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Retire Carbon Credits</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Permanently retire credits to offset your carbon footprint and receive a soulbound NFT certificate.
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-8">
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">🔥</span>
                        <div>
                            <h3 className="font-medium text-orange-400">Retirement is Permanent</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Once retired, credits are burned and cannot be recovered or transferred.
                                You will receive an immutable, non-transferable NFT certificate as proof.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Retirement Form */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8">
                    {/* Project Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Credits to Retire *
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                setSelectedProject(e.target.value);
                                setRetireAmount("");
                            }}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">Choose a project...</option>
                            {holdings.map((holding) => (
                                <option key={holding.projectId} value={holding.projectId}>
                                    {holding.name} ({holding.balance} available)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    {selectedProject && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount to Retire *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={retireAmount}
                                    onChange={(e) => setRetireAmount(e.target.value)}
                                    max={maxAmount}
                                    min={1}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-2xl focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    onClick={() => setRetireAmount(maxAmount.toString())}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Available: {maxAmount.toLocaleString()} credits
                            </p>
                        </div>
                    )}

                    {/* Beneficiary Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Beneficiary Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={beneficiaryName}
                            onChange={(e) => setBeneficiaryName(e.target.value)}
                            placeholder="Your name or organization"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            This name will appear on the retirement certificate
                        </p>
                    </div>

                    {/* Retirement Reason */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Reason for Retirement (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Offsetting 2024 business travel emissions"
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>

                    {/* Summary */}
                    {retireAmount && parseFloat(retireAmount) > 0 && (
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Retirement Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Project</span>
                                    <span className="text-gray-900 dark:text-white">{selectedHolding?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Vintage</span>
                                    <span className="text-gray-900 dark:text-white">{selectedHolding?.vintage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                                    <span className="text-gray-900 dark:text-white">{parseFloat(retireAmount).toLocaleString()} tCO2e</span>
                                </div>
                                {beneficiaryName && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Beneficiary</span>
                                        <span className="text-gray-900 dark:text-white">{beneficiaryName}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Impact</span>
                                    <span className="text-2xl font-bold text-emerald-400">
                                        {parseFloat(retireAmount).toLocaleString()} tons CO2 offset
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleRetire}
                        disabled={!selectedProject || !retireAmount || parseFloat(retireAmount) <= 0 || parseFloat(retireAmount) > maxAmount || isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-gray-900 dark:text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {isSubmitting ? "Processing..." : "🔥 Retire Credits"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        This action is irreversible. You will receive an NFT certificate.
                    </p>
                </div>

                {/* Certificate Preview */}
                <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🏆 You will receive</h3>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 max-w-sm mx-auto">
                        <div className="text-4xl mb-3">🌿</div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Carbon Retirement Certificate</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Soulbound NFT • Non-transferable • Immutable
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
