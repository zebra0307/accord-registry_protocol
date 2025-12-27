"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function CreateListingPage() {
    const { connected } = useWallet();
    const [selectedProject, setSelectedProject] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pricePerTon, setPricePerTon] = useState("");
    const [minPurchase, setMinPurchase] = useState("1");
    const [expiresIn, setExpiresIn] = useState("30");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock user holdings
    const holdings = [
        { projectId: "ICM-MH-2024-001", name: "Mangrove Restoration", balance: 800, vintage: 2024 },
        { projectId: "ICM-KA-2024-002", name: "Seagrass Meadow", balance: 500, vintage: 2024 },
        { projectId: "ICM-GO-2023-005", name: "Solar Farm Initiative", balance: 200, vintage: 2023 },
    ];

    const selectedHolding = holdings.find(h => h.projectId === selectedProject);
    const maxQuantity = selectedHolding?.balance || 0;
    const totalValue = quantity && pricePerTon
        ? (parseFloat(quantity) * parseFloat(pricePerTon)).toFixed(2)
        : "0.00";

    const handleCreateListing = async () => {
        if (!selectedProject || !quantity || !pricePerTon) return;

        setIsSubmitting(true);
        try {
            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Listing created successfully!`);
        } catch (e) {
            alert("Failed to create listing");
        }
        setIsSubmitting(false);
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-400">Please connect your wallet to create a listing.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/marketplace" className="text-emerald-400 hover:underline text-sm">
                        ← Back to Marketplace
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4">Create Listing</h1>
                    <p className="text-gray-400 mt-2">
                        List your carbon credits for sale on the marketplace
                    </p>
                </div>

                {/* Form */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
                    {/* Project Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Credits to List *
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                setSelectedProject(e.target.value);
                                setQuantity("");
                            }}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="">Choose credits...</option>
                            {holdings.map((holding) => (
                                <option key={holding.projectId} value={holding.projectId}>
                                    {holding.name} ({holding.balance} available) - Vintage {holding.vintage}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    {selectedProject && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Quantity to List *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    max={maxQuantity}
                                    min={1}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    onClick={() => setQuantity(maxQuantity.toString())}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/20"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Available: {maxQuantity.toLocaleString()} credits
                            </p>
                        </div>
                    )}

                    {/* Price per Ton */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Price per Credit (USD) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                value={pricePerTon}
                                onChange={(e) => setPricePerTon(e.target.value)}
                                min={0.01}
                                step={0.01}
                                placeholder="15.00"
                                className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Market average: ~$15/credit
                        </p>
                    </div>

                    {/* Minimum Purchase */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Minimum Purchase Quantity
                        </label>
                        <input
                            type="number"
                            value={minPurchase}
                            onChange={(e) => setMinPurchase(e.target.value)}
                            min={1}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Expiration */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Listing Duration
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {["7", "14", "30", "90"].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setExpiresIn(days)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${expiresIn === days
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                            : "bg-gray-700 text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {days} days
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    {quantity && pricePerTon && parseFloat(quantity) > 0 && parseFloat(pricePerTon) > 0 && (
                        <div className="p-6 bg-gray-900/50 rounded-xl mb-6">
                            <h3 className="font-semibold text-white mb-4">Listing Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Project</span>
                                    <span className="text-white">{selectedHolding?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Vintage</span>
                                    <span className="text-white">{selectedHolding?.vintage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quantity</span>
                                    <span className="text-white">{parseFloat(quantity).toLocaleString()} credits</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Price per Credit</span>
                                    <span className="text-white">${parseFloat(pricePerTon).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white">{expiresIn} days</span>
                                </div>
                                <div className="border-t border-gray-700 my-3" />
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Total Listing Value</span>
                                    <span className="text-2xl font-bold text-emerald-400">${totalValue}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6">
                        <div className="flex items-start space-x-3">
                            <span className="text-xl">ℹ️</span>
                            <div className="text-sm">
                                <p className="text-blue-400 font-medium">How Listings Work</p>
                                <p className="text-gray-400 mt-1">
                                    Your credits will be locked in a vault until sold or the listing is cancelled.
                                    A 2% platform fee is deducted from each sale.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleCreateListing}
                        disabled={!selectedProject || !quantity || !pricePerTon || parseFloat(quantity) <= 0 || parseFloat(quantity) > maxQuantity || isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {isSubmitting ? "Creating Listing..." : "Create Listing"}
                    </button>
                </div>
            </div>
        </div>
    );
}
