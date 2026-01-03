"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useWalletBalances, useUserCreditHoldings, useRetirementHistory } from "@/hooks/useWalletBalances";
import { LoadingSpinner, SkeletonCard } from "@/components/ui/LoadingSpinner";
import { WalletNotConnected } from "@/components/ui/ErrorDisplay";

export default function WalletPage() {
    const [mounted, setMounted] = useState(false);
    const { publicKey, connected } = useWallet();
    const [activeTab, setActiveTab] = useState<"credits" | "retired">("credits");

    // Fetch real on-chain data
    const { data: balances, isLoading: balancesLoading } = useWalletBalances();
    const { data: holdings, isLoading: holdingsLoading } = useUserCreditHoldings();
    const { data: retirements, isLoading: retirementsLoading } = useRetirementHistory();

    // Calculate values
    const creditBalance = balances?.creditBalance || 0;
    const solBalance = balances?.solBalance || 0;
    const totalRetired = retirements?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const portfolioValue = creditBalance * 15; // Assuming ~$15/credit

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    if (!connected) {
        return <WalletNotConnected />;
    }

    const isLoading = balancesLoading || holdingsLoading;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your carbon credit holdings</p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-violet-400 text-sm font-medium mb-2">Total Credit Balance</p>
                            {isLoading ? (
                                <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                            ) : (
                                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                    {creditBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-2xl text-gray-600 dark:text-gray-400">tCO₂e</span>
                                </div>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                                ≈ ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href="/dex/swap"
                                className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-gray-900 dark:text-white font-medium hover:bg-white/20 transition-colors"
                            >
                                Swap
                            </Link>
                            <Link
                                href="/wallet/retire"
                                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                            >
                                Retire Credits
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-violet-500/20">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">SOL Balance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isLoading ? "—" : solBalance.toFixed(4)} SOL
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Credits Retired</p>
                            <p className="text-2xl font-bold text-emerald-400">{totalRetired} tCO₂e</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Certificates</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {retirements?.length || 0} NFTs
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab("credits")}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "credits"
                            ? "bg-violet-500/10 text-violet-400 border border-violet-500/30"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        Credit Holdings
                    </button>
                    <button
                        onClick={() => setActiveTab("retired")}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === "retired"
                            ? "bg-violet-500/10 text-violet-400 border border-violet-500/30"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        Retirement Certificates
                    </button>
                </div>

                {/* Content */}
                {activeTab === "credits" ? (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Credit Holdings by Project</h2>
                        </div>
                        {holdingsLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex justify-between">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : holdings && holdings.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                {holdings.map((holding, idx) => (
                                    <div key={`${holding.projectId}-${idx}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{holding.projectName}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {holding.projectId} • Vintage {holding.vintage} • {holding.sector}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {holding.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">tCO₂e</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Credits Yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    You don't have any carbon credits. Purchase some from the marketplace or register a project!
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Link
                                        href="/marketplace"
                                        className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                                    >
                                        Browse Marketplace
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Register Project
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Retirement Certificates (NFTs)</h2>
                        </div>
                        {retirementsLoading ? (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(i => <SkeletonCard key={i} />)}
                            </div>
                        ) : retirements && retirements.length > 0 ? (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {retirements.map((cert) => (
                                    <div
                                        key={cert.id}
                                        className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl"
                                    >
                                        <div className="flex items-center justify-between mb-4">

                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                                                Soulbound NFT
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{cert.id}</h3>
                                        <p className="text-2xl font-bold text-emerald-400 mb-2">{cert.amount} tCO₂e</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {cert.projectId} • {cert.date.toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Retirements Yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Retire carbon credits to offset your footprint and receive a permanent NFT certificate.
                                </p>
                                <Link
                                    href="/wallet/retire"
                                    className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                                >
                                    Retire Credits
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                    <Link
                        href="/marketplace/create"
                        className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:border-violet-500/30 transition-colors group text-center"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8l-1.68 4.2a1 1 0 00.95 1.3h11.46a1 1 0 00.95-1.3L16 13M7 13l-2-8m0 0h14l-4 8H7" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">List on Marketplace</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sell your credits to buyers</p>
                    </Link>

                    <Link
                        href="/dex/pools"
                        className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl hover:border-violet-500/30 transition-colors group text-center"
                    >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Add to Pool</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Provide liquidity & earn fees</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
