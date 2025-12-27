"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock listings data (same as marketplace page)
const MOCK_LISTINGS: Record<string, {
    id: string;
    projectId: string;
    projectName: string;
    seller: string;
    pricePerTon: number;
    quantity: number;
    sector: string;
    vintage: number;
    location: string;
    qualityRating: number;
    coBenefits: string[];
    description: string;
}> = {
    "1": {
        id: "1",
        projectId: "ICM-MH-2024-001",
        projectName: "Mangrove Restoration Mumbai",
        seller: "5abc...xyz",
        pricePerTon: 15,
        quantity: 500,
        sector: "blueCarbon",
        vintage: 2024,
        location: "Maharashtra, IN",
        qualityRating: 4.8,
        coBenefits: ["Biodiversity", "Community Jobs", "Coastal Protection"],
        description: "High-quality blue carbon credits from mangrove restoration project in Mumbai coastal area. Verified by third-party auditors with DePIN monitoring.",
    },
    "2": {
        id: "2",
        projectId: "ICM-KA-2024-002",
        projectName: "Seagrass Meadow Karnataka",
        seller: "7def...uvw",
        pricePerTon: 18,
        quantity: 300,
        sector: "blueCarbon",
        vintage: 2024,
        location: "Karnataka, IN",
        qualityRating: 4.9,
        coBenefits: ["Marine Life", "Water Quality", "Fisheries Support"],
        description: "Premium seagrass carbon credits from Karnataka's coastal ecosystem restoration. Continuous IoT monitoring and satellite verification.",
    },
    "3": {
        id: "3",
        projectId: "ICM-GO-2023-005",
        projectName: "Solar Farm Initiative Goa",
        seller: "9ghi...rst",
        pricePerTon: 12,
        quantity: 1000,
        sector: "renewableEnergy",
        vintage: 2023,
        location: "Goa, IN",
        qualityRating: 4.5,
        coBenefits: ["Clean Energy", "Grid Stability", "Local Employment"],
        description: "Carbon credits from a 50MW solar installation in Goa. Averted emissions from fossil fuel displacement.",
    },
};

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

export default function ListingDetailPage() {
    const { id } = useParams();
    const { connected } = useWallet();
    const [purchaseAmount, setPurchaseAmount] = useState("1");
    const [isPurchasing, setIsPurchasing] = useState(false);

    const listing = MOCK_LISTINGS[id as string];

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Listing Not Found</h2>
                    <p className="text-gray-400 mb-6">The listing you're looking for doesn't exist.</p>
                    <Link
                        href="/marketplace"
                        className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium hover:bg-emerald-500/20"
                    >
                        Back to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    const amount = parseInt(purchaseAmount) || 0;
    const totalPrice = amount * listing.pricePerTon;
    const platformFee = totalPrice * 0.02;
    const totalCost = totalPrice + platformFee;

    const handlePurchase = async () => {
        if (!connected || amount <= 0 || amount > listing.quantity) return;

        setIsPurchasing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Successfully purchased ${amount} credits for $${totalCost.toFixed(2)}!`);
        } catch (e) {
            alert("Purchase failed");
        }
        setIsPurchasing(false);
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href="/marketplace" className="text-emerald-400 hover:underline text-sm">
                    ← Back to Marketplace
                </Link>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Listing Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-4xl">
                                        {SECTOR_ICONS[listing.sector]}
                                    </div>
                                    <div>
                                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium">
                                            {listing.sector.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <h1 className="text-2xl font-bold text-white mt-2">{listing.projectName}</h1>
                                        <p className="text-gray-400">{listing.projectId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 text-yellow-400">
                                    {"★".repeat(Math.floor(listing.qualityRating))}
                                    <span className="text-white ml-2">{listing.qualityRating}</span>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6">{listing.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-gray-400 text-sm">Price/Credit</div>
                                    <div className="text-xl font-bold text-emerald-400">${listing.pricePerTon}</div>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-gray-400 text-sm">Available</div>
                                    <div className="text-xl font-bold text-white">{listing.quantity}</div>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-gray-400 text-sm">Vintage</div>
                                    <div className="text-xl font-bold text-white">{listing.vintage}</div>
                                </div>
                                <div className="p-4 bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-gray-400 text-sm">Location</div>
                                    <div className="text-xl font-bold text-white">📍 {listing.location.split(",")[0]}</div>
                                </div>
                            </div>
                        </div>

                        {/* Co-Benefits */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                            <h2 className="font-semibold text-white mb-4">Co-Benefits & SDG Contributions</h2>
                            <div className="flex flex-wrap gap-3">
                                {listing.coBenefits.map((benefit) => (
                                    <span
                                        key={benefit}
                                        className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm"
                                    >
                                        ✓ {benefit}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Project Link */}
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                            <h2 className="font-semibold text-white mb-4">Project Information</h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Seller</p>
                                    <p className="text-white font-mono">{listing.seller}</p>
                                </div>
                                <Link
                                    href={`/project/${listing.projectId}`}
                                    className="px-4 py-2 bg-gray-700 rounded-lg text-white text-sm hover:bg-gray-600"
                                >
                                    View Project Details
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-white mb-6">Purchase Credits</h2>

                            {!connected ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🔒</div>
                                    <p className="text-gray-400 mb-4">Connect your wallet to purchase</p>
                                </div>
                            ) : (
                                <>
                                    {/* Amount Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm text-gray-400 mb-2">Amount to Purchase</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={purchaseAmount}
                                                onChange={(e) => setPurchaseAmount(e.target.value)}
                                                min={1}
                                                max={listing.quantity}
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                            />
                                            <button
                                                onClick={() => setPurchaseAmount(listing.quantity.toString())}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs"
                                            >
                                                MAX
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Available: {listing.quantity} credits</p>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-white">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Platform Fee (2%)</span>
                                            <span className="text-white">${platformFee.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-700 pt-3 flex justify-between">
                                            <span className="text-white font-semibold">Total</span>
                                            <span className="text-2xl font-bold text-emerald-400">${totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Purchase Button */}
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing || amount <= 0 || amount > listing.quantity}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                    >
                                        {isPurchasing ? "Processing..." : `Buy ${amount} Credits`}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Payment in USDC on Solana
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
