"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore, isSuperAdminWallet } from "@/stores/useWalletStore";
import { useState, useEffect, useRef } from "react";

// Dynamically import WalletMultiButton to prevent hydration issues
const WalletMultiButtonDynamic = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false, loading: () => <div className="h-10 w-36 bg-gray-700 rounded-lg animate-pulse" /> }
);

const publicNavItems = [
    { label: "Explore", href: "/explore" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Map", href: "/map" },
    { label: "Analytics", href: "/analytics" },
];

const authenticatedNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Projects", href: "/my-projects" },
    { label: "DEX", href: "/dex" },
    { label: "Wallet", href: "/wallet" },
];

export function Header() {
    const pathname = usePathname();
    const { connected, publicKey } = useWallet();
    const { role, reset, setRole, setIsRegistered, setPermissions } = useWalletStore();
    const [mounted, setMounted] = useState(false);
    const prevWalletRef = useRef<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset wallet store when wallet changes
    useEffect(() => {
        if (!mounted) return;

        const currentWallet = publicKey?.toBase58() || null;

        // If wallet changed (not just connected/disconnected)
        if (prevWalletRef.current !== null && prevWalletRef.current !== currentWallet) {
            // Reset the store
            reset();

            // If new wallet is superadmin, set it
            if (currentWallet && isSuperAdminWallet(currentWallet)) {
                setRole("superAdmin");
                setIsRegistered(true);
                setPermissions(0xFFFFFFFF);
            }
        }

        // If just connected and is superadmin
        if (currentWallet && isSuperAdminWallet(currentWallet) && role !== "superAdmin") {
            setRole("superAdmin");
            setIsRegistered(true);
            setPermissions(0xFFFFFFFF);
        }

        // If disconnected, reset
        if (!currentWallet && prevWalletRef.current) {
            reset();
        }

        prevWalletRef.current = currentWallet;
    }, [mounted, publicKey, role, reset, setRole, setIsRegistered, setPermissions]);

    // Calculate the display role based on ACTUAL wallet address
    const getDisplayRole = () => {
        if (!connected || !publicKey) return null;

        const walletAddress = publicKey.toBase58();

        // Check if this wallet is actually a superadmin
        if (isSuperAdminWallet(walletAddress)) {
            return "SuperAdmin";
        }

        // Otherwise show the stored role (from on-chain data)
        // But NOT superAdmin (since that's from stale store data)
        if (role && role !== "none" && role !== "superAdmin") {
            return role;
        }

        return null;
    };

    const displayRole = mounted ? getDisplayRole() : null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Accord
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {publicNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {mounted && connected && (
                            <>
                                <div className="w-px h-6 bg-gray-700 mx-2" />
                                {authenticatedNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith(item.href)
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* Wallet, Settings & Role */}
                    <div className="flex items-center space-x-3">
                        {displayRole && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${displayRole === "SuperAdmin"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                {displayRole}
                            </span>
                        )}

                        {/* Settings Icon */}
                        {mounted && connected && (
                            <Link
                                href="/settings"
                                className={`p-2 rounded-lg transition-colors ${pathname === "/settings" || pathname.startsWith("/settings")
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                                    }`}
                                title="Settings"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        )}

                        <WalletMultiButtonDynamic className="!bg-gradient-to-r !from-emerald-500 !to-teal-500 !rounded-lg !h-10 !text-sm !font-medium hover:!opacity-90 !transition-opacity" />
                    </div>
                </div>
            </div>
        </header>
    );
}

