import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import Header from "@/components/Header";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Accord Registry",
  description: "Next-gen Real World Asset (RWA) Protocol on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} font-sans bg-slate-950 text-slate-200 antialiased selection:bg-teal-500/30`}>
        <AppWalletProvider>
          <Header />
          <main className="min-h-screen pt-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            {children}
          </main>
        </AppWalletProvider>
      </body>
    </html>
  );
}
