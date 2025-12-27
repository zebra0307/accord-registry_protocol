"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useProgram } from "@/providers/ProgramProvider";
import {
    getProjectPda,
    getRegistryPda,
    getDoubleCountingRegistryPda,
    getUserAccountPda
} from "@/lib/anchor/pdas";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import Link from "next/link";

const PROJECT_SECTORS = [
    { id: "blueCarbon", label: "Blue Carbon", description: "Mangroves, Seagrass, Salt Marshes" },
    { id: "forestry", label: "Forestry", description: "ARR, REDD+, Conservation" },
    { id: "renewableEnergy", label: "Renewable Energy", description: "Solar, Wind, Hydro" },
    { id: "wasteManagement", label: "Waste Management", description: "Methane Capture, Recycling" },
    { id: "agriculture", label: "Agriculture", description: "Soil Carbon, Biochar" },
    { id: "industrial", label: "Industrial", description: "CCS, Energy Efficiency" },
];

export default function RegisterProjectPage() {
    const [mounted, setMounted] = useState(false);
    const { publicKey, connected } = useWallet();
    const { program } = useProgram();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Registry ID
        icmRegistryId: "",

        // Step 2: Project Details
        projectSector: "blueCarbon",
        carbonTonsEstimated: "",
        areaHectares: "",
        vintageYear: new Date().getFullYear(),
        pricePerTon: "",

        // Step 3: Location
        countryCode: "",
        regionName: "",
        latitude: "",
        longitude: "",

        // Step 4: Documentation
        ipfsCid: "",

        // Fees
        verificationFee: "0.1",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!publicKey || !program) return;

        setLoading(true);
        try {
            const [projectPda] = getProjectPda(publicKey, formData.icmRegistryId);
            const [registryPda] = getRegistryPda();
            const [doubleCountingRegistryPda] = getDoubleCountingRegistryPda();
            const [userAccountPda] = getUserAccountPda(publicKey);

            const verificationFeeLamports = new anchor.BN(
                parseFloat(formData.verificationFee) * LAMPORTS_PER_SOL
            );

            const projectData = {
                projectId: formData.icmRegistryId,
                ipfsCid: formData.ipfsCid || "QmPlaceholder",
                carbonTonsEstimated: new anchor.BN(parseInt(formData.carbonTonsEstimated) || 0),
                projectSector: { [formData.projectSector]: {} },
                location: {
                    latitude: parseFloat(formData.latitude) || 0,
                    longitude: parseFloat(formData.longitude) || 0,
                    polygonCoordinates: [],
                    countryCode: formData.countryCode,
                    regionName: formData.regionName,
                },
                areaHectares: parseFloat(formData.areaHectares) || 0,
                establishmentDate: new anchor.BN(Math.floor(Date.now() / 1000)),
                vintageYear: parseInt(formData.vintageYear.toString()),
                pricePerTon: new anchor.BN(parseInt(formData.pricePerTon) * 1_000_000 || 0),
                cctsRegistryId: formData.icmRegistryId,
                complianceIdSignature: Buffer.from([]),
            };

            await program.methods
                .registerProject(projectData, verificationFeeLamports)
                .accounts({
                    project: projectPda,
                    registry: registryPda,
                    projectOwner: publicKey,
                    userAccount: userAccountPda,
                    doubleCountingRegistry: doubleCountingRegistryPda,
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc();

            alert("Project registered successfully!");
            router.push("/dashboard/developer");
        } catch (e: any) {
            console.error("Registration failed:", e);
            alert("Registration failed: " + e.message);
        }
        setLoading(false);
    };

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
                    <p className="text-gray-400">Please connect your wallet to register a project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/developer" className="text-emerald-400 hover:underline">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4">Register New Project</h1>
                    <p className="text-gray-400 mt-2">
                        Submit your carbon credit project for verification
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {["Registry ID", "Details", "Location", "Documentation"].map((label, i) => (
                        <div key={label} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step > i + 1
                                    ? "bg-emerald-500 text-white"
                                    : step === i + 1
                                        ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500"
                                        : "bg-gray-700 text-gray-400"
                                    }`}
                            >
                                {step > i + 1 ? "✓" : i + 1}
                            </div>
                            {i < 3 && (
                                <div
                                    className={`w-16 h-1 ${step > i + 1 ? "bg-emerald-500" : "bg-gray-700"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
                    {/* Step 1: ICM Registry ID */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">ICM Registry ID</h2>
                            <p className="text-gray-400 mb-6">
                                Enter your government-issued ICM Registry ID. This ID will be used as your Project ID.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        ICM Registry ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="icmRegistryId"
                                        value={formData.icmRegistryId}
                                        onChange={handleInputChange}
                                        placeholder="e.g., ICM-MH-2024-001"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                    <p className="text-gray-500 text-sm mt-2">
                                        Must match exactly with your government registration
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.icmRegistryId}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Project Details */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Project Details</h2>

                            <div className="space-y-6">
                                {/* Sector Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Project Sector *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PROJECT_SECTORS.map((sector) => (
                                            <label
                                                key={sector.id}
                                                className={`p-4 rounded-xl border cursor-pointer transition-colors ${formData.projectSector === sector.id
                                                    ? "border-emerald-500 bg-emerald-500/10"
                                                    : "border-gray-700 hover:border-gray-600"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="projectSector"
                                                    value={sector.id}
                                                    checked={formData.projectSector === sector.id}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                <div className="font-medium text-white">{sector.label}</div>
                                                <div className="text-sm text-gray-400">{sector.description}</div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Estimated Carbon Tons *
                                        </label>
                                        <input
                                            type="number"
                                            name="carbonTonsEstimated"
                                            value={formData.carbonTonsEstimated}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1000"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Area (Hectares)
                                        </label>
                                        <input
                                            type="number"
                                            name="areaHectares"
                                            value={formData.areaHectares}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 100"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Vintage Year
                                        </label>
                                        <input
                                            type="number"
                                            name="vintageYear"
                                            value={formData.vintageYear}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Price per Ton (USD)
                                        </label>
                                        <input
                                            type="number"
                                            name="pricePerTon"
                                            value={formData.pricePerTon}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 15"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 bg-gray-700 rounded-xl text-white font-semibold"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.carbonTonsEstimated}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Project Location</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Country Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="countryCode"
                                            value={formData.countryCode}
                                            onChange={handleInputChange}
                                            placeholder="e.g., IN"
                                            maxLength={2}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Region/State *
                                        </label>
                                        <input
                                            type="text"
                                            name="regionName"
                                            value={formData.regionName}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Maharashtra"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 19.076"
                                            step="0.001"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 72.877"
                                            step="0.001"
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 bg-gray-700 rounded-xl text-white font-semibold"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    disabled={!formData.countryCode || !formData.regionName}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Documentation & Submit */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6">Documentation & Fees</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Design Document (PDD) - IPFS CID
                                    </label>
                                    <input
                                        type="text"
                                        name="ipfsCid"
                                        value={formData.ipfsCid}
                                        onChange={handleInputChange}
                                        placeholder="e.g., QmYwAPJzv5CZsnA..."
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                    />
                                    <p className="text-gray-500 text-sm mt-2">
                                        Upload your PDD to IPFS and enter the content hash
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Verification Fee (SOL) *
                                    </label>
                                    <input
                                        type="number"
                                        name="verificationFee"
                                        value={formData.verificationFee}
                                        onChange={handleInputChange}
                                        min="0.1"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <p className="text-gray-500 text-sm mt-2">
                                        Minimum 0.1 SOL. This fee will be held in escrow and released to the validator after verification.
                                    </p>
                                </div>

                                {/* Summary */}
                                <div className="bg-gray-900/50 rounded-xl p-6">
                                    <h3 className="font-semibold text-white mb-4">Registration Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Project ID:</span>
                                            <span className="text-white">{formData.icmRegistryId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Sector:</span>
                                            <span className="text-white capitalize">{formData.projectSector}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Carbon Tons:</span>
                                            <span className="text-white">{formData.carbonTonsEstimated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Location:</span>
                                            <span className="text-white">{formData.regionName}, {formData.countryCode}</span>
                                        </div>
                                        <div className="border-t border-gray-700 my-3" />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-gray-400">Verification Fee:</span>
                                            <span className="text-emerald-400">{formData.verificationFee} SOL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 bg-gray-700 rounded-xl text-white font-semibold"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || parseFloat(formData.verificationFee) < 0.1}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold disabled:opacity-50"
                                >
                                    {loading ? "Registering..." : "Register Project"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
