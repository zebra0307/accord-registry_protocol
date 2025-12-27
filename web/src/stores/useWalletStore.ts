import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRoleType = "none" | "user" | "validator" | "government" | "admin" | "superAdmin";

// List of wallets that should automatically be assigned superAdmin role
export const SUPERADMIN_WALLETS = [
    "CC1EDEqc9KtMRnRGn46xH8ikiMjaSDRJJCZJsi9TThpK",
    // Add more superadmin wallets here as needed
];

// Check if a wallet is a superadmin
export function isSuperAdminWallet(walletAddress: string): boolean {
    return SUPERADMIN_WALLETS.includes(walletAddress);
}

interface WalletState {
    // User role from on-chain account
    role: UserRoleType;
    permissions: number;
    isRegistered: boolean;

    // Actions
    setRole: (role: UserRoleType) => void;
    setPermissions: (permissions: number) => void;
    setIsRegistered: (isRegistered: boolean) => void;
    reset: () => void;

    // Permission checks
    hasPermission: (permission: number) => boolean;
}

export const useWalletStore = create<WalletState>()(
    persist(
        (set, get) => ({
            role: "none",
            permissions: 0,
            isRegistered: false,

            setRole: (role) => set({ role }),
            setPermissions: (permissions) => set({ permissions }),
            setIsRegistered: (isRegistered) => set({ isRegistered }),

            reset: () => set({ role: "none", permissions: 0, isRegistered: false }),

            hasPermission: (permission) => {
                const { permissions } = get();
                return (permissions & permission) !== 0;
            },
        }),
        {
            name: "accord-wallet-store",
        }
    )
);
