"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore, isSuperAdminWallet } from "@/stores/useWalletStore";
import Link from "next/link";

// Mock users data
const MOCK_USERS = [
    {
        pubkey: "5abc123xyz...",
        role: "user",
        kycStatus: "verified",
        kycLevel: 2,
        createdAt: "2024-01-15",
        projectCount: 3,
        creditsHeld: 2500,
        isActive: true,
    },
    {
        pubkey: "7def456uvw...",
        role: "validator",
        kycStatus: "verified",
        kycLevel: 2,
        createdAt: "2024-02-20",
        projectCount: 0,
        verificationsCompleted: 15,
        isActive: true,
    },
    {
        pubkey: "9ghi789rst...",
        role: "government",
        kycStatus: "verified",
        kycLevel: 2,
        createdAt: "2024-03-01",
        loaIssued: 8,
        isActive: true,
    },
    {
        pubkey: "2jkl012mno...",
        role: "user",
        kycStatus: "pending",
        kycLevel: 1,
        createdAt: "2024-12-20",
        projectCount: 0,
        creditsHeld: 0,
        isActive: true,
    },
    {
        pubkey: "4pqr345stu...",
        role: "user",
        kycStatus: "none",
        kycLevel: 0,
        createdAt: "2024-12-25",
        projectCount: 0,
        creditsHeld: 0,
        isActive: true,
    },
];

const ROLE_OPTIONS = [
    { id: "user", label: "User (Developer)", description: "Can register projects, trade credits", color: "text-gray-400" },
    { id: "validator", label: "Validator", description: "Can verify projects, earn fees", color: "text-blue-400" },
    { id: "government", label: "Government", description: "Can issue LoA, approve compliance", color: "text-purple-400" },
    { id: "admin", label: "Admin", description: "Can create/vote on proposals", color: "text-orange-400" },
    { id: "superAdmin", label: "Super Admin", description: "Full system access", color: "text-red-400" },
];

const KYC_LEVELS = [
    { level: 0, label: "None", description: "No verification", color: "text-gray-500" },
    { level: 1, label: "Basic", description: "Email + Phone verified", color: "text-yellow-400" },
    { level: 2, label: "Full", description: "ID + Address verified", color: "text-emerald-400" },
];

const PERMISSIONS = [
    { id: "register_project", label: "Register Projects", bit: 1 },
    { id: "verify_project", label: "Verify Projects", bit: 2 },
    { id: "mint_credits", label: "Mint Credits", bit: 4 },
    { id: "issue_loa", label: "Issue LoA", bit: 8 },
    { id: "create_listing", label: "Create Listings", bit: 16 },
    { id: "trade_dex", label: "Trade on DEX", bit: 32 },
    { id: "retire_credits", label: "Retire Credits", bit: 64 },
    { id: "manage_users", label: "Manage Users", bit: 128 },
    { id: "create_proposal", label: "Create Proposals", bit: 256 },
    { id: "emergency_actions", label: "Emergency Actions", bit: 512 },
];

