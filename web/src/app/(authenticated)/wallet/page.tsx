"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function WalletPage() {
    const [mounted, setMounted] = useState(false);
    const { publicKey, connected } = useWallet();
    const [activeTab, setActiveTab] = useState<"credits" | "retired">("credits");

    // Mock data
    const creditBalance = 1500;
    const totalRetired = 250;
    const portfolioValue = creditBalance * 15; // Assuming $15/ton

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

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-400">Please connect your wallet to view your credits.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">My Wallet</h1>
                    <p className="text-gray-400 mt-1">Manage your carbon credit holdings</p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-emerald-400 text-sm font-medium mb-2">Total Credit Balance</p>
                            <div className="text-5xl font-bold text-white mb-2">
                                {creditBalance.toLocaleString()} <span className="text-2xl text-gray-400">ACCORD</span>
                            </div>
                            <p className="text-gray-400">
                                ≈ ${portfolioValue.toLocaleString()} USD
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href="/wallet/transfer"
                                className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                            >
                                Transfer
                            </Link>
                            <Link
                                href="/wallet/retire"
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                Retire Credits
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-emerald-500/20">
                        <div>
                            <p className="text-gray-400 text-sm">Credits Retired</p>
                            <p className="text-2xl font-bold text-white">{totalRetired}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Impact (CO2)</p>
                            <p className="text-2xl font-bold text-emerald-400">{totalRetired} tons</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Certificates</p>
                            <p className="text-2xl font-bold text-white">3 NFTs</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab("credits")}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "credits"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Credit Holdings
                    </button>
                    <button
                        onClick={() => setActiveTab("retired")}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "retired"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Retirement Certificates
                    </button>
                </div>

                {/* Content */}
                {activeTab === "credits" ? (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50">
                            <h2 className="text-lg font-semibold text-white">Credit Holdings by Project</h2>
                        </div>
                        <div className="divide-y divide-gray-700/50">
                            {[
                                { projectId: "ICM-MH-2024-001", name: "Mangrove Restoration", balance: 800, vintage: 2024 },
                                { projectId: "ICM-KA-2024-002", name: "Seagrass Meadow", balance: 500, vintage: 2024 },
                                { projectId: "ICM-GO-2023-005", name: "Solar Farm Initiative", balance: 200, vintage: 2023 },
                            ].map((holding) => (
                                <div key={holding.projectId} className="p-6 hover:bg-gray-700/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">{holding.name}</h3>
                                            <p className="text-sm text-gray-400">{holding.projectId} • Vintage {holding.vintage}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-white">{holding.balance.toLocaleString()}</div>
                                            <div className="text-sm text-gray-400">ACCORD</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-700/50">
                            <h2 className="text-lg font-semibold text-white">Retirement Certificates (NFTs)</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: "RET-2024-001", amount: 100, date: "Dec 15, 2024", project: "ICM-MH-2024-001" },
                                { id: "RET-2024-002", amount: 100, date: "Dec 20, 2024", project: "ICM-KA-2024-002" },
                                { id: "RET-2024-003", amount: 50, date: "Dec 25, 2024", project: "ICM-MH-2024-001" },
                            ].map((cert) => (
                                <div
                                    key={cert.id}
                                    className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">🏆</span>
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                                            Soulbound NFT
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{cert.id}</h3>
                                    <p className="text-2xl font-bold text-emerald-400 mb-2">{cert.amount} tCO2e</p>
                                    <p className="text-sm text-gray-400">
                                        {cert.project} • {cert.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                    <Link
                        href="/marketplace/create"
                        className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-emerald-500/30 transition-colors group text-center"
                    >
                        <div className="text-3xl mb-3">🏪</div>
                        <h3 className="font-semibold text-white">List on Marketplace</h3>
                        <p className="text-sm text-gray-400 mt-1">Sell your credits to buyers</p>
                    </Link>

                    <Link
                        href="/dex/pools"
                        className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-emerald-500/30 transition-colors group text-center"
                    >
                        <div className="text-3xl mb-3">🌊</div>
                        <h3 className="font-semibold text-white">Add to Pool</h3>
                        <p className="text-sm text-gray-400 mt-1">Provide liquidity & earn fees</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
