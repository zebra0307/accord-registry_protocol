/**
 * React Hooks for On-Chain Data
 * 
 * These hooks provide easy access to on-chain data with loading states,
 * error handling, and automatic refetching via TanStack Query.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/providers/ProgramProvider";
import { PublicKey } from "@solana/web3.js";
import {
    fetchAllProjects,
    fetchUserProjects,
    fetchPendingProjects,
    fetchProjectsPendingLoA,
    fetchAllListings,
    fetchUserListings,
    fetchAllUsers,
    fetchUserAccount,
    fetchValidators,
    fetchAllPools,
    fetchGlobalStats,
    fetchPlatformStats,
    OnChainProject,
    OnChainListing,
    OnChainUser,
    OnChainPool,
    GlobalStats,
    PlatformStats,
} from "@/lib/data/onchain";

// ============================================
// QUERY KEYS (for cache management)
// ============================================

export const QUERY_KEYS = {
    projects: "projects",
    userProjects: "user-projects",
    pendingProjects: "pending-projects",
    pendingLoA: "pending-loa",
    listings: "listings",
    userListings: "user-listings",
    users: "users",
    userAccount: "user-account",
    validators: "validators",
    pools: "pools",
    globalStats: "global-stats",
    platformStats: "platform-stats",
};

// ============================================
// PROJECT HOOKS
// ============================================

/**
 * Fetch all projects on the platform
 */
export function useAllProjects() {
    const { program } = useProgram();

    return useQuery<OnChainProject[], Error>({
        queryKey: [QUERY_KEYS.projects],
        queryFn: async () => {
            if (!program) return [];
            return fetchAllProjects(program);
        },
        enabled: !!program,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
    });
}

/**
 * Fetch projects owned by the connected wallet
 */
export function useMyProjects() {
    const { program } = useProgram();
    const { publicKey } = useWallet();

    return useQuery<OnChainProject[], Error>({
        queryKey: [QUERY_KEYS.userProjects, publicKey?.toBase58()],
        queryFn: async () => {
            if (!program || !publicKey) return [];
            return fetchUserProjects(program, publicKey);
        },
        enabled: !!program && !!publicKey,
        staleTime: 30 * 1000,
    });
}

/**
 * Fetch projects pending verification (for validators)
 */
export function usePendingProjects() {
    const { program } = useProgram();

    return useQuery<OnChainProject[], Error>({
        queryKey: [QUERY_KEYS.pendingProjects],
        queryFn: async () => {
            if (!program) return [];
            return fetchPendingProjects(program);
        },
        enabled: !!program,
        staleTime: 30 * 1000,
    });
}

/**
 * Fetch verified projects pending LoA (for government)
 */
export function useProjectsPendingLoA() {
    const { program } = useProgram();

    return useQuery<OnChainProject[], Error>({
        queryKey: [QUERY_KEYS.pendingLoA],
        queryFn: async () => {
            if (!program) return [];
            return fetchProjectsPendingLoA(program);
        },
        enabled: !!program,
        staleTime: 30 * 1000,
    });
}

// ============================================
// MARKETPLACE HOOKS
// ============================================

/**
 * Fetch all active marketplace listings
 */
export function useAllListings() {
    const { program } = useProgram();

    return useQuery<OnChainListing[], Error>({
        queryKey: [QUERY_KEYS.listings],
        queryFn: async () => {
            if (!program) return [];
            return fetchAllListings(program);
        },
        enabled: !!program,
        staleTime: 30 * 1000,
    });
}

/**
 * Fetch listings created by the connected wallet
 */
export function useMyListings() {
    const { program } = useProgram();
    const { publicKey } = useWallet();

    return useQuery<OnChainListing[], Error>({
        queryKey: [QUERY_KEYS.userListings, publicKey?.toBase58()],
        queryFn: async () => {
            if (!program || !publicKey) return [];
            return fetchUserListings(program, publicKey);
        },
        enabled: !!program && !!publicKey,
        staleTime: 30 * 1000,
    });
}

// ============================================
// USER / RBAC HOOKS
// ============================================

/**
 * Fetch all registered users (admin only)
 */
export function useAllUsers() {
    const { program } = useProgram();

    return useQuery<OnChainUser[], Error>({
        queryKey: [QUERY_KEYS.users],
        queryFn: async () => {
            if (!program) return [];
            return fetchAllUsers(program);
        },
        enabled: !!program,
        staleTime: 60 * 1000, // 1 minute
    });
}

/**
 * Fetch the current user's on-chain account
 */
export function useCurrentUserAccount() {
    const { program } = useProgram();
    const { publicKey, connected } = useWallet();

    return useQuery<OnChainUser | null, Error>({
        queryKey: [QUERY_KEYS.userAccount, publicKey?.toBase58()],
        queryFn: async () => {
            if (!program || !publicKey) return null;
            return fetchUserAccount(program, publicKey);
        },
        enabled: !!program && !!publicKey && connected,
        staleTime: 60 * 1000,
    });
}

/**
 * Fetch all validators
 */
export function useValidators() {
    const { program } = useProgram();

    return useQuery<OnChainUser[], Error>({
        queryKey: [QUERY_KEYS.validators],
        queryFn: async () => {
            if (!program) return [];
            return fetchValidators(program);
        },
        enabled: !!program,
        staleTime: 60 * 1000,
    });
}

// ============================================
// DEX HOOKS
// ============================================

/**
 * Fetch all liquidity pools
 */
export function useAllPools() {
    const { program } = useProgram();

    return useQuery<OnChainPool[], Error>({
        queryKey: [QUERY_KEYS.pools],
        queryFn: async () => {
            if (!program) return [];
            return fetchAllPools(program);
        },
        enabled: !!program,
        staleTime: 30 * 1000,
    });
}

// ============================================
// STATS HOOKS
// ============================================

/**
 * Fetch global registry stats
 */
export function useGlobalStats() {
    const { program } = useProgram();

    return useQuery<GlobalStats | null, Error>({
        queryKey: [QUERY_KEYS.globalStats],
        queryFn: async () => {
            if (!program) return null;
            return fetchGlobalStats(program);
        },
        enabled: !!program,
        staleTime: 60 * 1000,
    });
}

/**
 * Fetch aggregated platform stats
 */
export function usePlatformStats() {
    const { program } = useProgram();

    return useQuery<PlatformStats, Error>({
        queryKey: [QUERY_KEYS.platformStats],
        queryFn: async () => {
            if (!program) {
                return {
                    totalProjects: 0,
                    verifiedProjects: 0,
                    totalCreditsIssued: 0,
                    totalCreditsMinted: 0,
                    totalActiveListings: 0,
                    totalVolume: 0,
                    uniqueCountries: 0,
                };
            }
            return fetchPlatformStats(program);
        },
        enabled: !!program,
        staleTime: 60 * 1000,
    });
}

// ============================================
// CACHE INVALIDATION HOOKS
// ============================================

/**
 * Hook to invalidate query caches after mutations
 */
export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return {
        invalidateProjects: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userProjects] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.pendingProjects] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.platformStats] });
        },
        invalidateListings: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.listings] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userListings] });
        },
        invalidateUsers: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userAccount] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.validators] });
        },
        invalidatePools: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.pools] });
        },
        invalidateAll: () => {
            queryClient.invalidateQueries();
        },
    };
}
