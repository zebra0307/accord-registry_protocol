import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../constants";

const programId = new PublicKey(PROGRAM_ID);

/**
 * Derive Global Registry PDA
 */
export function getRegistryPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("registry_v3")],
        programId
    );
}

/**
 * Derive Carbon Token Mint PDA
 */
export function getCarbonTokenMintPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("carbon_token_mint_v3")],
        programId
    );
}

/**
 * Derive Double Counting Registry PDA
 */
export function getDoubleCountingRegistryPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("double_counting_registry")],
        programId
    );
}

/**
 * Derive User Account PDA
 */
export function getUserAccountPda(userWallet: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("user"), userWallet.toBuffer()],
        programId
    );
}

/**
 * Derive Project PDA
 */
export function getProjectPda(owner: PublicKey, projectId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("project"), owner.toBuffer(), Buffer.from(projectId)],
        programId
    );
}

/**
 * Derive Verifier Node PDA
 */
export function getVerifierNodePda(verifier: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("verifier"), verifier.toBuffer()],
        programId
    );
}

/**
 * Derive Liquidity Pool PDA
 */
export function getPoolPda(creditMint: PublicKey, quoteMint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("liquidity_pool"), creditMint.toBuffer(), quoteMint.toBuffer()],
        programId
    );
}

/**
 * Derive LP Mint PDA
 */
export function getLpMintPda(poolPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("lp_mint"), poolPda.toBuffer()],
        programId
    );
}

/**
 * Derive Pool Credit Vault PDA
 */
export function getCreditVaultPda(poolPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("credit_vault"), poolPda.toBuffer()],
        programId
    );
}

/**
 * Derive Pool Quote Vault PDA
 */
export function getQuoteVaultPda(poolPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("quote_vault"), poolPda.toBuffer()],
        programId
    );
}

/**
 * Derive Marketplace Listing PDA
 */
export function getListingPda(projectId: string, seller: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("listing"), Buffer.from(projectId), seller.toBuffer()],
        programId
    );
}

/**
 * Derive Listing Vault PDA
 */
export function getListingVaultPda(listingPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("listing_vault"), listingPda.toBuffer()],
        programId
    );
}

/**
 * Derive Retirement Certificate Mint PDA
 */
export function getRetirementCertificatePda(owner: PublicKey, retirementId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("retirement"), owner.toBuffer(), Buffer.from(retirementId)],
        programId
    );
}

/**
 * Derive Mint Authority PDA
 */
export function getMintAuthorityPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("mint_authority_v3")],
        programId
    );
}

/**
 * Derive Platform Stats PDA
 */
export function getPlatformStatsPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("platform_stats")],
        programId
    );
}

/**
 * Derive MultiSig Config PDA
 */
export function getMultiSigConfigPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("multisig")],
        programId
    );
}

/**
 * Derive Admin Proposal PDA
 */
export function getProposalPda(proposalId: number): [PublicKey, number] {
    const proposalIdBuffer = Buffer.alloc(8);
    proposalIdBuffer.writeBigUInt64LE(BigInt(proposalId));

    return PublicKey.findProgramAddressSync(
        [Buffer.from("proposal"), proposalIdBuffer],
        programId
    );
}

/**
 * Derive Audit Log PDA
 */
export function getAuditLogPda(logId: number): [PublicKey, number] {
    const logIdBuffer = Buffer.alloc(8);
    logIdBuffer.writeBigUInt64LE(BigInt(logId));

    return PublicKey.findProgramAddressSync(
        [Buffer.from("audit_log"), logIdBuffer],
        programId
    );
}

/**
 * Derive Monitoring Data PDA
 */
export function getMonitoringDataPda(projectId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("monitoring"), Buffer.from(projectId)],
        programId
    );
}
