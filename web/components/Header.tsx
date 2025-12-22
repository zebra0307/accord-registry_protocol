"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const WalletMultiButton = dynamic(
    () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/70 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
            }`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 hover:opacity-80 transition-opacity tracking-tight">
                    Accord
                </Link>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                    <Link href="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link>
                    <Link href="/swap" className="hover:text-teal-400 transition-colors">Swap</Link>
                    <Link href="/register" className="hover:text-teal-400 transition-colors">Register</Link>
                    <Link href="/map" className="hover:text-teal-400 transition-colors">Map</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <WalletMultiButton style={{
                        backgroundColor: "rgba(20, 184, 166, 0.2)",
                        border: "1px solid rgba(20, 184, 166, 0.5)",
                        color: "#2dd4bf",
                        borderRadius: "0.75rem",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        height: "40px"
                    }} />
                </div>
            </div>
        </header>
    );
}
