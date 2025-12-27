import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use turbopack (Next.js 16 default)
  turbopack: {
    resolveAlias: {
      // Add any aliases if needed
    },
  },
  // Transpile Solana packages
  transpilePackages: [
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-wallets",
    "@coral-xyz/anchor",
  ],
};

export default nextConfig;
