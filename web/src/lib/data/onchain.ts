/**
 * On-Chain Data Fetching Utilities
 * 
 * This module provides utilities for fetching real data from the Solana program.
 * All functions are designed to work with the Accord Registry on-chain program.
 */

import { PublicKey, Connection } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { PROGRAM_ID, DEFAULT_RPC } from "@/lib/constants";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface OnChainProject {
    publicKey: PublicKey;
    projectId: string;
    owner: PublicKey;
    ipfsCid: string;
    carbonTonsEstimated: number;
    verificationStatus: string;
    creditsIssued: number;
    tokensMinted: number;
    projectSector: string;
    location: {
        latitude: number;
        longitude: number;
        countryCode: string;
        regionName: string;
    };
    areaHectares: number;
    establishmentDate: number;
    compliance: {
        cctsRegistryId: string;
        loaIssued: boolean;
        authorizedExportLimit: number;
    };
    verifier: PublicKey | null;
    verificationFeeLamports: number;
    auditEscrowBalance: number;
    vintageYear: number;
    pricePerTon: number;
    availableQuantity: number;
    qualityRating: number;
    coBenefits: string[];
}

export interface OnChainListing {
    publicKey: PublicKey;
    projectId: string;
    seller: PublicKey;
    vintageYear: number;
    quantityAvailable: number;
    pricePerTon: number;
    qualityRating: number;
    coBenefits: string[];
    currencyMint: PublicKey;
    listingDate: number;
    expiryDate: number;
    isActive: boolean;
}

export interface OnChainUser {
    publicKey: PublicKey;
    authority: PublicKey;
    role: string;
    assignedBy: PublicKey;
    assignedAt: number;
    isActive: boolean;
    permissions: number;
}

