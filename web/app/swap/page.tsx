"use client";

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Settings, Info, ChevronDown, RotateCw } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
    () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

interface Token {
    symbol: string;
    name: string;
    balance: number;
}

export default function SwapPage() {
    const { connected } = useWallet();
    const [isBuy, setIsBuy] = useState(true); // Swap Mode (Buy/Sell)
    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");

    // Mock Tokens
    const [tokenIn, setTokenIn] = useState<Token>({ symbol: "SOL", name: "Solana", balance: 14.5 });
    const [tokenOut, setTokenOut] = useState<Token>({ symbol: "USDC", name: "USD Coin", balance: 250.0 });

    const exchangeRate = 145.20; // 1 SOL = 145.20 USDC

    const handleAmountInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;
        setAmountIn(val);
        if (val) {
            setAmountOut((Number(val) * exchangeRate).toFixed(4));
        } else {
            setAmountOut("");
        }
    };

    const handleSwapDirection = () => {
        setTokenIn(tokenOut);
        setTokenOut(tokenIn);
        setAmountIn(amountOut);
        setAmountOut(amountIn);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#151515] text-[#f5f5f5] flex flex-col font-sans selection:bg-white/20">

            {/* Background Noise Texture (Simulated via CSS) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Header */}
            <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-[#3a3a3a] flex items-center justify-center bg-white/5">
                        <div className="w-4 h-4 bg-white rounded-sm rotate-45 opacity-80"></div>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-[#f5f5f5]">MonoSwap</span>
                </div>

                {/* Wallet Button Container - Style Override */}
                <div className="wallet-adapter-button-trigger">
                    <WalletMultiButton style={{
                        backgroundColor: "transparent",
                        border: "1px solid #3a3a3a",
                        color: "#f5f5f5",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        fontWeight: "500",
                        height: "40px",
                        padding: "0 20px",
                        borderRadius: "9999px",
                        transition: "all 0.2s"
                    }} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full mb-12">

                {/* Swap Card */}
                <div className="w-full max-w-[480px] bg-[#1b1b1b] border border-[#2a2a2a] rounded-[24px] shadow-2xl shadow-black/50 p-4 relative backdrop-blur-sm">

                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="text-xl font-medium tracking-wide">Swap</h2>
                        <div className="flex items-center gap-2 bg-[#252525] p-1 rounded-full border border-[#2a2a2a]">
                            <button className="px-4 py-1.5 rounded-full bg-[#353535] text-white text-xs font-bold shadow-sm transition-all">Swap</button>
                            <button className="px-4 py-1.5 rounded-full text-[#9b9b9b] text-xs font-medium hover:text-white transition-colors">Limit</button>
                        </div>
                        <button className="p-2 text-[#9b9b9b] hover:text-white transition-colors hover:bg-white/5 rounded-full duration-200">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Input Section (From) */}
                    <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 mb-2 hover:border-[#3a3a3a] transition-colors group">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs uppercase tracking-wider text-[#9b9b9b] font-medium">From</span>
                            <span className="text-xs text-[#9b9b9b]">Balance: {tokenIn.balance}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <button className="flex items-center gap-2 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] rounded-full pl-2 pr-4 py-1.5 transition-all group-focus-within:border-[#4a4a4a]">
                                <div className="w-6 h-6 rounded-full border border-[#555] bg-[#333]"></div>
                                <span className="font-semibold text-lg">{tokenIn.symbol}</span>
                                <ChevronDown className="w-4 h-4 text-[#777]" />
                            </button>

                            <input
                                type="text"
                                placeholder="0.0"
                                value={amountIn}
                                onChange={handleAmountInChange}
                                className="bg-transparent text-right text-3xl font-medium text-white placeholder-[#444] outline-none w-full ml-4"
                            />
                        </div>
                    </div>

                    {/* Swap Divider Button */}
                    <div className="relative h-2 z-10 flex justify-center items-center">
                        <button
                            onClick={handleSwapDirection}
                            className="absolute -top-5 w-10 h-10 bg-[#1b1b1b] border-[3px] border-[#1b1b1b] hover:border-[#2a2a2a] outline outline-1 outline-[#2a2a2a] rounded-xl flex items-center justify-center text-[#f5f5f5] hover:scale-110 transition-all duration-200 shadow-lg"
                        >
                            <ArrowDownLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Input Section (To) */}
                    <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 mt-2 mb-4 hover:border-[#3a3a3a] transition-colors">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs uppercase tracking-wider text-[#9b9b9b] font-medium">To</span>
                            <span className="text-xs text-[#9b9b9b]">Balance: {tokenOut.balance}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <button className="flex items-center gap-2 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] rounded-full pl-2 pr-4 py-1.5 transition-all">
                                <div className="w-6 h-6 rounded-full border border-[#555] bg-[#333]"></div>
                                <span className="font-semibold text-lg">{tokenOut.symbol}</span>
                                <ChevronDown className="w-4 h-4 text-[#777]" />
                            </button>

                            <input
                                type="text"
                                placeholder="0.0"
                                value={amountOut}
                                disabled
                                className="bg-transparent text-right text-3xl font-medium text-white placeholder-[#444] outline-none w-full ml-4 opacity-90"
                            />
                        </div>
                    </div>

                    {/* Price Info */}
                    <div className="px-4 py-2 space-y-2 mb-6">
                        <div className="flex justify-between items-center text-sm text-[#9b9b9b]">
                            <div className="flex items-center gap-1 cursor-help hover:text-white transition-colors">
                                <span>Price</span>
                                <RotateCw className="w-3 h-3" />
                            </div>
                            <span className="font-mono text-xs">1 {tokenIn.symbol} ≈ {exchangeRate} {tokenOut.symbol}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-[#9b9b9b]">
                            <div className="flex items-center gap-1 cursor-help hover:text-white transition-colors">
                                <span>Slippage</span>
                                <Info className="w-3 h-3" />
                            </div>
                            <span>0.5%</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    {connected ? (
                        <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-200 ${amountIn ?
                                "bg-[#e5e5e5] hover:bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] scale-[1.01]" :
                                "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
                            }`}>
                            {amountIn ? "Swap" : "Enter an Amount"}
                        </button>
                    ) : (
                        <div className="w-full">
                            <WalletMultiButton style={{
                                width: "100%",
                                backgroundColor: "#2a2a2a",
                                color: "#9b9b9b",
                                justifyContent: "center",
                                borderRadius: "12px",
                                height: "52px",
                                fontFamily: "inherit",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }} />
                        </div>
                    )}

                    {/* Footer Stats (Optional) */}
                    <div className="mt-6 pt-4 border-t border-[#2a2a2a] grid grid-cols-2 gap-4 text-xs">
                        <div className="flex flex-col gap-1">
                            <span className="text-[#666]">Min. Received</span>
                            <span className="text-[#ccc] font-mono">{(Number(amountOut) * 0.995).toFixed(4)} {tokenOut.symbol}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-[#666]">Network Fee</span>
                            <span className="text-[#ccc] font-mono">~$0.00005</span>
                        </div>
                    </div>

                </div>

                <div className="mt-8 text-[#444] text-xs font-mono tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#333] animate-pulse"></div>
                    Powered by Accord On-Chain Liquidity
                </div>

            </main>
        </div>
    );
}
