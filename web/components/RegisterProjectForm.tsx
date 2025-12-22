"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/hooks/useProgram";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2, ArrowRight, ShieldCheck, MapPin, Plus, Trash2 } from "lucide-react";
import * as h3 from "h3-js";

import { uploadFileToIpfs } from "@/utils/ipfs";

export default function RegisterProjectForm() {
    const { connected, publicKey } = useWallet();
    const { program } = useProgram();

    // Form State
    const [userAccountExists, setUserAccountExists] = useState(false);
    const [isCheckingUser, setIsCheckingUser] = useState(true);

    // Form State
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Core Data
    const [govId, setGovId] = useState(""); // Acts as Project ID
    const [sector, setSector] = useState("BlueCarbon");

    useEffect(() => {
        const checkUser = async () => {
            if (program && publicKey) {
                try {
                    const [userPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from("user"), publicKey.toBuffer()],
                        program.programId
                    );
                    const acc = await program.account.userAccount.fetchNullable(userPda);
                    if (acc) {
                        const perms = (acc.permissions as any).toNumber();
                        // Check if has REGISTER_PROJECT (bit 0)
                        if ((perms & 1) !== 0) {
                            setUserAccountExists(true);
                        } else {
                            console.warn("User exists but lacks usage permissions.");
                        }
                    } else {
                        setUserAccountExists(false);
                    }
                } catch (e) {
                    console.error("Error checking user account:", e);
                } finally {
                    setIsCheckingUser(false);
                }
            }
        };
        checkUser();
    }, [program, publicKey]);
    // Location Data
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [cellIndex, setCellIndex] = useState("");
    const [polygonPoints, setPolygonPoints] = useState<Array<{ lat: string, lng: string }>>([]);
    const [country, setCountry] = useState("US");
    const [region, setRegion] = useState("");
    const [area, setArea] = useState("");

    // Economics & Metadata
    const [tons, setTons] = useState("");
    const [price, setPrice] = useState("");
    const [vintage, setVintage] = useState(new Date().getFullYear().toString());
    const [establishmentDate, setEstablishmentDate] = useState("");

    // File
    const [pddFile, setPddFile] = useState<File | null>(null);

    // Automation: Sync Project ID with Gov ID
    const projectId = govId;

    // Calculate H3 Index on lat/lng change
    const updateH3 = (latitude: string, longitude: string) => {
        const la = parseFloat(latitude);
        const lo = parseFloat(longitude);
        if (!isNaN(la) && !isNaN(lo)) {
            try {
                // Resolution 8 is standard (~0.7km edge)
                const index = h3.latLngToCell(la, lo, 8);
                setCellIndex(index);
            } catch (e) {
                setCellIndex("Invalid Coordinates");
            }
        }
    };

    const handleAddPoint = () => {
        setPolygonPoints([...polygonPoints, { lat: "", lng: "" }]);
    };

    const handlePointChange = (index: number, field: 'lat' | 'lng', value: string) => {
        const newPoints = [...polygonPoints];
        newPoints[index][field] = value;
        setPolygonPoints(newPoints);
    };

    const handleRemovePoint = (index: number) => {
        const newPoints = polygonPoints.filter((_, i) => i !== index);
        setPolygonPoints(newPoints);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit.");
                return;
            }
            setPddFile(file);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !publicKey) return;

        if (!govId) {
            alert("Government Compliance ID is required.");
            return;
        }

        try {
            setIsLoading(true);
            setStatusMessage("Starting registration...");

            let ipfsCid = "QmPlaceholder";

            // 1. Upload to IPFS
            if (pddFile) {
                setStatusMessage("Uploading PDD to IPFS...");
                try {
                    ipfsCid = await uploadFileToIpfs(pddFile);
                } catch (ipfsError) {
                    console.error("IPFS Upload Failed:", ipfsError);
                    // Continue with placeholder for demo resilience
                }
            }

            setStatusMessage("Preparing transaction...");

            // 2. Prepare Data
            // Convert polygon points to format expected by program (Vec<[f64; 2]>)
            const polyCoords = polygonPoints
                .map(p => [parseFloat(p.lat), parseFloat(p.lng)])
                .filter(p => !isNaN(p[0]) && !isNaN(p[1]));

            // If user provided a single point lat/lng, include it as start if polygon is empty
            if (polyCoords.length === 0 && lat && lng) {
                polyCoords.push([parseFloat(lat), parseFloat(lng)]);
            }

            const estDateUnix = establishmentDate ? Math.floor(new Date(establishmentDate).getTime() / 1000) : Math.floor(Date.now() / 1000);

            const projectData = {
                projectId: projectId, // Same as Gov ID
                ipfsCid: ipfsCid,
                carbonTonsEstimated: new (require("bn.js"))(tons || "0"),
                projectSector: { [sector.charAt(0).toLowerCase() + sector.slice(1)]: {} } as any,
                location: {
                    latitude: parseFloat(lat || "0"),
                    longitude: parseFloat(lng || "0"),
                    polygonCoordinates: polyCoords,
                    countryCode: country,
                    regionName: region || "Unknown",
                },
                areaHectares: parseFloat(area || "0"),
                establishmentDate: new (require("bn.js"))(estDateUnix),
                vintageYear: parseInt(vintage) || 2024,
                pricePerTon: new (require("bn.js"))(parseFloat(price || "0") * 1000000), // microunits
                cctsRegistryId: govId,
                complianceIdSignature: Buffer.alloc(64).fill(1) // Mock Signature
            };

            // PDAs
            const [projectPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("project"), publicKey.toBuffer(), Buffer.from(projectId)],
                program.programId
            );

            const [registryPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("registry_v3")],
                program.programId
            );

            const [userPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("user"), publicKey.toBuffer()],
                program.programId
            );

            const [doubleCountingPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("double_counting_registry")],
                program.programId
            );

            // 3. Fee Transfer Instruction (5 SOL)
            const transferIx = SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: projectPda,
                lamports: 5 * LAMPORTS_PER_SOL,
            });

            setStatusMessage("Sign transaction (5 SOL Fee)...");

            // Execute
            const tx = await program.methods
                .registerProject(projectData)
                .accounts({
                    projectOwner: publicKey,
                    project: projectPda,
                    registry: registryPda,
                    userAccount: userPda,
                    doubleCountingRegistry: doubleCountingPda,
                } as any)
                .preInstructions([transferIx])
                .rpc();

            console.log("Registered Project TX:", tx);
            alert(`Success! Project Registered.\nTX: ${tx}`);

            // Reset crucial fields
            setGovId("");
            setTons("");

        } catch (error) {
            console.error("Registration Failed:", error);
            alert("Registration Failed. Ensure you have 5 SOL + Gas.");
        } finally {
            setIsLoading(false);
            setStatusMessage("");
        }
    };

    if (!connected) {
        return (
            <div className="w-full max-w-2xl mx-auto p-12 text-center bg-slate-900/50 border border-white/10 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
                <p className="text-slate-400">Please connect your Solana wallet to continue.</p>
            </div>
        );
    }

    if (isCheckingUser) {
        return <div className="p-12 text-center text-slate-400"><Loader2 className="animate-spin mb-2 mx-auto" />Checking permissions...</div>;
    }

    if (!userAccountExists) {
        return (
            <div className="w-full max-w-2xl mx-auto p-12 text-center bg-slate-900/50 border border-white/10 rounded-3xl">
                <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-slate-400 mb-6">
                    You must be a registered user to create projects on the Accord Protocol.
                </p>
                <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-colors">
                    Go to Dashboard to Join
                    <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-8 bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="mb-8">
                <h2 className="text-3xl font-bold font-outfit text-white mb-2">Register Project</h2>
                <p className="text-slate-400">
                    Create your on-chain identity. <br />
                    <span className="text-teal-400 text-sm font-semibold">Note: A 5 SOL verification fee is required.</span>
                </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-8">

                {/* 1. Identity & Sector */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-purple-400" />
                        Identity & Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gov Compliance ID (Project ID)</label>
                            <input
                                placeholder="e.g. CCTS-REG-2024-001"
                                value={govId}
                                onChange={(e) => setGovId(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sector</label>
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none appearance-none"
                            >
                                <option value="BlueCarbon">Blue Carbon (Mangrove/Seagrass)</option>
                                <option value="Forestry">Forestry / ARR</option>
                                <option value="RenewableEnergy">Renewable Energy</option>
                                <option value="WasteManagement">Waste Management</option>
                                <option value="Agriculture">Agriculture</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Geospatial Data */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-teal-400" />
                        Geospatial Lock
                    </h3>

                    {/* Primary Location (H3 Anchor) */}
                    <div className="p-4 bg-white/5 rounded-2xl space-y-4">
                        <div className="text-sm text-slate-300 font-medium">Anchor Point (H3 Cell Center)</div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Latitude"
                                value={lat}
                                onChange={(e) => { setLat(e.target.value); updateH3(e.target.value, lng); }}
                                className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-white/90 text-sm focus:border-teal-500 outline-none"
                            />
                            <input
                                placeholder="Longitude"
                                value={lng}
                                onChange={(e) => { setLng(e.target.value); updateH3(lat, e.target.value); }}
                                className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-white/90 text-sm focus:border-teal-500 outline-none"
                            />
                        </div>
                        {cellIndex && (
                            <div className="text-xs text-teal-400 font-mono bg-teal-500/10 py-1 px-3 rounded inline-block border border-teal-500/20">
                                Locked Cell: {cellIndex} (Res 8)
                            </div>
                        )}
                    </div>

                    {/* Polygon Drawing */}
                    <div className="p-4 bg-white/5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-slate-300 font-medium">Field Boundary (Polygon)</div>
                            <button type="button" onClick={handleAddPoint} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                <Plus className="w-3 h-3" /> Add Point
                            </button>
                        </div>
                        {polygonPoints.map((pt, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <span className="text-xs text-slate-500 w-4">{idx + 1}.</span>
                                <input
                                    placeholder="Lat"
                                    value={pt.lat}
                                    onChange={(e) => handlePointChange(idx, 'lat', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-white/20 outline-none"
                                />
                                <input
                                    placeholder="Lng"
                                    value={pt.lng}
                                    onChange={(e) => handlePointChange(idx, 'lng', e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:border-white/20 outline-none"
                                />
                                <button type="button" onClick={() => handleRemovePoint(idx)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {polygonPoints.length === 0 && (
                            <div className="text-xs text-slate-500 italic">No polygon points added. Using anchor point only.</div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Country Code (e.g. US)"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white/90 text-sm focus:border-blue-500 outline-none"
                        />
                        <input
                            placeholder="Region / State"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white/90 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* 3. Economics & Documents */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Project Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Est. Carbon (Tons)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={tons}
                                onChange={(e) => setTons(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Price per Ton (USDC)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Establishment Date</label>
                            <input
                                type="date"
                                value={establishmentDate}
                                onChange={(e) => setEstablishmentDate(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Vintage Year</label>
                            <input
                                type="number"
                                placeholder="2024"
                                value={vintage}
                                onChange={(e) => setVintage(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Total Area (Hectares)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                            />
                        </div>
                        <div className="space-y-1 relative">
                            <label className="text-xs text-slate-400">Project Design Doc (PDD)</label>
                            <input
                                type="file"
                                id="pdd-upload-2"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label htmlFor="pdd-upload-2" className="flex items-center justify-center w-full h-[46px] bg-slate-950 border border-white/10 border-dashed rounded-xl cursor-pointer hover:border-teal-500/50 hover:bg-slate-900 transition-colors mt-1">
                                <span className="text-xs text-slate-400 truncate px-2">{pddFile ? pddFile.name : "Upload File (Max 10MB)"}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    disabled={!connected || isLoading}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${connected ? "bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-lg hover:shadow-teal-500/20 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" />
                            <span>{statusMessage || "Processing..."}</span>
                        </div>
                    ) : (
                        <>
                            Pay 5 SOL & Register Project
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