function UserManagementContent() {
    const { connected, publicKey } = useWallet();
    const { role } = useWalletStore();

    const [users, setUsers] = useState(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [kycFilter, setKycFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [newRole, setNewRole] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    // Check authorization by wallet address directly
    const walletAddress = publicKey?.toBase58() || "";
    const isWalletSuperAdmin = isSuperAdminWallet(walletAddress);
    const isAuthorized = connected && isWalletSuperAdmin;

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.pubkey.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter;
        return matchesSearch && matchesRole && matchesKyc;
    });

    const handleAssignRole = () => {
        if (!selectedUser || !newRole) return;

        // In real implementation, this would create a multi-sig proposal
        setUsers(users.map(u =>
            u.pubkey === selectedUser.pubkey
                ? { ...u, role: newRole }
                : u
        ));
        setShowAssignModal(false);
        setSelectedUser(null);
        setNewRole("");
        alert("Role assignment proposal created! Requires multi-sig approval.");
    };

    const togglePermission = (bit: number) => {
        if (selectedPermissions.includes(bit)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== bit));
        } else {
            setSelectedPermissions([...selectedPermissions, bit]);
        }
    };

    // Show access denied if not authorized
    if (!connected || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
                    <p className="text-gray-400 mb-4">
                        You need SuperAdmin privileges to manage users.
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                        Connected: {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Not connected"}
                    </p>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-gray-700 rounded-xl text-white font-medium hover:bg-gray-600"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-400 hover:underline text-sm">
                            ← Back to Admin Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white mt-2">User Management</h1>
                        <p className="text-gray-400 mt-1">Manage user roles, permissions, and KYC status</p>
                    </div>
                </div>

                {/* How It Works Info */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-white mb-3">🔐 How Role Assignment Works</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-purple-400 font-medium mb-2">1. Select User</div>
                            <p className="text-gray-400">Search by wallet address and review their KYC status and activity</p>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-purple-400 font-medium mb-2">2. Create Proposal</div>
                            <p className="text-gray-400">Role changes require a multi-sig proposal that other admins must approve</p>
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-purple-400 font-medium mb-2">3. Execute on Approval</div>
                            <p className="text-gray-400">Once threshold is met (e.g., 2 of 3 admins), the role is assigned on-chain</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm text-gray-400 mb-2">Search Wallet</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter wallet address..."
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="w-40">
                            <label className="block text-sm text-gray-400 mb-2">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="all">All Roles</option>
                                {ROLE_OPTIONS.map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-40">
                            <label className="block text-sm text-gray-400 mb-2">KYC Status</label>
                            <select
                                value={kycFilter}
                                onChange={(e) => setKycFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="all">All Status</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Users ({filteredUsers.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Wallet</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Role</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">KYC</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Activity</th>
                                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Joined</th>
                                    <th className="text-right p-4 text-sm text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {filteredUsers.map((user) => {
                                    const roleInfo = ROLE_OPTIONS.find(r => r.id === user.role);
                                    const kycInfo = KYC_LEVELS.find(k => k.level === user.kycLevel);

                                    return (
                                        <tr key={user.pubkey} className="hover:bg-gray-700/20">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.pubkey.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-white">{user.pubkey}</div>
                                                        <div className={`text-xs ${user.isActive ? "text-emerald-400" : "text-red-400"}`}>
                                                            {user.isActive ? "Active" : "Inactive"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleInfo?.color} bg-gray-700/50`}>
                                                    {roleInfo?.label || user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`w-2 h-2 rounded-full ${user.kycStatus === "verified" ? "bg-emerald-400" :
                                                        user.kycStatus === "pending" ? "bg-yellow-400" : "bg-gray-500"
                                                        }`} />
                                                    <span className={kycInfo?.color}>{kycInfo?.label}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {user.role === "user" && `${user.projectCount || 0} projects, ${user.creditsHeld || 0} credits`}
                                                {user.role === "validator" && `${user.verificationsCompleted || 0} verifications`}
                                                {user.role === "government" && `${user.loaIssued || 0} LoAs issued`}
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">{user.createdAt}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewRole(user.role);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-500/20"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Role Assignment Modal */}
                {showAssignModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white">Manage User</h2>
                                    <button
                                        onClick={() => setShowAssignModal(false)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* User Info */}
                                <div className="mb-6 p-4 bg-gray-900/50 rounded-xl">
                                    <div className="font-mono text-white mb-2">{selectedUser.pubkey}</div>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="text-gray-400">Current Role: <span className="text-white">{selectedUser.role}</span></span>
                                        <span className="text-gray-400">KYC: <span className={KYC_LEVELS.find(k => k.level === selectedUser.kycLevel)?.color}>{KYC_LEVELS.find(k => k.level === selectedUser.kycLevel)?.label}</span></span>
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-white mb-3">Assign New Role</h3>
                                    <div className="space-y-2">
                                        {ROLE_OPTIONS.map((roleOption) => (
                                            <label
                                                key={roleOption.id}
                                                className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${newRole === roleOption.id
                                                    ? "bg-purple-500/10 border border-purple-500/30"
                                                    : "bg-gray-900/50 border border-gray-700/50 hover:border-gray-600"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={roleOption.id}
                                                    checked={newRole === roleOption.id}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${newRole === roleOption.id ? "border-purple-500 bg-purple-500" : "border-gray-600"
                                                    }`}>
                                                    {newRole === roleOption.id && <span className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${roleOption.color}`}>{roleOption.label}</div>
                                                    <div className="text-sm text-gray-400">{roleOption.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Permissions (for advanced users) */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-white mb-3">Granular Permissions (Optional)</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PERMISSIONS.map((perm) => (
                                            <label
                                                key={perm.id}
                                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedPermissions.includes(perm.bit)
                                                    ? "bg-emerald-500/10 border border-emerald-500/30"
                                                    : "bg-gray-900/50 border border-gray-700/50"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(perm.bit)}
                                                    onChange={() => togglePermission(perm.bit)}
                                                    className="sr-only"
                                                />
                                                <span className={`w-4 h-4 rounded flex items-center justify-center mr-3 ${selectedPermissions.includes(perm.bit)
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-gray-700"
                                                    }`}>
                                                    {selectedPermissions.includes(perm.bit) && "✓"}
                                                </span>
                                                <span className="text-sm text-gray-300">{perm.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-xl">⚠️</span>
                                        <div className="text-sm">
                                            <p className="text-yellow-400 font-medium">Multi-Sig Required</p>
                                            <p className="text-gray-400 mt-1">
                                                This action will create a proposal that requires approval from {2} of {3} admins before it takes effect.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => setShowAssignModal(false)}
                                        className="px-6 py-3 border border-gray-700 rounded-xl text-gray-400 font-medium hover:text-white hover:border-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignRole}
                                        disabled={newRole === selectedUser.role}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                                    >
                                        Create Role Assignment Proposal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper for SSR protection
export default function UserManagementPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <UserManagementContent />;
}
