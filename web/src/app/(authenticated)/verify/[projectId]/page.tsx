"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock project data
const MOCK_PROJECT = {
    id: "ICM-AP-2024-003",
    name: "Forestry Conservation",
    sector: "forestry",
    owner: "9ghi...rst",
    carbonTonsEstimated: 2000,
    escrowBalance: 0.15,
    submittedAt: "2024-12-25T10:00:00",
    location: { regionName: "Andhra Pradesh", countryCode: "IN", lat: 15.912, lng: 79.740 },
    ipfsCid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    areaHectares: 500,
    vintageYear: 2024,
    establishmentDate: "2023-01-15",
    pricePerTon: 12,
    // Monitoring data
    monitoringData: {
        satelliteImagery: "QmSatelliteImageCid...",
        ndviIndex: 0.72,
        waterQuality: 8.2,
        temperature: 26.5,
        ecosystemHealthScore: 78,
        lastUpdated: "2024-12-20",
    },
};

const VERIFICATION_CHECKLIST = [
    { id: "pdd", label: "Project Design Document reviewed", category: "Documentation" },
    { id: "baseline", label: "Baseline emissions verified", category: "Documentation" },
    { id: "additionality", label: "Additionality confirmed", category: "Methodology" },
    { id: "methodology", label: "Approved methodology applied", category: "Methodology" },
    { id: "satellite", label: "Satellite imagery validated", category: "DePIN Data" },
    { id: "ndvi", label: "NDVI values confirmed", category: "DePIN Data" },
    { id: "iot", label: "IoT sensor data reviewed", category: "DePIN Data" },
    { id: "boundary", label: "Project boundary verified", category: "Location" },
    { id: "h3", label: "H3 hexagon overlap checked", category: "Location" },
    { id: "stakeholder", label: "Stakeholder consultation done", category: "Social" },
];

