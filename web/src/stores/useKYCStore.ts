import { create } from "zustand";
import { persist } from "zustand/middleware";

// KYC Levels
export type KYCLevel = 0 | 1 | 2;
export type KYCStatus = "none" | "pending" | "approved" | "rejected";

// Feature limits based on KYC level
export const KYC_LIMITS = {
    0: {
        canRegisterProjects: false,
        maxProjectCredits: 0,
        canTradeMarketplace: false,
        canTradeDEX: false,
        maxMonthlyVolume: 0,
        canRetireCredits: false,
        canRequestRoleUpgrade: false,
        canCrossBorderTrade: false,
        canAccessAPI: false,
    },
    1: {
        canRegisterProjects: true,
        maxProjectCredits: 1000,
        canTradeMarketplace: true,
        canTradeDEX: false,
        maxMonthlyVolume: 5000,
        canRetireCredits: true,
        canRequestRoleUpgrade: false,
        canCrossBorderTrade: false,
        canAccessAPI: false,
    },
    2: {
        canRegisterProjects: true,
        maxProjectCredits: Infinity,
        canTradeMarketplace: true,
        canTradeDEX: true,
        maxMonthlyVolume: Infinity,
        canRetireCredits: true,
        canRequestRoleUpgrade: true,
        canCrossBorderTrade: true,
        canAccessAPI: true,
    },
};

interface KYCDocument {
    id: string;
    type: string;
    fileName: string;
    hash: string;
    uploadedAt: string;
    status: "pending" | "approved" | "rejected";
    rejectionReason?: string;
}

interface KYCState {
    // KYC data
    level: KYCLevel;
    status: KYCStatus;
    emailVerified: boolean;
    phoneVerified: boolean;
    email: string | null;
    phone: string | null;
    documents: KYCDocument[];
    submittedAt: string | null;
    reviewedAt: string | null;

    // Actions
    setLevel: (level: KYCLevel) => void;
    setStatus: (status: KYCStatus) => void;
    setEmailVerified: (verified: boolean, email?: string) => void;
    setPhoneVerified: (verified: boolean, phone?: string) => void;
    addDocument: (doc: KYCDocument) => void;
    updateDocumentStatus: (docId: string, status: "approved" | "rejected", reason?: string) => void;
    submitKYC: (level: KYCLevel) => void;
    approveKYC: (level: KYCLevel) => void;
    rejectKYC: (reason: string) => void;
    reset: () => void;

    // Computed / checks
    canPerformAction: (action: keyof typeof KYC_LIMITS[0]) => boolean;
    getLimits: () => typeof KYC_LIMITS[0];
}

const initialState = {
    level: 0 as KYCLevel,
    status: "none" as KYCStatus,
    emailVerified: false,
    phoneVerified: false,
    email: null,
    phone: null,
    documents: [],
    submittedAt: null,
    reviewedAt: null,
};

export const useKYCStore = create<KYCState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setLevel: (level) => set({ level }),
            setStatus: (status) => set({ status }),

            setEmailVerified: (verified, email) => set({
                emailVerified: verified,
                email: email || get().email,
            }),

            setPhoneVerified: (verified, phone) => set({
                phoneVerified: verified,
                phone: phone || get().phone,
            }),

            addDocument: (doc) => set({
                documents: [...get().documents, doc]
            }),

            updateDocumentStatus: (docId, status, reason) => set({
                documents: get().documents.map(d =>
                    d.id === docId
                        ? { ...d, status, rejectionReason: reason }
                        : d
                ),
            }),

            submitKYC: (level) => set({
                status: "pending",
                submittedAt: new Date().toISOString(),
            }),

            approveKYC: (level) => set({
                level,
                status: "approved",
                reviewedAt: new Date().toISOString(),
            }),

            rejectKYC: (reason) => set({
                status: "rejected",
                reviewedAt: new Date().toISOString(),
            }),

            reset: () => set(initialState),

            canPerformAction: (action) => {
                const { level, status } = get();
                // If KYC is pending/rejected at a higher level, use current approved level
                const effectiveLevel = status === "approved" ? level : Math.max(0, level - 1) as KYCLevel;
                return KYC_LIMITS[effectiveLevel][action] as boolean;
            },

            getLimits: () => {
                const { level, status } = get();
                const effectiveLevel = status === "approved" ? level : Math.max(0, level - 1) as KYCLevel;
                return KYC_LIMITS[effectiveLevel];
            },
        }),
        {
            name: "kyc-storage",
        }
    )
);

// Helper hook to check if user can perform an action
export function useKYCCheck(action: keyof typeof KYC_LIMITS[0]): boolean {
    const canPerform = useKYCStore((state) => state.canPerformAction);
    return canPerform(action);
}
