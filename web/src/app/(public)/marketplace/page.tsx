"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAllListings, useAllProjects } from "@/hooks/useOnChainData";
import { formatAddress } from "@/lib/data/onchain";

interface Listing {
    id: string;
    projectId: string;
    seller: string;
    sector: string;
    subType: string;
    vintageYear: number;
    quantityAvailable: number;
    pricePerTon: number;
    qualityRating: number;
    countryCode: string;
    regionName: string;
    coBenefits: string[];
}

// Main sectors with subtypes
const SECTOR_HIERARCHY = {
    all: { label: "All Sectors", icon: "📋", subtypes: [] as { id: string; label: string }[] },
    blueCarbon: {
        label: "Blue Carbon",
        icon: "🌊",
        subtypes: [
            { id: "all", label: "All Blue Carbon" },
            { id: "mangrove", label: "Mangrove" },
            { id: "seagrass", label: "Seagrass" },
            { id: "saltMarsh", label: "Salt Marsh" },
            { id: "kelp", label: "Kelp Forest" },
        ]
    },
    forestry: {
        label: "Forestry",
        icon: "🌲",
        subtypes: [
            { id: "all", label: "All Forestry" },
            { id: "afforestation", label: "Afforestation" },
            { id: "reforestation", label: "Reforestation" },
            { id: "avoidedDeforestation", label: "Avoided Deforestation" },
            { id: "forestManagement", label: "Forest Management" },
        ]
    },
    renewableEnergy: {
        label: "Renewable Energy",
        icon: "⚡",
        subtypes: [
            { id: "all", label: "All Renewable" },
            { id: "solar", label: "Solar" },
            { id: "wind", label: "Wind" },
            { id: "hydro", label: "Hydro" },
            { id: "geothermal", label: "Geothermal" },
        ]
    },
    wasteManagement: {
        label: "Waste Management",
        icon: "♻️",
        subtypes: [
            { id: "all", label: "All Waste" },
            { id: "landfillGas", label: "Landfill Gas" },
            { id: "composting", label: "Composting" },
            { id: "recycling", label: "Recycling" },
            { id: "wasteToEnergy", label: "Waste-to-Energy" },
        ]
    },
    agriculture: {
        label: "Agriculture",
        icon: "🌾",
        subtypes: [
            { id: "all", label: "All Agriculture" },
            { id: "soilCarbon", label: "Soil Carbon" },
            { id: "agroforestry", label: "Agroforestry" },
            { id: "riceManagement", label: "Rice Management" },
            { id: "livestock", label: "Livestock" },
        ]
    },
    industrial: {
        label: "Industrial",
        icon: "🏭",
        subtypes: [
            { id: "all", label: "All Industrial" },
            { id: "energyEfficiency", label: "Energy Efficiency" },
            { id: "fuelSwitch", label: "Fuel Switch" },
            { id: "processImprovement", label: "Process Improvement" },
            { id: "carbonCapture", label: "Carbon Capture" },
        ]
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

export default function MarketplacePage() {
    const [selectedSector, setSelectedSector] = useState("all");
    const [selectedSubType, setSelectedSubType] = useState("all");
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
                subType: "all", // Default subtype
                vintageYear: l.vintageYear,
                quantityAvailable: l.quantityAvailable,
                pricePerTon: l.pricePerTon / 1_000_000,
                qualityRating: l.qualityRating,
                countryCode: project?.countryCode || "",
                regionName: project?.regionName || "",
                coBenefits: l.coBenefits,
            };
        });
    }, [onChainListings, projectMap]);

    // Get current sector's subtypes
    const currentSectorData = SECTOR_HIERARCHY[selectedSector as keyof typeof SECTOR_HIERARCHY];
    const hasSubtypes = currentSectorData && currentSectorData.subtypes && currentSectorData.subtypes.length > 0;

    // Handle sector change
    const handleSectorChange = (sector: string) => {
        setSelectedSector(sector);
        setSelectedSubType("all"); // Reset subtype when sector changes
    };

    // Apply filters
    const filteredListings = useMemo(() => {
        let filtered = [...listings];

        // Sector filter
        if (selectedSector !== "all") {
            filtered = filtered.filter(l => l.sector === selectedSector);
        }

        // Subtype filter (if applicable)
        if (selectedSubType !== "all") {
            filtered = filtered.filter(l => l.subType === selectedSubType);
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
    }, [listings, selectedSector, selectedSubType, minPrice, maxPrice, sortBy]);


    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Browse and purchase verified carbon credits
                        </p>
                    </div>
                    <Link
                        href="/marketplace/create"
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-semibold transition-colors"
                    >
                        + Create Listing
                    </Link>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Filters</h3>

                            {/* Sector Filter */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sector
                                </label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => handleSectorChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    <option value="all">All Sectors</option>
                                    {Object.entries(SECTOR_HIERARCHY).filter(([key]) => key !== "all").map(([key, data]) => (
                                        <option key={key} value={key}>
                                            {data.icon} {data.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subtype Filter (Nested - appears when sector selected) */}
                            {hasSubtypes && (
                                <div className="mb-6 ml-4 pl-4 border-l-2 border-violet-200 dark:border-violet-800">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {currentSectorData.label} Type
                                    </label>
                                    <select
                                        value={selectedSubType}
                                        onChange={(e) => setSelectedSubType(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        {currentSectorData.subtypes.map(subtype => (
                                            <option key={subtype.id} value={subtype.id}>
                                                {subtype.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range (SOL)
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                                    setSelectedSubType("all");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    setSortBy("priceAsc");
                                }}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">{filteredListings.length}</span> listings found
                                {selectedSector !== "all" && (
                                    <span className="ml-2 px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-sm">
                                        {SECTOR_ICONS[selectedSector]} {SECTOR_HIERARCHY[selectedSector as keyof typeof SECTOR_HIERARCHY]?.label}
                                        {selectedSubType !== "all" && ` → ${selectedSubType}`}
                                    </span>
                                )}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-12 text-center">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Listings Found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {listings.length === 0
                                        ? "No carbon credit listings are currently available."
                                        : "No listings match your current filters."
                                    }
                                </p>
                                <Link
                                    href="/marketplace/create"
                                    className="inline-flex px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    Create First Listing
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredListings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Card Header */}
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{SECTOR_ICONS[listing.sector] || "📋"}</span>
                                                <div className="flex items-center space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={star <= listing.qualityRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                                {listing.projectId}
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex justify-between">
                                                    <span>Available:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {listing.quantityAvailable} tCO₂e
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Vintage:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {listing.vintageYear}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Region:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {listing.regionName || listing.countryCode || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Price per tCO₂e</div>
                                                    <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
                                                        {listing.pricePerTon.toFixed(2)} SOL
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/marketplace/${listing.id}`}
                                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg font-medium transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
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
