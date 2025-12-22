"use client";

import { useEffect, useState } from "react";
import { useProgram } from "@/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Shield, Users, FileStack, LayoutDashboard, Loader2, UserPlus, Briefcase } from "lucide-react";

import DeveloperDashboard from "@/components/dashboard/DeveloperDashboard";
import ValidatorDashboard from "@/components/dashboard/ValidatorDashboard";
import GovernmentDashboard from "@/components/dashboard/GovernmentDashboard";

export default function DashboardPage() {
    const { program } = useProgram();
    const { publicKey } = useWallet();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string>('none');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalValidators: 0,
        totalProjects: 0
    });

    useEffect(() => {
        if (!program) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const userAccounts = await program.account.userAccount.all();

                const parsedUsers = userAccounts.map(u => ({
                    pubkey: u.publicKey.toBase58(),
                    role: Object.keys(u.account.role as any)[0],
                    isActive: u.account.isActive,
                    assignedAt: new Date(u.account.assignedAt.toNumber() * 1000).toLocaleDateString()
                }));

                setUsers(parsedUsers);

                // Determine Current Role
                if (publicKey) {
                    const me = parsedUsers.find(u => u.pubkey === publicKey.toBase58());
                    setCurrentUserRole(me ? me.role : 'none');
                }

                // Stats
                const globalRegistryPda = PublicKey.findProgramAddressSync([Buffer.from("registry_v3")], program.programId)[0];
                const globalRegistry = await program.account.globalRegistry.fetchNullable(globalRegistryPda);

                setStats({
                    totalUsers: parsedUsers.length,
                    totalValidators: parsedUsers.filter(u => u.role === 'validator').length,
                    totalProjects: globalRegistry ? (globalRegistry.totalProjects as any).toNumber() : 0
                });

            } catch (e) {
                console.error("Error fetching dashboard data:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [program, publicKey]);

    const handleJoinRegistry = async (roleType: 'user' | 'validator' = 'user') => {
        if (!program || !publicKey) return;
        try {
            setLoading(true);
            const [userPda] = PublicKey.findProgramAddressSync([Buffer.from("user"), publicKey.toBuffer()], program.programId);
            const [registryPda] = PublicKey.findProgramAddressSync([Buffer.from("registry_v3")], program.programId);

            const roleEnum = roleType === 'validator' ? { validator: {} } : { user: {} };

            await program.methods
                .registerUser(roleEnum as any)
                .accounts({
                    userAccount: userPda,
                    registry: registryPda,
                    user: publicKey,
                } as any)
                .rpc();

            alert(`Joined as ${roleType.toUpperCase()}! Reloading...`);
            window.location.reload();
        } catch (e) {
            console.error("Join Failed:", e);
            alert("Join Failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const renderRoleView = () => {
        if (!publicKey) return <div className="text-center text-slate-500 py-10">Connect Wallet to view your portal.</div>;

        switch (currentUserRole) {
            case 'user':
                return <DeveloperDashboard userRole={currentUserRole} />;
            case 'validator':
                return <ValidatorDashboard />;
            case 'government':
                return <GovernmentDashboard />;
            case 'admin':
                return (
                    <div className="space-y-8">
                        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-200 text-sm">
                            <span className="font-bold">Admin Mode:</span> You have full system access.
                        </div>
                        <GovernmentDashboard />
                        <ValidatorDashboard />
                        <DeveloperDashboard userRole="admin" />
                    </div>
                );
            case 'none':
                return (
                    <div className="text-center py-16 bg-gradient-to-br from-slate-900 to-black rounded-2xl border border-white/10">
                        <Briefcase className="w-16 h-16 text-teal-500 mx-auto mb-4 opacity-80" />
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Accord Registry</h2>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            Join the ecosystem to start registering projects, trading credits, or validating assets.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleJoinRegistry('user')}
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-teal-500/20 flex items-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" /> Join as Developer/User
                            </button>
                            <button
                                onClick={() => handleJoinRegistry('validator')}
                                className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                            >
                                <Shield className="w-5 h-5" /> Join as Validator
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-4 italic">Note: In this prototype, you can self-assign roles.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-6 py-10">
            {/* Common Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-slate-200">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-teal-400" />
                    <h1 className="text-3xl font-bold font-outfit">Platform Dashboard</h1>
                </div>
                {publicKey && currentUserRole !== 'none' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${currentUserRole === 'user' ? 'bg-teal-400' : currentUserRole === 'validator' ? 'bg-purple-400' : 'bg-amber-400'}`}></div>
                        <span className="text-sm font-medium capitalize text-slate-300">Role: <span className="text-white">{currentUserRole}</span></span>
                    </div>
                )}
            </div>

            {/* Global Stats (Common View) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-6 h-6 text-blue-400" />} />
                <StatsCard title="Validators" value={stats.totalValidators} icon={<Shield className="w-6 h-6 text-purple-400" />} />
                <StatsCard title="Total Projects" value={stats.totalProjects} icon={<FileStack className="w-6 h-6 text-teal-400" />} />
            </div>

            {/* Role Specific View */}
            <div className="mb-16">
                {renderRoleView()}
            </div>

            {/* Public Registry (Common View) */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-semibold text-white">Public User Registry</h2>
                    <div className="text-sm text-slate-400">Total: {users.length}</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-black/20 uppercase text-slate-400 font-medium text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Wallet Address</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex justify-center"><Loader2 className="animate-spin text-teal-500 w-8 h-8" /></div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No users found in registry.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.pubkey} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-teal-500/80 group-hover:text-teal-400">{user.pubkey}</td>
                                        <td className="px-6 py-4">
                                            <Badge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className={user.isActive ? 'text-green-400' : 'text-slate-500'}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{user.assignedAt}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string, value: number, icon: any }) {
    return (
        <div className="p-6 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center gap-5 hover:border-teal-500/30 transition-all hover:bg-slate-900/80">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5">{icon}</div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{title}</div>
                <div className="text-3xl font-bold text-white font-outfit tracking-tight">{value}</div>
            </div>
        </div>
    )
}

function Badge({ role }: { role: string }) {
    const styles: any = {
        admin: "bg-red-500/20 text-red-300 border-red-500/30",
        validator: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        government: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        user: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        none: "bg-slate-500/20 text-slate-300 border-slate-500/30"
    };
    const style = styles[role.toLowerCase()] || styles.none;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style} capitalize`}>
            {role}
        </span>
    );
}

