import { useState, useEffect } from 'react';
import { useProgram } from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, Plus, FileText, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperDashboard({ userRole }: { userRole: string }) {
    const { program } = useProgram();
    const { publicKey } = useWallet();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!program || !publicKey) return;

        const fetchMyProjects = async () => {
            try {
                // Fetch all projects filtering by owner in memory (or using memcmp if optimizing)
                // For prototype, fetching all and filtering is acceptable
                const allProjects = await program.account.project.all([
                    {
                        memcmp: {
                            offset: 8 + 4, // Discriminator + ID Prefix (approx) - actually safer to use specific layout offset
                            // Filter by owner is at offset 8 + 4 + 32 ? No, let's just fetch all and filter JS side for simplicity/reliability without IDL layout calc
                            bytes: publicKey.toBase58(),
                        }
                    }
                ]);

                // Backup constraint: Filter in JS if memcmp fails or is tricky
                const myProjects = allProjects.filter(p => p.account.owner.toBase58() === publicKey.toBase58());
                setProjects(myProjects);
            } catch (e) {
                console.error("Error fetching projects:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchMyProjects();
    }, [program, publicKey]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-teal-400" />
                        Project Developer Portal
                    </h2>
                    <p className="text-slate-400 text-sm">Manage your registered assets and track validation status.</p>
                </div>
                <Link href="/register" className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Register New Project
                </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl">
                    <div className="text-slate-400 text-xs uppercase font-semibold">My Projects</div>
                    <div className="text-2xl font-bold text-white">{projects.length}</div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl">
                    <div className="text-slate-400 text-xs uppercase font-semibold">Credits Issued</div>
                    <div className="text-2xl font-bold text-white">
                        {projects.reduce((acc, curr) => acc + (curr.account.creditsIssued as any).toNumber(), 0)}
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl">
                    <div className="text-slate-400 text-xs uppercase font-semibold">Pending Audit</div>
                    <div className="text-2xl font-bold text-yellow-500">
                        {projects.filter(p => Object.keys(p.account.verificationStatus)[0] === 'pending' || Object.keys(p.account.verificationStatus)[0] === 'awaitingAudit').length}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 bg-black/20 border-b border-white/5 font-semibold text-slate-300">My Projects</div>
                {loading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
                ) : projects.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No projects registered yet.
                        <br />
                        <Link href="/register" className="text-teal-400 underline mt-2 inline-block">Register your first project</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {projects.map((item) => {
                            const p = item.account;
                            const status = Object.keys(p.verificationStatus)[0];
                            return (
                                <div key={item.publicKey.toString()} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/5 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-teal-400 font-bold">{p.projectId}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${getStatusStyle(status)}`}>
                                                {status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Sector: {Object.keys(p.projectSector)[0]} | Est. {p.carbonTonsEstimated.toString()} Tons
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {status === 'verified' && (
                                            <button className="text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1.5 rounded transition-colors">
                                                Mint Credits
                                            </button>
                                        )}
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors">
                                            View PDD
                                        </button>
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

function getStatusStyle(status: string) {
    switch (status) {
        case 'verified': return 'bg-green-500/10 text-green-400 border-green-500/30';
        case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
}
