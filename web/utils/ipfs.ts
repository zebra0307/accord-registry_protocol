/**
 * IPFS Upload Utility
 * Uses Pinata API for reliable IPFS pinning.
 * Requires NEXT_PUBLIC_PINATA_JWT environment variable.
 */

export const uploadFileToIpfs = async (file: File): Promise<string> => {
    try {
        const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

        if (!jwt) {
            console.warn("Missing NEXT_PUBLIC_PINATA_JWT. Returning mock CID for testing.");
            // Return a dummy CID for testing if no key is provided
            return "QmTestHash1234567890abcdef1234567890abcdef12";
        }

        const formData = new FormData();
        formData.append("file", file);

        const metadata = JSON.stringify({
            name: `accord_project_${Date.now()}_${file.name}`,
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", options);

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`IPFS Upload failed: ${res.statusText}`);
        }

        const data = await res.json();
        return data.IpfsHash;

    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
};
