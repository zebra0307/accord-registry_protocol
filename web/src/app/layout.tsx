import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/providers/WalletProvider";
import { ProgramProvider } from "@/providers/ProgramProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accord Registry | Carbon Credit Platform",
  description: "Decentralized carbon credit registry on Solana. Register projects, verify emissions reductions, and trade carbon credits.",
  keywords: ["carbon credits", "carbon registry", "solana", "blockchain", "climate", "sustainability"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <QueryProvider>
          <SolanaWalletProvider>
            <ProgramProvider>
              <Header />
              <main className="pt-16">
                {children}
              </main>
            </ProgramProvider>
          </SolanaWalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
