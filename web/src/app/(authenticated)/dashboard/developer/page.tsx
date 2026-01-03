"use client";

import { useState, useEffect, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "@/providers/ProgramProvider";
import { useWalletStore, isSuperAdminWallet } from "@/stores/useWalletStore";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import { useMyProjects, useMintCredits, useRegisterUser } from "@/hooks";
import { lamportsToSol } from "@/lib/data/onchain";
import { showToast } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Project {
    id: string;
    projectId: string;
    name: string;
    status: "draft" | "pending" | "verified" | "loa_issued" | "rejected";
    sector: string;
    location: string;
    claimedTons: number;
    issuedCredits: number;
    mintedCredits: number;
    availableToMint: number;
    submittedAt: string;
    verifiedAt?: string;
}

interface ActivityItem {
    id: string;
    type: "transfer" | "listing" | "verification" | "mint" | "retirement";
    description: string;
    time: string;
    amount?: number;
}

const STATUS_CONFIG = {
    draft: { label: "Draft", color: "bg-gray-500/10 text-gray-600 dark:text-gray-400", icon: "📝" },
    pending: { label: "Pending Verification", color: "bg-yellow-500/10 text-yellow-400", icon: "⏳" },
    awaitingAudit: { label: "Awaiting Audit", color: "bg-yellow-500/10 text-yellow-400", icon: "⏳" },
    underReview: { label: "Under Review", color: "bg-blue-500/10 text-blue-400", icon: "🔍" },
    verified: { label: "Verified", color: "bg-emerald-500/10 text-emerald-400", icon: "✅" },
    loa_issued: { label: "LoA Issued", color: "bg-purple-500/10 text-purple-400", icon: "📜" },
    rejected: { label: "Rejected", color: "bg-red-500/10 text-red-400", icon: "❌" },
};

const SECTOR_ICONS: Record<string, string> = {
    blueCarbon: "🌊",
    forestry: "🌲",
    renewableEnergy: "⚡",
    wetlands: "🏞️",
    wasteManagement: "♻️",
    agriculture: "🌾",
    industrial: "🏭",
};

const ACTIVITY_ICONS: Record<string, string> = {
    transfer: "↔️",
    listing: "🏪",
    verification: "📋",
    mint: "🪙",
    retirement: "🔥",
};

function DeveloperDashboardContent() {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection(); // Properly initialize hook
    const { program, isLoading: isProgramLoading } = useProgram();
    const { role, isRegistered, setRole, setIsRegistered, setPermissions } = useWalletStore();

    // Fetch user's projects from on-chain using TanStack Query
    const { data: onChainProjects, isLoading: loadingProjects, error: projectsError } = useMyProjects();

    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [registering, setRegistering] = useState(false);
    const [checkingRegistration, setCheckingRegistration] = useState(true);

    // Transform on-chain projects to UI format
    const projects = useMemo<Project[]>(() => {
        if (!onChainProjects) return [];

        return onChainProjects.map((p) => {
            // Map verification status to UI status
            let status: Project["status"] = "draft";
            if (p.verificationStatus === "verified") {
                status = p.compliance.loaIssued ? "loa_issued" : "verified";
            } else if (p.verificationStatus === "pending" || p.verificationStatus === "awaitingAudit") {
                status = "pending";
            } else if (p.verificationStatus === "rejected") {
                status = "rejected";
            }

            return {
                id: p.publicKey.toString(),
                projectId: p.projectId,
                name: p.projectId, // Projects use projectId as name
                status,
                sector: p.projectSector,
                location: `${p.location.regionName}, ${p.location.countryCode}`,
                claimedTons: p.carbonTonsEstimated,
                issuedCredits: p.creditsIssued || 0,
                mintedCredits: p.tokensMinted || 0,
                availableToMint: (p.creditsIssued || 0) - (p.tokensMinted || 0),
                submittedAt: new Date(p.establishmentDate * 1000).toISOString().split("T")[0],
                verifiedAt: p.verificationStatus === "verified" ? new Date().toISOString().split("T")[0] : undefined,
            };
        });
    }, [onChainProjects]);

    // Calculate stats from real data
    const stats = useMemo(() => ({
        totalProjects: projects.length,
        creditsIssued: projects.reduce((sum, p) => sum + p.issuedCredits, 0),
        pendingVerification: projects.filter(p => p.status === "pending").length,
        escrowLocked: onChainProjects?.reduce((sum, p) => sum + lamportsToSol(p.auditEscrowBalance), 0) || 0,
    }), [projects, onChainProjects]);

    // Mint mutation
    const mintCreditsMutation = useMintCredits();
    const registerUserMutation = useRegisterUser();

    // Check registration and handle superadmin
    useEffect(() => {
        const checkRegistration = async () => {
            if (!publicKey || !program) {
                setCheckingRegistration(false);
                return;
            }

            const walletAddress = publicKey.toBase58();

            // Check if superadmin
            if (isSuperAdminWallet(walletAddress)) {
                setRole("superAdmin");
                setIsRegistered(true);
                setPermissions(0xFFFFFFFF);
                setCheckingRegistration(false);
                return;
            }

            // Check on-chain registration
            try {
                const [userPda] = await PublicKey.findProgramAddressSync(
                    [Buffer.from("user"), publicKey.toBuffer()],
                    program.programId
                );

                const userAccount = await (program.account as any).userAccount.fetch(userPda);

                if (userAccount) {
                    setIsRegistered(true);
                    // Map on-chain role enum to string
                    const roleMap: Record<number, "user" | "validator" | "government" | "admin" | "superAdmin"> = {
                        0: "user",
                        1: "validator",
                        2: "government",
                        3: "admin",
                        4: "superAdmin",
                    };
                    const roleValue = Object.keys(userAccount.role)[0];
                    setRole(roleMap[Number(roleValue)] || "user");
                    setPermissions(userAccount.permissions);
                }
            } catch {
                // User not registered
                setIsRegistered(false);
            }

            setCheckingRegistration(false);
        };

        checkRegistration();
    }, [publicKey, program, setRole, setIsRegistered, setPermissions]);

    const handleMint = async (project: Project) => {
        if (project.availableToMint <= 0) {
            showToast.error("No verified credits available to mint");
            return;
        }

        const loadingToast = showToast.loading("Minting credits...");

        try {
            const result = await mintCreditsMutation.mutateAsync({
                projectId: project.projectId,
                amount: project.availableToMint,
            });

            showToast.dismiss(loadingToast as any);
            showToast.success(`Successfully minted ${project.availableToMint} credits!`, result.signature);
        } catch (error: any) {
            showToast.dismiss(loadingToast as any);
            showToast.error("Failed to mint credits", error.message);
        }
    };

    const handleRegister = async () => {
        if (!publicKey) {
            showToast.error("Please connect your wallet first");
            return;
        }

        // Check for balance
        try {
            const balance = await connection.getBalance(publicKey);
            // 0.05 SOL minimum to be safe (rent + fees)
            const MIN_SOL = 0.05 * 1000000000;
            if (balance < MIN_SOL) {
                showToast.error("Insufficient SOL", "You need at least 0.05 SOL to register. Please request Devnet SOL from a faucet.");
                return;
            }
        } catch (err) {
            console.error("Failed to check balance:", err);
            // Continue anyway, but warn
        }

        setRegistering(true);
        const loadingToast = showToast.loading("Registering as developer...");

        try {
            // Register as 'user' role by default
            await registerUserMutation.mutateAsync({ role: { user: {} } });

            setIsRegistered(true);
            setRole("user");

            showToast.dismiss(loadingToast as any);
            showToast.success("Successfully registered! You can now create projects.");
        } catch (error: any) {
            console.error("Registration error:", error);
            showToast.dismiss(loadingToast as any);

            let message = error.message;
            if (message.includes("Simulation failed") || message.includes("0x1")) { // Insufficient funds often 0x1
                message = "Transaction failed. Likely insufficient SOL. Please airdrop some Devnet SOL.";
            }

            showToast.error("Failed to register.", message);
        } finally {
            setRegistering(false);
        }
    };

    if (!connected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-600 dark:text-gray-400">Connect your Solana wallet to access the Developer Dashboard.</p>
                </div>
            </div>
        );
    }

    if (checkingRegistration) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Registration prompt for unregistered users
    if (!isRegistered) {
        return (
            <div className="min-h-screen py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">

                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Accord Registry</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            To register projects and participate in the carbon credit marketplace,
                            you need to create your on-chain user account.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What you'll be able to do:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-gray-300">Register carbon credit projects</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-gray-300">Submit projects for verification</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-gray-300">Trade credits on DEX & Marketplace</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-gray-300">Track your carbon portfolio</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <span className="text-xl">⚠️</span>
                                <div className="text-left">
                                    <p className="text-yellow-400 text-sm font-medium">One Registration Per Wallet</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Each wallet can only register once and have one role in the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={registering || isProgramLoading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                        >
                            {registering ? "Registering..." : isProgramLoading ? "Initializing..." : "Register as Developer"}
                        </button>

                        <p className="text-gray-500 text-sm mt-4">
                            This will create your account on the Solana blockchain. Transaction fees apply (~0.01 SOL).
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your carbon credit projects</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/register"
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90"
                        >
                            + New Project
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">📁</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">My Projects</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">

                            <span className="text-gray-600 dark:text-gray-400 text-sm">Credits Issued</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400">{stats.creditsIssued.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">⏳</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Pending Verification</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.pendingVerification}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-2">

                            <span className="text-gray-600 dark:text-gray-400 text-sm">Escrow Locked</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-400">{stats.escrowLocked} SOL</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Projects List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Projects</h2>
                            <Link href="/my-projects" className="text-emerald-400 text-sm hover:underline">
                                View All →
                            </Link>
                        </div>

                        {projects.map((project) => {
                            const statusConfig = STATUS_CONFIG[project.status];
                            return (
                                <div
                                    key={project.id}
                                    className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl">
                                                {SECTOR_ICONS[project.sector] || "🌍"}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                                                        {statusConfig.icon} {statusConfig.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                    {project.projectId} • {project.location}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Claimed: <span className="text-gray-900 dark:text-white">{project.claimedTons.toLocaleString()} tons</span>
                                                    </span>
                                                    {project.issuedCredits > 0 && (
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Issued: <span className="text-emerald-400">{project.issuedCredits.toLocaleString()}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {project.status === "draft" && (
                                                <button className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                                                    Continue
                                                </button>
                                            )}
                                            {project.status === "verified" && (
                                                <Link
                                                    href="/marketplace"
                                                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm"
                                                >
                                                    List
                                                </Link>
                                            )}
                                            {project.status === "verified" && project.availableToMint > 0 && (
                                                <button
                                                    onClick={() => handleMint(project)}
                                                    className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm hover:bg-blue-500/20"
                                                >
                                                    Mint ({project.availableToMint})
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-gray-300 text-sm">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <Link
                            href="/register"
                            className="block p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center hover:border-emerald-500/50 transition-colors"
                        >
                            <span className="text-4xl block mb-2">+</span>
                            <span className="text-gray-600 dark:text-gray-400">Register New Project</span>
                        </Link>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {activity.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-3">
                                        <span className="text-xl">{ACTIVITY_ICONS[item.type]}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-300 text-sm truncate">{item.description}</p>
                                            <p className="text-gray-500 text-xs">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/wallet" className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:bg-gray-700/50 transition-colors text-center">
                                    <div className="text-2xl mb-1">💰</div>
                                    <div className="text-sm text-gray-300">Wallet</div>
                                </Link>
                                <Link href="/marketplace" className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:bg-gray-700/50 transition-colors text-center">
                                    <div className="text-2xl mb-1">🏪</div>
                                    <div className="text-sm text-gray-300">Marketplace</div>
                                </Link>
                                <Link href="/dex" className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:bg-gray-700/50 transition-colors text-center">
                                    <div className="text-2xl mb-1">💱</div>
                                    <div className="text-sm text-gray-300">DEX</div>
                                </Link>
                                <Link href="/settings" className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:bg-gray-700/50 transition-colors text-center">
                                    <div className="text-2xl mb-1">⚙️</div>
                                    <div className="text-sm text-gray-300">Settings</div>
                                </Link>
                            </div>
                        </div>

                        {/* Role Upgrade CTA */}
                        {role === "user" && (
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                                <div className="text-2xl mb-2">🚀</div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upgrade Your Role</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    Apply to become a Validator or Government official to unlock more features.
                                </p>
                                <Link
                                    href="/settings"
                                    className="block text-center px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium"
                                >
                                    Request Role Upgrade
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

// Wrapper for SSR protection
export default function DeveloperDashboard() {
    const [mounted, setMounted] = useState(false);

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

    return <DeveloperDashboardContent />;
}
