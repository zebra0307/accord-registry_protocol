"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

export default function SwapPage() {
    const { connected } = useWallet();
    const [fromToken, setFromToken] = useState("ACCORD");
    const [toToken, setToToken] = useState("USDC");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [slippage, setSlippage] = useState("0.5");

    // Mock exchange rate
    const exchangeRate = 15; // 1 ACCORD = 15 USDC

    const handleFromAmountChange = (value: string) => {
        setFromAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const calculated = fromToken === "ACCORD"
                ? parseFloat(value) * exchangeRate
                : parseFloat(value) / exchangeRate;
            setToAmount(calculated.toFixed(6));
        } else {
            setToAmount("");
        }
    };

    const handleSwapDirection = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const priceImpact = fromAmount ? Math.min(parseFloat(fromAmount) * 0.001, 5).toFixed(2) : "0.00";

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-lg mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dex" className="text-emerald-400 hover:underline">
                        ← Back to DEX
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Swap</h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>

                {/* Swap Card */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                    {/* From Token */}
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">From</span>
                            <span className="text-sm text-gray-400">Balance: 1,000.00</span>
                        </div>
                        <div className="flex items-center bg-gray-900 rounded-xl p-4">
                            <input
                                type="number"
                                value={fromAmount}
                                onChange={(e) => handleFromAmountChange(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl text-white focus:outline-none"
                            />
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${fromToken === "ACCORD" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                                    }`}>
                                    {fromToken === "ACCORD" ? "A" : "$"}
                                </div>
                                <span className="text-white font-medium">{fromToken}</span>
                                <span className="text-gray-400">▼</span>
                            </button>
                        </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <button
                            onClick={handleSwapDirection}
                            className="w-10 h-10 bg-gray-700 border-4 border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                        >
                            ↕
                        </button>
                    </div>

                    {/* To Token */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">To</span>
                            <span className="text-sm text-gray-400">Balance: 0.00</span>
                        </div>
                        <div className="flex items-center bg-gray-900 rounded-xl p-4">
                            <input
                                type="number"
                                value={toAmount}
                                readOnly
                                placeholder="0.0"
                                className="flex-1 bg-transparent text-2xl text-white focus:outline-none"
                            />
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${toToken === "ACCORD" ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                                    }`}>
                                    {toToken === "ACCORD" ? "A" : "$"}
                                </div>
                                <span className="text-white font-medium">{toToken}</span>
                                <span className="text-gray-400">▼</span>
                            </button>
                        </div>
                    </div>

                    {/* Swap Details */}
                    {fromAmount && parseFloat(fromAmount) > 0 && (
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Rate</span>
                                <span className="text-white">
                                    1 {fromToken} = {fromToken === "ACCORD" ? exchangeRate : (1 / exchangeRate).toFixed(4)} {toToken}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Price Impact</span>
                                <span className={parseFloat(priceImpact) > 1 ? "text-yellow-400" : "text-emerald-400"}>
                                    {priceImpact}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Minimum Received</span>
                                <span className="text-white">
                                    {(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Slippage Tolerance</span>
                                <div className="flex items-center space-x-2">
                                    {["0.1", "0.5", "1.0"].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSlippage(s)}
                                            className={`px-2 py-1 rounded text-xs ${slippage === s
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-gray-700 text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            {s}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Swap Button */}
                    <button
                        disabled={!connected || !fromAmount || parseFloat(fromAmount) <= 0}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        {!connected ? "Connect Wallet" : !fromAmount ? "Enter Amount" : "Swap"}
                    </button>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8 bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Recent Swaps</h3>
                    <div className="space-y-3">
                        {[
                            { from: "100 ACCORD", to: "1,500 USDC", time: "2 min ago" },
                            { from: "50 ACCORD", to: "750 USDC", time: "15 min ago" },
                            { from: "200 USDC", to: "13.2 ACCORD", time: "1 hour ago" },
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                                <div className="text-white">
                                    <span className="text-emerald-400">{tx.from}</span>
                                    <span className="text-gray-400 mx-2">→</span>
                                    <span className="text-blue-400">{tx.to}</span>
                                </div>
                                <span className="text-sm text-gray-500">{tx.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
