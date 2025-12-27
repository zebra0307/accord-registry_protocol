"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAllListings, useAllProjects } from "@/hooks/useOnChainData";
import { formatAddress } from "@/lib/data/onchain";

interface Listing {
    id: string;
    projectId: string;
    seller: string;
    sector: string;
    vintageYear: number;
    quantityAvailable: number;
    pricePerTon: number;
    qualityRating: number;
    countryCode: string;
    regionName: string;
    coBenefits: string[];
}

const SECTORS = [
    { id: "all", label: "All Sectors" },
    { id: "blueCarbon", label: "Blue Carbon" },
    { id: "forestry", label: "Forestry" },
    { id: "renewableEnergy", label: "Renewable Energy" },
    { id: "wasteManagement", label: "Waste Management" },
    { id: "agriculture", label: "Agriculture" },
    { id: "industrial", label: "Industrial" },
];

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

export default function MarketplacePage() {
    const [selectedSector, setSelectedSector] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("priceAsc");

    // Fetch listings and projects from on-chain
    const { data: onChainListings, isLoading: loading } = useAllListings();
    const { data: onChainProjects } = useAllProjects();

    // Build a project lookup map for getting sector info
    const projectMap = useMemo(() => {
        const map = new Map<string, { sector: string; regionName: string; countryCode: string }>();
        onChainProjects?.forEach(p => {
            map.set(p.projectId, {
                sector: p.projectSector,
                regionName: p.location.regionName,
                countryCode: p.location.countryCode,
            });
        });
        return map;
    }, [onChainProjects]);

    // Transform on-chain listings to UI format
    const listings = useMemo<Listing[]>(() => {
        if (!onChainListings) return [];

        return onChainListings.map((l) => {
            const project = projectMap.get(l.projectId);
            return {
                id: l.publicKey.toString(),
                projectId: l.projectId,
                seller: formatAddress(l.seller),
                sector: project?.sector || "unknown",
                vintageYear: l.vintageYear,
                quantityAvailable: l.quantityAvailable,
                pricePerTon: l.pricePerTon / 1_000_000, // Convert from micro-tokens
                qualityRating: l.qualityRating,
                countryCode: project?.countryCode || "",
                regionName: project?.regionName || "",
                coBenefits: l.coBenefits,
            };
        });
    }, [onChainListings, projectMap]);


    // Apply filters using useMemo (more efficient than useEffect+state)
    const filteredListings = useMemo(() => {
        let filtered = [...listings];

        // Sector filter
        if (selectedSector !== "all") {
            filtered = filtered.filter(l => l.sector === selectedSector);
        }

        // Price filter
        if (minPrice) {
            filtered = filtered.filter(l => l.pricePerTon >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(l => l.pricePerTon <= parseFloat(maxPrice));
        }

        // Sorting
        switch (sortBy) {
            case "priceAsc":
                filtered.sort((a, b) => a.pricePerTon - b.pricePerTon);
                break;
            case "priceDesc":
                filtered.sort((a, b) => b.pricePerTon - a.pricePerTon);
                break;
            case "quantityDesc":
                filtered.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
                break;
            case "ratingDesc":
                filtered.sort((a, b) => b.qualityRating - a.qualityRating);
                break;
        }

        return filtered;
    }, [listings, selectedSector, minPrice, maxPrice, sortBy]);


    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
                        <p className="text-gray-400 mt-1">
                            Browse and purchase verified carbon credits
                        </p>
                    </div>
                    <Link
                        href="/marketplace/create"
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        + Create Listing
                    </Link>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 sticky top-24">
                            <h3 className="font-semibold text-white mb-4">Filters</h3>

                            {/* Sector Filter */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-2">Sector</label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                >
                                    {SECTORS.map(sector => (
                                        <option key={sector.id} value={sector.id}>
                                            {sector.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm text-gray-400 mb-2">Price Range (USD)</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="priceAsc">Price: Low to High</option>
                                    <option value="priceDesc">Price: High to Low</option>
                                    <option value="quantityDesc">Quantity: High to Low</option>
                                    <option value="ratingDesc">Rating: High to Low</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedSector("all");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    setSortBy("priceAsc");
                                }}
                                className="w-full mt-6 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-400">
                                {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        {filteredListings.length === 0 ? (
                            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold text-white mb-2">No Listings Found</h3>
                                <p className="text-gray-400">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredListings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors card-hover"
                                    >
                                        {/* Header */}
                                        <div className="p-6 border-b border-gray-700/50">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-2xl">{SECTOR_ICONS[listing.sector]}</span>
                                                        <span className="text-sm text-gray-400 capitalize">{listing.sector}</span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white">{listing.projectId}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {listing.regionName}, {listing.countryCode}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={i < listing.qualityRating ? "text-yellow-400" : "text-gray-600"}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-400">Available</div>
                                                    <div className="text-xl font-bold text-white">
                                                        {listing.quantityAvailable.toLocaleString()} tons
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">Price</div>
                                                    <div className="text-xl font-bold text-emerald-400">
                                                        ${listing.pricePerTon}/ton
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Co-benefits */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {listing.coBenefits.map((benefit) => (
                                                    <span
                                                        key={benefit}
                                                        className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                                                    >
                                                        {benefit.replace(/([A-Z])/g, " $1").trim()}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Buy Button */}
                                            <Link
                                                href={`/marketplace/${listing.id}`}
                                                className="block w-full py-3 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium hover:bg-emerald-500/20 transition-colors"
                                            >
                                                View & Buy
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
