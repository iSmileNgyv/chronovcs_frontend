import React from "react";
import Link from "next/link";
import { Book, Star } from "lucide-react";
import { ContributionGraph } from "@/components/contribution-graph";

export function OverviewContent() {
    return (
        <div className="flex flex-col gap-8">
            {/* Pinned Repositories */}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                    Pinned
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-4 bg-component-bg-light dark:bg-component-bg-dark">
                        <div className="flex items-center gap-2">
                            <Book className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                            <Link
                                className="text-primary font-bold text-sm hover:underline"
                                href="#"
                            >
                                QuantumLeap
                            </Link>
                            <span className="text-xs font-medium text-secondary-text-light dark:text-secondary-text-dark border border-border-light dark:border-border-dark rounded-full px-2 py-0.5">
                                Public
                            </span>
                        </div>
                        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                            A next-generation state management library for React.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                <span>JavaScript</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>1.2k</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border border-border-light dark:border-border-dark p-4 bg-component-bg-light dark:bg-component-bg-dark">
                        <div className="flex items-center gap-2">
                            <Book className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                            <Link
                                className="text-primary font-bold text-sm hover:underline"
                                href="#"
                            >
                                Nova-UI
                            </Link>
                            <span className="text-xs font-medium text-secondary-text-light dark:text-secondary-text-dark border border-border-light dark:border-border-dark rounded-full px-2 py-0.5">
                                Public
                            </span>
                        </div>
                        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm">
                            A sleek, modern component library for building beautiful UIs.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span>TypeScript</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>876</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Graph */}
            <ContributionGraph />
        </div>
    );
}
