import { PublicKey } from "@solana/web3.js";

export interface GeoLocation {
    latitude: number;
    longitude: number;
    polygonCoordinates: [number, number][];
    countryCode: string;
    regionName: string;
}

export interface ComplianceState {
    cctsRegistryId: string;
    loaIssued: boolean;
    doubleCountingPreventionId: string;
    auditStatus: string;
    authorizedExportLimit: number;
}

export interface VerificationData {
    satelliteDataHash: string;
    iotDataHash: string;
    acvaReportCid: string;
    lastVerificationDate: number;
}

export type ProjectSectorType =
    | "blueCarbon"
    | "forestry"
    | "renewableEnergy"
    | "wasteManagement"
    | "agriculture"
    | "industrial";

export type VerificationStatusType =
    | "pending"
    | "awaitingAudit"
    | "underReview"
    | "verified"
    | "rejected"
    | "monitoring"
    | "expired";

export type CoBenefitType =
    | "biodiversityConservation"
    | "communityLivelihoods"
    | "coastalProtection"
    | "waterQuality"
    | "fisheryEnhancement"
    | "tourismDevelopment"
    | "educationOutreach"
    | "energySecurity"
    | "airQualityImprovement";

export interface Project {
    projectId: string;
    owner: PublicKey;
    ipfsCid: string;
    carbonTonsEstimated: number;
    verificationStatus: VerificationStatusType;
    creditsIssued: number;
    tokensMinted: number;
    bump: number;

    projectSector: ProjectSectorType;
    location: GeoLocation;
    areaHectares: number;
    establishmentDate: number;

    compliance: ComplianceState;
    verifier: PublicKey | null;
    verificationFeeLamports: number;
    auditEscrowBalance: number;

    verificationData: VerificationData;

    vintageYear: number;
    pricePerTon: number;
    availableQuantity: number;

    qualityRating: number;
    coBenefits: CoBenefitType[];
}

export interface ProjectRegistrationData {
    projectId: string;
    ipfsCid: string;
    carbonTonsEstimated: number;
    projectSector: { [key in ProjectSectorType]?: object };
    location: GeoLocation;
    areaHectares: number;
    establishmentDate: number;
    vintageYear: number;
    pricePerTon: number;
    cctsRegistryId: string;
    complianceIdSignature: Buffer;
}
