import React from "react";
import Link from "next/link";
import { Book, Grid, Star, Kanban } from "lucide-react";
import { TopNavBar } from "@/components/top-nav-bar";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { OverviewContent } from "@/components/overview-content";
import { RepositoryList } from "@/components/repository-list";

export default async function UserProfile({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const tab = resolvedSearchParams.tab || "overview";

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <ProfileSidebar />

                    {/* Right Content Area */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <div className="flex flex-col gap-8">
                            {/* Tab Navigation */}
                            <div className="border-b border-border-light dark:border-border-dark">
                                <nav className="flex space-x-6 -mb-px overflow-x-auto">
                                    <Link
                                        className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${tab === "overview"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark"
                                            }`}
                                        href="?tab=overview"
                                    >
                                        <Grid className="w-5 h-5" />
                                        Overview
                                    </Link>
                                    <Link
                                        className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${tab === "repositories"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark"
                                            }`}
                                        href="?tab=repositories"
                                    >
                                        <Book className="w-5 h-5" />
                                        Repositories
                                        <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark">
                                            12
                                        </span>
                                    </Link>
                                    <Link
                                        className="flex items-center gap-2 px-1 py-4 border-b-2 border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark text-sm font-medium whitespace-nowrap transition-colors"
                                        href="#"
                                    >
                                        <Kanban className="w-5 h-5" />
                                        Projects
                                    </Link>
                                    <Link
                                        className="flex items-center gap-2 px-1 py-4 border-b-2 border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark hover:border-border-light dark:hover:border-border-dark text-sm font-medium whitespace-nowrap transition-colors"
                                        href="#"
                                    >
                                        <Star className="w-5 h-5" />
                                        Stars
                                    </Link>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            {tab === "overview" ? <OverviewContent /> : null}
                            {tab === "repositories" ? <RepositoryList /> : null}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
