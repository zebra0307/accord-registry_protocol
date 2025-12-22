import { useState, useEffect } from 'react';
import { useProgram } from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Search } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

export default function ValidatorDashboard() {
    const { program } = useProgram();
    const { publicKey } = useWallet();
    const [pendingProjects, setPendingProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!program) return;
        fetchPendingProjects();
    }, [program]);

    const fetchPendingProjects = async () => {
        if (!program) return;
        try {
            setLoading(true);
            const allProjects = await program.account.project.all();
            // Filter where status is Pending or AwaitingAudit
            const pending = allProjects.filter(p => {
                const s = Object.keys(p.account.verificationStatus)[0];
                return s === 'pending' || s === 'awaitingAudit';
            });
            setPendingProjects(pending);
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (projectPda: PublicKey, projectId: string) => {
        if (!program || !publicKey) return;
        try {
            setActionLoading(projectId);
            // Verify Project Instruction
            // Assuming simplified verify logic for now using 'verify_project' which takes 'verified_carbon_tons'
            // In real ACVA flow, they submit a report CID. For prototype, we confirm the estimated amount.

            // We need to fetch the project account to get exact tons if needed, but we have it in list
            const project = pendingProjects.find(p => p.publicKey.equals(projectPda));
            const tons = project?.account.carbonTonsEstimated;

            const [registryPda] = PublicKey.findProgramAddressSync([Buffer.from("registry_v3")], program.programId);
            const [userPda] = PublicKey.findProgramAddressSync([Buffer.from("user"), publicKey.toBuffer()], program.programId);

            await program.methods
                .verifyProject(tons)
                .accounts({
                    project: projectPda,
                    registry: registryPda,
                    admin: publicKey,
                    adminAccount: userPda
                } as any)
                .rpc();

            alert(`Project ${projectId} Verified!`);
            fetchPendingProjects();
        } catch (e) {
            console.error("Verification Failed:", e);
            alert("Verification Failed. Check console.");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="text-purple-400" />
                        ACVA Validator Console
                    </h2>
                    <p className="text-slate-400 text-sm">Review, audit, and validate incoming project registrations.</p>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                <div className="p-4 bg-purple-500/10 border-b border-purple-500/20 font-semibold text-purple-200 flex justify-between">
                    <span>Pending Validations</span>
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingProjects.length}</span>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-purple-400" /></div>
                ) : pendingProjects.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 italic">No projects pending validation at this time.</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {pendingProjects.map((item) => {
                            const p = item.account;
                            return (
                                <div key={item.publicKey.toString()} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-white font-mono">{p.projectId}</h3>
                                                <div className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-white/10">
                                                    {Object.keys(p.projectSector)[0]}
                                                </div>
                                            </div>
                                            <div className="text-sm text-slate-400 mt-1">
                                                Owner: <span className="font-mono text-slate-500">{p.owner.toBase58().substring(0, 6)}...</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white flex items-baseline gap-1 justify-end">
                                                {p.carbonTonsEstimated.toString()} <span className="text-sm text-slate-500 font-normal">Tons</span>
                                            </div>
                                            <div className="text-xs text-slate-500">Est. Value (USDC)</div>
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="bg-black/20 p-4 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div className="text-sm text-slate-400 flex flex-col gap-1">
                                            <div><span className="text-slate-500">Geo Hash (H3):</span> {p.compliance.doubleCountingPreventionId || "N/A"}</div>
                                            <div><span className="text-slate-500">PDD Hash:</span> {p.ipfsCid}</div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 transition-colors"
                                                title="Reject Project"
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleVerify(item.publicKey, p.projectId)}
                                                disabled={!!actionLoading}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50"
                                            >
                                                {actionLoading === p.projectId ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                Validate & Forward
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