export default function VerifyProjectPage() {
    const { projectId } = useParams();
    const router = useRouter();
    const { connected } = useWallet();

    const [project, setProject] = useState(MOCK_PROJECT);
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});
    const [verifiedCarbonTons, setVerifiedCarbonTons] = useState("");
    const [notes, setNotes] = useState("");
    const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checklistProgress = Object.values(checklist).filter(Boolean).length;
    const totalChecklist = VERIFICATION_CHECKLIST.length;
    const allChecked = checklistProgress === totalChecklist;

    const handleChecklistToggle = (id: string) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmitVerification = async () => {
        if (decision === "approve" && (!verifiedCarbonTons || !allChecked)) return;
        if (decision === "reject" && !rejectReason) return;

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Project ${decision === "approve" ? "verified" : "rejected"} successfully!`);
            router.push("/dashboard/validator");
        } catch (e) {
            alert("Verification failed");
        }
        setIsSubmitting(false);
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please connect your wallet as a validator to verify projects.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/validator" className="text-emerald-400 hover:underline text-sm">
                        ← Back to Validator Dashboard
                    </Link>
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Project</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{projectId}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-xl font-medium">
                                ⏳ Awaiting Audit
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                                Escrow: <span className="text-emerald-400 font-medium">{project.escrowBalance} SOL</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Project Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Project Name</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Sector</div>
                                    <div className="font-medium text-gray-900 dark:text-white capitalize">{project.sector}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{project.location.regionName}, {project.location.countryCode}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Area</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{project.areaHectares} hectares</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Carbon</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{project.carbonTonsEstimated.toLocaleString()} tCO2e</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Vintage Year</div>
                                    <div className="font-medium text-gray-900 dark:text-white">{project.vintageYear}</div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <a
                                    href={`https://ipfs.io/ipfs/${project.ipfsCid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-emerald-400 hover:underline"
                                >
                                    📄 View Project Design Document (PDD)
                                    <span className="ml-2">↗</span>
                                </a>
                            </div>
                        </div>

                        {/* DePIN Monitoring Data */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DePIN Monitoring Data</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-2xl mb-2">🛰️</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">NDVI Index</div>
                                    <div className="text-xl font-bold text-emerald-400">{project.monitoringData.ndviIndex}</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-2xl mb-2">💧</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Water Quality</div>
                                    <div className="text-xl font-bold text-blue-400">{project.monitoringData.waterQuality}/10</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-2xl mb-2">🌡️</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                                    <div className="text-xl font-bold text-orange-400">{project.monitoringData.temperature}°C</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center">
                                    <div className="text-2xl mb-2">🌿</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Health Score</div>
                                    <div className="text-xl font-bold text-purple-400">{project.monitoringData.ecosystemHealthScore}/100</div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Last updated: {project.monitoringData.lastUpdated}
                            </div>
                        </div>

                        {/* Verification Checklist */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Verification Checklist</h2>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {checklistProgress} / {totalChecklist} completed
                                </span>
                            </div>

                            <div className="w-full h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                    style={{ width: `${(checklistProgress / totalChecklist) * 100}%` }}
                                />
                            </div>

                            <div className="space-y-4">
                                {["Documentation", "Methodology", "DePIN Data", "Location", "Social"].map((category) => (
                                    <div key={category}>
                                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{category}</h3>
                                        <div className="space-y-2">
                                            {VERIFICATION_CHECKLIST.filter(item => item.category === category).map((item) => (
                                                <label
                                                    key={item.id}
                                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${checklist[item.id]
                                                            ? "bg-emerald-500/10 border border-emerald-500/30"
                                                            : "bg-gray-50 dark:bg-gray-900/50 border border-gray-700/50 hover:border-gray-600"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checklist[item.id] || false}
                                                        onChange={() => handleChecklistToggle(item.id)}
                                                        className="sr-only"
                                                    />
                                                    <span className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${checklist[item.id]
                                                            ? "bg-emerald-500 text-gray-900 dark:text-white"
                                                            : "bg-gray-700 text-gray-500"
                                                        }`}>
                                                        {checklist[item.id] ? "✓" : ""}
                                                    </span>
                                                    <span className={checklist[item.id] ? "text-gray-900 dark:text-white" : "text-gray-300"}>
                                                        {item.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Decision Panel */}
                    <div className="space-y-6">
                        {/* Verified Carbon Tons */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verification Decision</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Verified Carbon Tons
                                </label>
                                <input
                                    type="number"
                                    value={verifiedCarbonTons}
                                    onChange={(e) => setVerifiedCarbonTons(e.target.value)}
                                    placeholder={project.carbonTonsEstimated.toString()}
                                    max={project.carbonTonsEstimated}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Estimated: {project.carbonTonsEstimated.toLocaleString()} tCO2e
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Verification Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes or observations..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>

                            {/* Decision Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setDecision("approve")}
                                    disabled={!allChecked || !verifiedCarbonTons}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${decision === "approve"
                                            ? "bg-emerald-500 text-gray-900 dark:text-white"
                                            : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        }`}
                                >
                                    ✓ Approve & Verify
                                </button>

                                <button
                                    onClick={() => setDecision("reject")}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${decision === "reject"
                                            ? "bg-red-500 text-gray-900 dark:text-white"
                                            : "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                                        }`}
                                >
                                    ✗ Reject Project
                                </button>
                            </div>

                            {decision === "reject" && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Explain why the project is being rejected..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-red-500/30 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
                                    />
                                </div>
                            )}

                            {decision && (
                                <button
                                    onClick={handleSubmitVerification}
                                    disabled={
                                        isSubmitting ||
                                        (decision === "approve" && (!allChecked || !verifiedCarbonTons)) ||
                                        (decision === "reject" && !rejectReason)
                                    }
                                    className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-gray-900 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Verification"}
                                </button>
                            )}
                        </div>

                        {/* Escrow Info */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">💰</span>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Verification Reward</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400 mb-2">{project.escrowBalance} SOL</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This amount will be released to you upon successful verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
