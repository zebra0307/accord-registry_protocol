"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "@/providers/ProgramProvider";
import { getProjectPda } from "@/lib/anchor/pdas";
import { PublicKey } from "@solana/web3.js";
import { Project, VerificationStatusType, ProjectSectorType } from "@/types/project";

// Convert on-chain enum to string
function parseVerificationStatus(status: object): VerificationStatusType {
    const key = Object.keys(status)[0];
    return key as VerificationStatusType;
}

function parseProjectSector(sector: object): ProjectSectorType {
    const key = Object.keys(sector)[0];
    return key as ProjectSectorType;
}

export function useProject(owner: PublicKey | null, projectId: string | null) {
    const { program } = useProgram();
    const { connection } = useConnection();

    return useQuery({
        queryKey: ["project", owner?.toString(), projectId],
        queryFn: async (): Promise<Project | null> => {
            if (!program || !owner || !projectId) return null;

            const [projectPda] = getProjectPda(owner, projectId);

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const account = await (program.account as any).project.fetch(projectPda);

                return {
                    projectId: account.projectId,
                    owner: account.owner,
                    ipfsCid: account.ipfsCid,
                    carbonTonsEstimated: account.carbonTonsEstimated.toNumber(),
                    verificationStatus: parseVerificationStatus(account.verificationStatus),
                    creditsIssued: account.creditsIssued.toNumber(),
                    tokensMinted: account.tokensMinted.toNumber(),
                    bump: account.bump,
                    projectSector: parseProjectSector(account.projectSector),
                    location: {
                        latitude: account.location.latitude,
                        longitude: account.location.longitude,
                        polygonCoordinates: account.location.polygonCoordinates,
                        countryCode: account.location.countryCode,
                        regionName: account.location.regionName,
                    },
                    areaHectares: account.areaHectares,
                    establishmentDate: account.establishmentDate.toNumber(),
                    compliance: {
                        cctsRegistryId: account.compliance.cctsRegistryId,
                        loaIssued: account.compliance.loaIssued,
                        doubleCountingPreventionId: account.compliance.doubleCountingPreventionId,
                        auditStatus: account.compliance.auditStatus,
                        authorizedExportLimit: account.compliance.authorizedExportLimit.toNumber(),
                    },
                    verifier: account.verifier,
                    verificationFeeLamports: account.verificationFeeLamports.toNumber(),
                    auditEscrowBalance: account.auditEscrowBalance.toNumber(),
                    verificationData: {
                        satelliteDataHash: account.verificationData.satelliteDataHash,
                        iotDataHash: account.verificationData.iotDataHash,
                        acvaReportCid: account.verificationData.acvaReportCid,
                        lastVerificationDate: account.verificationData.lastVerificationDate.toNumber(),
                    },
                    vintageYear: account.vintageYear,
                    pricePerTon: account.pricePerTon.toNumber(),
                    availableQuantity: account.availableQuantity.toNumber(),
                    qualityRating: account.qualityRating,
                    coBenefits: account.coBenefits.map((b: object) => Object.keys(b)[0]),
                };
            } catch (error) {
                console.error("Failed to fetch project:", error);
                return null;
            }
        },
        enabled: !!program && !!owner && !!projectId,
        staleTime: 30 * 1000, // 30 seconds
    });
}
