"use client";

import { useMemo, useState, useEffect } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { DEFAULT_RPC } from "@/lib/constants";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
    children: React.ReactNode;
}

export function SolanaWalletProvider({ children }: WalletProviderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't initialize wallets on server side
    // Phantom is now a Standard Wallet and auto-detected
    const wallets = useMemo(() => [], []);

    // Prevent hydration issues by not rendering until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-900">
                {children}
            </div>
        );
    }

    return (
        <ConnectionProvider endpoint={DEFAULT_RPC}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
