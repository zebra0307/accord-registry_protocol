"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore, isSuperAdminWallet } from "@/stores/useWalletStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const { connected, publicKey } = useWallet();
    const { role, setRole, setIsRegistered, setPermissions } = useWalletStore();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Small delay to ensure wallet state is loaded
        const timer = setTimeout(() => {
            // Check if connected wallet is superadmin
            if (connected && publicKey) {
                const walletAddress = publicKey.toBase58();
                if (isSuperAdminWallet(walletAddress)) {
                    setRole("superAdmin");
                    setIsRegistered(true);
                    setPermissions(0xFFFFFFFF);
                    router.push("/dashboard/admin");
                    return;
                }
            }

            if (!connected) {
                // If not connected, redirect to developer dashboard (they can still browse)
                router.push("/dashboard/developer");
                return;
            }

            // Redirect based on role
            switch (role) {
                case "superAdmin":
                case "admin":
                    router.push("/dashboard/admin");
                    break;
                case "validator":
                    router.push("/dashboard/validator");
                    break;
                case "government":
                    router.push("/dashboard/government");
                    break;
                case "user":
                default:
                    router.push("/dashboard/developer");
                    break;
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [mounted, connected, publicKey, role, router, setRole, setIsRegistered, setPermissions]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
