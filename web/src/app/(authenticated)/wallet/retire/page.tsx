"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRetireCredits } from "@/hooks/useMutations";
import { useUserCreditHoldings, useWalletBalances } from "@/hooks/useWalletBalances";
import { useTransactionModal, TransactionModal } from "@/components/ui/TransactionModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WalletNotConnected } from "@/components/ui/ErrorDisplay";

export default function RetireCreditsPage() {
    const { connected } = useWallet();
    const [retireAmount, setRetireAmount] = useState("");
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [reason, setReason] = useState("");

    // Fetch real balances
    const { data: balances, isLoading: balancesLoading } = useWalletBalances();
    const { data: holdings, isLoading: holdingsLoading } = useUserCreditHoldings();

    // Mutation for retiring credits
    const retireMutation = useRetireCredits();

    // Transaction modal
    const txModal = useTransactionModal();

    const creditBalance = balances?.creditBalance || 0;
    const isLoading = balancesLoading || holdingsLoading;

    const handleRetire = async () => {
        const amount = parseFloat(retireAmount);
        if (!amount || amount <= 0 || amount > creditBalance) return;

        txModal.show("Retiring Carbon Credits");

        try {
            const result = await retireMutation.mutateAsync({
                amount: amount * 1_000_000, // Convert to smallest unit
                beneficiaryName: beneficiaryName || undefined,
                reason: reason || undefined,
            });

            txModal.success(result.signature);

            // Reset form
            setRetireAmount("");
            setBeneficiaryName("");
            setReason("");
        } catch (error: any) {
            txModal.fail(error.message || "Transaction failed");
        }
    };

    if (!connected) {
        return <WalletNotConnected />;
    }

    return (
        <>
            <txModal.Modal />

            <div className="min-h-screen py-12">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/wallet" className="text-violet-400 hover:underline text-sm">
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

                            <div>
                                <h3 className="font-medium text-orange-400">Retirement is Permanent</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Once retired, credits are burned and cannot be recovered or transferred.
                                    You will receive an immutable, non-transferable NFT certificate as proof.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Balance Display */}
                    <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Available to Retire</p>
                                {isLoading ? (
                                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {creditBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-lg text-gray-500">tCO₂e</span>
                                    </p>
                                )}
                            </div>
                            <div className="text-4xl">🌿</div>
                        </div>
                    </div>

                    {/* Retirement Form */}
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8">
                        {/* Amount */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Amount to Retire *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={retireAmount}
                                    onChange={(e) => setRetireAmount(e.target.value)}
                                    max={creditBalance}
                                    min={0.01}
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="text-gray-500">tCO₂e</span>
                                    <button
                                        onClick={() => setRetireAmount(creditBalance.toString())}
                                        disabled={creditBalance === 0}
                                        className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-500/20 disabled:opacity-50"
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            {creditBalance > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Available: {creditBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} credits
                                </p>
                            )}
                        </div>

                        {/* Beneficiary Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Beneficiary Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={beneficiaryName}
                                onChange={(e) => setBeneficiaryName(e.target.value)}
                                placeholder="Your name or organization"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                This name will appear on the retirement certificate
                            </p>
                        </div>

                        {/* Retirement Reason */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Reason for Retirement (Optional)
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Offsetting 2024 business travel emissions"
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Summary */}
                        {retireAmount && parseFloat(retireAmount) > 0 && (
                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6 animate-fade-in">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Retirement Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Amount</span>
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {parseFloat(retireAmount).toLocaleString()} tCO₂e
                                        </span>
                                    </div>
                                    {beneficiaryName && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Beneficiary</span>
                                            <span className="text-gray-900 dark:text-white">{beneficiaryName}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-3" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Environmental Impact</span>
                                        <span className="text-2xl font-bold text-emerald-400">
                                            {parseFloat(retireAmount).toLocaleString()} tons CO₂
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleRetire}
                            disabled={
                                !retireAmount ||
                                parseFloat(retireAmount) <= 0 ||
                                parseFloat(retireAmount) > creditBalance ||
                                retireMutation.isPending ||
                                creditBalance === 0
                            }
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {retireMutation.isPending ? (
                                <>
                                    <LoadingSpinner size="sm" color="white" />
                                    Processing...
                                </>
                            ) : (
                                <>Retire Credits</>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            This action is irreversible. You will receive an NFT certificate.
                        </p>
                    </div>

                    {/* Certificate Preview */}
                    <div className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">You will receive</h3>
                        <div className="bg-white dark:bg-gray-900/50 rounded-xl p-6 max-w-sm mx-auto">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Carbon Retirement Certificate</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Soulbound NFT • Non-transferable • Immutable
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
