import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import idl from "../anchor/idl/accord_registry.json";
import { BlueCarbonRegistry } from "../anchor/idl/accord_registry";

// Hardcoded for now, ideal to move to .env
const PROGRAM_ID = new PublicKey("9W1Zh89ykeWSbXVTgHHgeUcyUTGSs2XAbMRvY1uR1gU");

export function useProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        const anchorWallet = {
            publicKey: wallet.publicKey || PublicKey.default,
            signTransaction: wallet.signTransaction || (async () => { throw new Error("Not connected"); }),
            signAllTransactions: wallet.signAllTransactions || (async () => { throw new Error("Not connected"); }),
        };

        return new AnchorProvider(connection, anchorWallet as any, { commitment: 'confirmed' });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<BlueCarbonRegistry>(idl as any, provider);
    }, [provider]);

    return { program, programId: PROGRAM_ID, provider };
}
