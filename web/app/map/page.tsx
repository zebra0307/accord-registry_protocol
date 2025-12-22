"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the map component with SSR disabled
// This is critical because Leaflet relies on the 'window' object
const InteractiveMap = dynamic(
    () => import("@/components/map/InteractiveMap"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[70vh] min-h-[500px] w-full rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                    <span className="text-slate-400 font-mono text-sm">Initializing Geospatial Engine...</span>
                </div>
            </div>
        )
    }
);

export default function MapPage() {
    return (
        <div className="container mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-outfit text-white mb-2">Geospatial Explorer</h1>
                <p className="text-slate-400 max-w-2xl">
                    Explore the decentralized registry of carbon projects. Each polygon represents a registered H3 cell (Resolution 8), strictly locked on-chain to prevent double counting.
                </p>
            </div>

            <div className="w-full">
                <InteractiveMap />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12 text-slate-300">
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl">
                    <div className="text-teal-400 text-lg font-bold mb-2">3 Projects</div>
                    <div className="text-sm text-slate-500">Currently visible in viewport</div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl">
                    <div className="text-purple-400 text-lg font-bold mb-2">214 Hectares</div>
                    <div className="text-sm text-slate-500">Total land area registered</div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl">
                    <div className="text-blue-400 text-lg font-bold mb-2">45k tCO2e</div>
                    <div className="text-sm text-slate-500">Estimated carbon potential</div>
                </div>
            </div>
        </div>
    );
}
