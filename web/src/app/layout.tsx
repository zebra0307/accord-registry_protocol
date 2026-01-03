import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/providers/WalletProvider";
import { ProgramProvider } from "@/providers/ProgramProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ToastProvider } from "@/components/ui/Toast";
import { AutoRegister } from "@/components/AutoRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accord Registry",
  description: "Decentralized carbon credit registry on Solana. Register projects, verify emissions reductions, and trade carbon credits.",
  keywords: ["carbon credits", "carbon registry", "solana", "blockchain", "climate", "sustainability"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <QueryProvider>
          <SolanaWalletProvider>
            <ProgramProvider>
              <AutoRegister />
              <ThemeProvider>
                <Header />
                <main className="pt-16 min-h-screen">
                  {children}
                </main>
                <ConditionalFooter />
                <ToastProvider />
              </ThemeProvider>
            </ProgramProvider>
          </SolanaWalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
