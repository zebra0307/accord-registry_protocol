"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Accord Logo"
                                width={40}
                                height={40}
                                className="w-10 h-10"
                            />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Accord</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                            Building a transparent future for carbon markets on Solana.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                        <div>
                            <h4 className="font-bold uppercase text-sm tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                                Platform
                            </h4>
                            <nav className="flex flex-col gap-2">
                                <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Explore
                                </Link>
                                <Link href="/marketplace" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Marketplace
                                </Link>
                                <Link href="/analytics" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Analytics
                                </Link>
                                <Link href="/guide" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Guide
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <h4 className="font-bold uppercase text-sm tracking-wider mb-4 text-gray-500 dark:text-gray-400">
                                Contact Us
                            </h4>
                            <div className="flex gap-6">
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Github
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Discord
                                </a>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors">
                                    Twitter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
                    © 2025 Accord Registry. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
