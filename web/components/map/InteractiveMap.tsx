"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as h3 from "h3-js";
import L from "leaflet";

// Fix Leaflet Default Icon Issue in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ProjectLocation {
    id: string;
    h3Index: string;
    sector: string;
    owner: string;
}

// Mock Data for Visualization
const MOCK_PROJECTS: ProjectLocation[] = [
    { id: "PRJ-001", h3Index: "882a1072b9fffff", sector: "Blue Carbon", owner: "Coastal DAO" }, // NYC area example
    { id: "PRJ-002", h3Index: "882a1072b7fffff", sector: "Forestry", owner: "Green fund" },
    { id: "PRJ-003", h3Index: "882a1072b1fffff", sector: "Renewable", owner: "Solar Co" },
];

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 12);
    }, [center, map]);
    return null;
}

import { useProgram } from "@/hooks/useProgram";

export default function InteractiveMap() {
    const { program } = useProgram();
    const [projects, setProjects] = useState<ProjectLocation[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null);

    useEffect(() => {
        if (!program) return;
        const fetchProjects = async () => {
            try {
                const fetched = await program.account.project.all();
                const mapped = fetched.map((p) => {
                    const sectorRaw = Object.keys(p.account.projectSector as any)[0];
                    return {
                        id: p.account.projectId,
                        h3Index: p.account.compliance.doubleCountingPreventionId,
                        sector: sectorRaw.charAt(0).toUpperCase() + sectorRaw.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                        owner: p.account.owner.toBase58()
                    };
                });
                setProjects(mapped);
            } catch (e) {
                console.error("Failed to fetch projects:", e);
            }
        };
        fetchProjects();
    }, [program]);

    // Initial Center (NYC)
    const center: [number, number] = [40.7128, -74.0060];

    const getPolygonFromH3 = (h3Index: string) => {
        try {
            // h3.cellToBoundary returns Array of [lat, lng]
            const boundary = h3.cellToBoundary(h3Index);
            return boundary;
        } catch (e) {
            console.error("Invalid H3 Index:", h3Index);
            return [];
        }
    };

    const getSectorColor = (sector: string) => {
        switch (sector) {
            case "Blue Carbon": return "#2dd4bf"; // Teal
            case "Forestry": return "#22c55e"; // Green
            case "Renewable": return "#eab308"; // Yellow
            default: return "#94a3b8"; // Slate
        }
    };

    return (
        <div className="h-[70vh] min-h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 relative z-0">
            <MapContainer
                center={center}
                zoom={11}
                style={{ height: "100%", width: "100%", background: "#0f172a" }}
                scrollWheelZoom={true}
            >
                {/* Dark Mode Map Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController center={center} />

                {projects.map((proj) => {
                    const positions = getPolygonFromH3(proj.h3Index);
                    if (positions.length === 0) return null;

                    return (
                        <Polygon
                            key={proj.id}
                            positions={positions}
                            pathOptions={{
                                color: getSectorColor(proj.sector),
                                fillColor: getSectorColor(proj.sector),
                                fillOpacity: 0.4,
                                weight: 2
                            }}
                            eventHandlers={{
                                click: () => setSelectedProject(proj)
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2">
                                    <div className="font-bold text-slate-900">{proj.id}</div>
                                    <div className="text-xs text-slate-600">{proj.sector}</div>
                                    <div className="text-xs text-slate-500 mt-1">H3: {proj.h3Index}</div>
                                </div>
                            </Popup>
                        </Polygon>
                    )
                })}

            </MapContainer>

            {/* Overlay Info Panel */}
            <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl w-64 text-white">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    Live Explorer
                </h3>
                <div className="text-sm text-slate-400 mb-4">
                    Visualize registered projects locked by H3 geospatial index.
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-teal-400"></span> Blue Carbon
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Forestry
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Renewable
                    </div>
                </div>
            </div>
        </div>
    );
}
