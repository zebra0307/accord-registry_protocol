"use client";

import { createContext, useContext, useMemo, ReactNode, useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import { PROGRAM_ID, DEFAULT_RPC } from "@/lib/constants";

// Type for the program
export type AccordProgram = Program<Idl>;

interface ProgramContextType {
    program: AccordProgram | null;
    provider: AnchorProvider | null;
    isLoading: boolean;
    error: string | null;
}

const ProgramContext = createContext<ProgramContextType>({
    program: null,
    provider: null,
    isLoading: true,
    error: null,
});

interface ProgramProviderProps {
    children: ReactNode;
}

export function ProgramProvider({ children }: ProgramProviderProps) {
    const [connection, setConnection] = useState<Connection | null>(null);
    const [idl, setIdl] = useState<Idl | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Get wallet context safely - only after component mounts
    const wallet = useWallet();

    useEffect(() => {
        setMounted(true);
        setConnection(new Connection(DEFAULT_RPC, "confirmed"));
    }, []);

    // Load IDL dynamically on client side
    useEffect(() => {
        if (!mounted) return;

        const loadIdl = async () => {
            try {
                const idlModule = await import("@/anchor/idl/accord_registry.json");
                setIdl(idlModule.default as Idl);
                setError(null);
            } catch (e) {
                console.error("Failed to load IDL:", e);
                setError("Failed to load program IDL");
            } finally {
                setIsLoading(false);
            }
        };

        loadIdl();
    }, [mounted]);

    const provider = useMemo(() => {
        if (!mounted || !connection) return null;
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
            return null;
        }

        try {
            return new AnchorProvider(
                connection,
                {
                    publicKey: wallet.publicKey,
                    signTransaction: wallet.signTransaction,
                    signAllTransactions: wallet.signAllTransactions,
                },
                { commitment: "confirmed" }
            );
        } catch (e) {
            console.error("Failed to create provider:", e);
            return null;
        }
    }, [connection, wallet, mounted]);

    const program = useMemo(() => {
        if (!provider || !idl) return null;

        try {
            // Anchor 0.30+ uses (idl, provider) signature
            return new Program(idl, provider);
        } catch (e) {
            console.error("Failed to create program:", e);
            setError("Failed to initialize program");
            return null;
        }
    }, [provider, idl]);

    return (
        <ProgramContext.Provider value={{ program, provider, isLoading, error }}>
            {children}
        </ProgramContext.Provider>
    );
}

export function useProgram() {
    const context = useContext(ProgramContext);
    if (!context) {
        throw new Error("useProgram must be used within a ProgramProvider");
    }
    return context;
}

// Create a readonly program for fetching data without wallet
export function createReadonlyProgram(idl: Idl): Program<Idl> | null {
    try {
        const connection = new Connection(DEFAULT_RPC, "confirmed");

        // Create a readonly provider (no wallet needed for reading)
        const readonlyProvider = new AnchorProvider(
            connection,
            {
                publicKey: PublicKey.default,
                signTransaction: async () => { throw new Error("Readonly"); },
                signAllTransactions: async () => { throw new Error("Readonly"); },
            },
            { commitment: "confirmed" }
        );

        return new Program(idl, readonlyProvider);
    } catch (e) {
        console.error("Failed to create readonly program:", e);
        return null;
    }
}
