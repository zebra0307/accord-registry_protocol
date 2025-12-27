"use client";

import Link from "next/link";

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90"
                >
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-gray-900 dark:text-white font-semibold hover:opacity-90"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4",
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div
                className={`${sizeClasses[size]} border-emerald-500 border-t-transparent rounded-full animate-spin`}
            />
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-2/3" />
        </div>
    );
}

export function StatsCard({
    label,
    value,
    icon,
    loading = false
}: {
    label: string;
    value: string | number;
    icon: string;
    loading?: boolean;
}) {
    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{label}</span>
            </div>
            {loading ? (
                <div className="h-8 bg-gray-700 rounded w-16 animate-pulse" />
            ) : (
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
            )}
        </div>
    );
}
