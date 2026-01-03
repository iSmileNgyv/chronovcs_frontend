"use client";

import React from "react";
import Link from "next/link";
import {
    Code,
    Eye,
    GitBranch,
    Bug,
    GitPullRequest,
    PlayCircle,
    LayoutGrid,
    Shield,
    History,
    ChevronDown,
    Plus,
    FileCode,
    Star,
    Download,
    Terminal,
    Settings,
} from "lucide-react";
import { RepoCliTokenModal } from "@/components/repo-cli-token-modal";

interface RepoHeaderProps {
    username: string;
    repoName: string;
    showSourceControls?: boolean;
}

import { usePathname } from "next/navigation";

// ... existing imports ...

export function RepoHeader({ username, repoName, showSourceControls = true }: RepoHeaderProps) {
    const [isCliModalOpen, setIsCliModalOpen] = React.useState(false);
    const pathname = usePathname();

    const isSettingsActive = pathname?.includes("/settings");
    // Simple check: if not settings (and strictly speaking other tabs), assume code. 
    // In future, we'd check !isIssues && !isPullRequests etc.
    const isCodeActive = !isSettingsActive;

    const activeTabClass = "border-b-primary text-text-light dark:text-text-dark";
    const inactiveTabClass = "border-b-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark";

    return (
        <div className="flex flex-col gap-6">
            {/* PageHeading */}
            {/* ... (keep existing PageHeading code unchanged) ... */}
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex min-w-72 flex-col gap-2">
                    <div className="text-text-light dark:text-text-dark tracking-light text-2xl font-bold leading-tight flex items-center gap-2">
                        <div className="text-secondary-text-light dark:text-secondary-text-light">
                            {/* Using a generic icon that looks like source_environment or similar */}
                            <LayoutGrid className="w-8 h-8 text-secondary-text-light dark:text-secondary-text-dark" />
                        </div>
                        <Link href={`/${username}`} className="text-primary hover:underline cursor-pointer">
                            {username}
                        </Link>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">/</span>
                        <span className="text-text-light dark:text-text-dark">{repoName}</span>
                    </div>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm font-normal leading-normal">
                        A modern, developer-focused interface for exploring code repositories.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark text-sm font-medium leading-normal border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="truncate">Public</span>
                    </button>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-medium leading-normal hover:opacity-90 transition-opacity">
                        <Code className="w-4 h-4 mr-2" />
                        <span className="truncate">Code</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="pb-3">
                <div className="flex border-b border-border-light dark:border-border-dark gap-6 overflow-x-auto">
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${isCodeActive ? activeTabClass : inactiveTabClass}`}
                        href={`/${username}/${repoName}`}
                    >
                        <Code className={`w-6 h-6 ${isCodeActive ? "text-primary" : ""}`} />
                        <p className="text-sm font-bold leading-normal">Code</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${inactiveTabClass}`}
                        href="#"
                    >
                        <Bug className="w-6 h-6" />
                        <p className="text-sm font-bold leading-normal">Issues</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${inactiveTabClass}`}
                        href="#"
                    >
                        <GitPullRequest className="w-6 h-6" />
                        <p className="text-sm font-bold leading-normal">Pull Requests</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${inactiveTabClass}`}
                        href="#"
                    >
                        <PlayCircle className="w-6 h-6" />
                        <p className="text-sm font-bold leading-normal">Actions</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${inactiveTabClass}`}
                        href="#"
                    >
                        <LayoutGrid className="w-6 h-6" />
                        <p className="text-sm font-bold leading-normal">Projects</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${inactiveTabClass}`}
                        href="#"
                    >
                        <Shield className="w-6 h-6" />
                        <p className="text-sm font-bold leading-normal">Security</p>
                    </Link>
                    <Link
                        className={`flex items-center justify-center border-b-[3px] gap-2 pb-2.5 pt-1 whitespace-nowrap transition-colors ${isSettingsActive ? activeTabClass : inactiveTabClass}`}
                        href={`/${username}/${repoName}/settings`}
                    >
                        <Settings className={`w-6 h-6 ${isSettingsActive ? "text-primary" : ""}`} />
                        <p className="text-sm font-bold leading-normal">Settings</p>
                    </Link>
                </div>
            </div>

            {/* Action Bar */}
            {showSourceControls && (
                <div className="flex justify-between items-center gap-2 py-2">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 max-w-[480px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark text-sm font-medium leading-normal tracking-[0.015em] min-w-0 px-4 border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <History className="w-5 h-5" />
                            <span className="truncate">main</span>
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="hidden sm:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark gap-2 text-sm font-medium leading-normal tracking-[0.015em] min-w-0 px-4 border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <span className="truncate">Go to file</span>
                        </button>
                        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 bg-primary text-white gap-2 text-sm font-medium leading-normal tracking-[0.015em] min-w-0 px-4 hover:opacity-90 transition-opacity">
                            <span className="truncate">Add file</span>
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
