import { PublicKey } from "@solana/web3.js";
import { CoBenefitType } from "./project";

export interface MarketplaceListing {
    projectId: string;
    seller: PublicKey;
    vintageYear: number;
    quantityAvailable: number;
    pricePerTon: number;
    qualityRating: number;
    coBenefits: CoBenefitType[];
    certificationStandards: string[];
    currencyMint: PublicKey;
    listingDate: number;
    expiryDate: number;
    isActive: boolean;
}

export interface CreateListingData {
    projectId: string;
    vintageYear: number;
    quantityAvailable: number;
    pricePerTon: number;
    certificationStandards: string[];
    currencyMint: PublicKey;
    expiryDate: number;
}

export interface ListingFilter {
    projectSector?: string;
    minPrice?: number;
    maxPrice?: number;
    vintageYear?: number;
    minQuantity?: number;
    certificationStandard?: string;
    countryCode?: string;
}