export interface OnChainPool {
    publicKey: PublicKey;
    creditMint: PublicKey;
    quoteMint: PublicKey;
    creditReserve: number;
    quoteReserve: number;
    lpSupply: number;
    feeNumerator: number;
    feeDenominator: number;
    isActive: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse an on-chain enum to a string
 */
export function parseOnChainEnum(enumValue: object): string {
    const keys = Object.keys(enumValue);
    return keys[0] || "unknown";
}

/**
 * Convert BN/BigInt to number safely
 */
export function parseNumber(value: any): number {
    if (typeof value === "number") return value;
    if (value?.toNumber) return value.toNumber();
    if (typeof value === "bigint") return Number(value);
    return 0;
}

/**
 * Format a public key for display (abbreviated)
 */
export function formatAddress(pubkey: PublicKey | string): string {
    const str = typeof pubkey === "string" ? pubkey : pubkey.toBase58();
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
    return lamports / 1_000_000_000;
}

// ============================================
// PROJECT DATA FETCHING
// ============================================

/**
 * Fetch all projects from the on-chain program
 */
export async function fetchAllProjects(program: Program<Idl>): Promise<OnChainProject[]> {
    try {
        const accounts = await (program.account as any).project.all();

        return accounts.map((acc: any) => ({
            publicKey: acc.publicKey,
            projectId: acc.account.projectId,
            owner: acc.account.owner,
            ipfsCid: acc.account.ipfsCid,
            carbonTonsEstimated: parseNumber(acc.account.carbonTonsEstimated),
            verificationStatus: parseOnChainEnum(acc.account.verificationStatus),
            creditsIssued: parseNumber(acc.account.creditsIssued),
            tokensMinted: parseNumber(acc.account.tokensMinted),
            projectSector: parseOnChainEnum(acc.account.projectSector),
            location: {
                latitude: acc.account.location?.latitude || 0,
                longitude: acc.account.location?.longitude || 0,
                countryCode: acc.account.location?.countryCode || "",
                regionName: acc.account.location?.regionName || "",
            },
            areaHectares: acc.account.areaHectares || 0,
            establishmentDate: parseNumber(acc.account.establishmentDate),
            compliance: {
                cctsRegistryId: acc.account.compliance?.cctsRegistryId || "",
                loaIssued: acc.account.compliance?.loaIssued || false,
                authorizedExportLimit: parseNumber(acc.account.compliance?.authorizedExportLimit),
            },
            verifier: acc.account.verifier || null,
            verificationFeeLamports: parseNumber(acc.account.verificationFeeLamports),
            auditEscrowBalance: parseNumber(acc.account.auditEscrowBalance),
            vintageYear: acc.account.vintageYear || new Date().getFullYear(),
            pricePerTon: parseNumber(acc.account.pricePerTon),
            availableQuantity: parseNumber(acc.account.availableQuantity),
            qualityRating: acc.account.qualityRating || 0,
            coBenefits: acc.account.coBenefits?.map((b: any) => parseOnChainEnum(b)) || [],
        }));
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

/**
 * Fetch projects owned by a specific wallet
 */
export async function fetchUserProjects(
    program: Program<Idl>,
    owner: PublicKey
): Promise<OnChainProject[]> {
    try {
        const allProjects = await fetchAllProjects(program);
        return allProjects.filter(p => p.owner.equals(owner));
    } catch (error) {
        console.error("Failed to fetch user projects:", error);
        return [];
    }
}

/**
 * Fetch projects awaiting verification (for validators)
 */
export async function fetchPendingProjects(program: Program<Idl>): Promise<OnChainProject[]> {
    try {
        const allProjects = await fetchAllProjects(program);
        return allProjects.filter(
            p => p.verificationStatus === "pending" || p.verificationStatus === "awaitingAudit"
        );
    } catch (error) {
        console.error("Failed to fetch pending projects:", error);
        return [];
    }
}

/**
 * Fetch projects pending LoA (for government)
 */
export async function fetchProjectsPendingLoA(program: Program<Idl>): Promise<OnChainProject[]> {
    try {
        const allProjects = await fetchAllProjects(program);
        return allProjects.filter(
            p => p.verificationStatus === "verified" && !p.compliance.loaIssued
        );
    } catch (error) {
        console.error("Failed to fetch projects pending LoA:", error);
        return [];
    }
}

// ============================================
// MARKETPLACE DATA FETCHING
// ============================================

/**
 * Fetch all active marketplace listings
 */
export async function fetchAllListings(program: Program<Idl>): Promise<OnChainListing[]> {
    try {
        const accounts = await (program.account as any).carbonCreditListing.all();

        return accounts
            .map((acc: any) => ({
                publicKey: acc.publicKey,
                projectId: acc.account.projectId,
                seller: acc.account.seller,
                vintageYear: acc.account.vintageYear || new Date().getFullYear(),
                quantityAvailable: parseNumber(acc.account.quantityAvailable),
                pricePerTon: parseNumber(acc.account.pricePerTon),
                qualityRating: acc.account.qualityRating || 0,
                coBenefits: acc.account.coBenefits?.map((b: any) => parseOnChainEnum(b)) || [],
                currencyMint: acc.account.currencyMint,
                listingDate: parseNumber(acc.account.listingDate),
                expiryDate: parseNumber(acc.account.expiryDate),
                isActive: acc.account.isActive ?? true,
            }))
            .filter((listing: OnChainListing) => listing.isActive && listing.quantityAvailable > 0);
    } catch (error) {
        console.error("Failed to fetch listings:", error);
        return [];
    }
}

/**
 * Fetch listings by a specific seller
 */
export async function fetchUserListings(
    program: Program<Idl>,
    seller: PublicKey
): Promise<OnChainListing[]> {
    try {
        const allListings = await fetchAllListings(program);
        return allListings.filter(l => l.seller.equals(seller));
    } catch (error) {
        console.error("Failed to fetch user listings:", error);
        return [];
    }
}

// ============================================
// USER / RBAC DATA FETCHING
// ============================================

/**
 * Fetch all registered users
 */
export async function fetchAllUsers(program: Program<Idl>): Promise<OnChainUser[]> {
    try {
        const accounts = await (program.account as any).userAccount.all();

        return accounts.map((acc: any) => ({
            publicKey: acc.publicKey,
            authority: acc.account.authority,
            role: parseOnChainEnum(acc.account.role),
            assignedBy: acc.account.assignedBy,
            assignedAt: parseNumber(acc.account.assignedAt),
            isActive: acc.account.isActive ?? true,
            permissions: parseNumber(acc.account.permissions),
        }));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

/**
 * Fetch a single user account
 */
export async function fetchUserAccount(
    program: Program<Idl>,
    userWallet: PublicKey
): Promise<OnChainUser | null> {
    try {
        const [userPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user"), userWallet.toBuffer()],
            new PublicKey(PROGRAM_ID)
        );

        const account = await (program.account as any).userAccount.fetch(userPda);

        return {
            publicKey: userPda,
            authority: account.authority,
            role: parseOnChainEnum(account.role),
            assignedBy: account.assignedBy,
            assignedAt: parseNumber(account.assignedAt),
            isActive: account.isActive ?? true,
            permissions: parseNumber(account.permissions),
        };
    } catch (error) {
        // User not registered - this is expected for new users
        return null;
    }
}

/**
 * Fetch validators (users with validator role)
 */
export async function fetchValidators(program: Program<Idl>): Promise<OnChainUser[]> {
    try {
        const allUsers = await fetchAllUsers(program);
        return allUsers.filter(u => u.role === "validator" && u.isActive);
    } catch (error) {
        console.error("Failed to fetch validators:", error);
        return [];
    }
}

// ============================================
// DEX / POOL DATA FETCHING
// ============================================

/**
 * Fetch all liquidity pools
 */
export async function fetchAllPools(program: Program<Idl>): Promise<OnChainPool[]> {
    try {
        const accounts = await (program.account as any).liquidityPool.all();

        return accounts.map((acc: any) => ({
            publicKey: acc.publicKey,
            creditMint: acc.account.creditMint,
            quoteMint: acc.account.quoteMint,
            creditReserve: parseNumber(acc.account.creditReserve),
            quoteReserve: parseNumber(acc.account.quoteReserve),
            lpSupply: parseNumber(acc.account.lpSupply),
            feeNumerator: parseNumber(acc.account.feeNumerator),
            feeDenominator: parseNumber(acc.account.feeDenominator),
            isActive: acc.account.isActive ?? true,
        }));
    } catch (error) {
        console.error("Failed to fetch pools:", error);
        return [];
    }
}

// ============================================
// REGISTRY (GLOBAL) DATA FETCHING
// ============================================

export interface GlobalStats {
    totalCreditsIssued: number;
    totalProjects: number;
    admin: PublicKey | null;
    governmentAuthority: PublicKey | null;
    carbonTokenMint: PublicKey | null;
}

/**
 * Fetch global registry stats
 */
export async function fetchGlobalStats(program: Program<Idl>): Promise<GlobalStats | null> {
    try {
        const [registryPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("registry_v3")],
            new PublicKey(PROGRAM_ID)
        );

        const registry = await (program.account as any).globalRegistry.fetch(registryPda);

        return {
            totalCreditsIssued: parseNumber(registry.totalCreditsIssued),
            totalProjects: parseNumber(registry.totalProjects),
            admin: registry.admin || null,
            governmentAuthority: registry.governmentAuthority || null,
            carbonTokenMint: registry.carbonTokenMint || null,
        };
    } catch (error) {
        console.error("Failed to fetch global stats:", error);
        return null;
    }
}

// ============================================
// PLATFORM STATS (AGGREGATE)
// ============================================

export interface PlatformStats {
    totalProjects: number;
    verifiedProjects: number;
    totalCreditsIssued: number;
    totalCreditsMinted: number;
    totalActiveListings: number;
    totalVolume: number;
    uniqueCountries: number;
}

/**
 * Calculate aggregate platform statistics
 */
export async function fetchPlatformStats(program: Program<Idl>): Promise<PlatformStats> {
    try {
        const [projects, listings] = await Promise.all([
            fetchAllProjects(program),
            fetchAllListings(program),
        ]);

        const countries = new Set(projects.map(p => p.location.countryCode).filter(Boolean));

        return {
            totalProjects: projects.length,
            verifiedProjects: projects.filter(p => p.verificationStatus === "verified").length,
            totalCreditsIssued: projects.reduce((sum, p) => sum + p.creditsIssued, 0),
            totalCreditsMinted: projects.reduce((sum, p) => sum + p.tokensMinted, 0),
            totalActiveListings: listings.length,
            totalVolume: listings.reduce((sum, l) => sum + (l.quantityAvailable * l.pricePerTon), 0),
            uniqueCountries: countries.size,
        };
    } catch (error) {
        console.error("Failed to fetch platform stats:", error);
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
}
