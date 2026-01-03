"use client";

import React, { useEffect, useState, use } from "react";
import { TopNavBar } from "@/components/top-nav-bar";
import { RepoHeader } from "@/components/repo-header";
import { GeneralSettings } from "@/components/repo-settings/general-settings";
import { DangerZone } from "@/components/repo-settings/danger-zone";
import { repositoryService } from "@/services/repository-service";
import { RepositorySettingsResponseDto, RepositoryInfoDto, HandshakePermissionDto } from "@/types/repository-dto";
import { Loader2 } from "lucide-react";
import { PermissionsSettings } from "@/components/repo-settings/permissions-settings";

export default function SettingsPage({
    params,
}: {
    params: Promise<{ username: string; repo: string }>;
}) {
    const { username, repo } = use(params);
    const [settings, setSettings] = useState<RepositorySettingsResponseDto | null>(null);
    const [repoInfo, setRepoInfo] = useState<RepositoryInfoDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"general" | "permissions">("general");
    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const [settingsData, infoData] = await Promise.all([
                repositoryService.getSettings(repo),
                repositoryService.getRepositoryInfo(repo)
            ]);
            setSettings(settingsData);
            setRepoInfo(infoData);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load repository settings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [repo]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RepoHeader username={username} repoName={repo} showSourceControls={false} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <nav className="flex flex-col space-y-1">
                            <button
                                onClick={() => setActiveTab("general")}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "general"
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark"
                                    }`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab("permissions")}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "permissions"
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark"
                                    }`}
                            >
                                Permissions
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                                {error}
                            </div>
                        ) : settings && repoInfo ? (
                            <>
                                {activeTab === "general" && (
                                    <>
                                        <GeneralSettings
                                            repoKey={repo}
                                            initialSettings={settings}
                                            repoInfo={repoInfo}
                                            onUpdate={fetchSettings}
                                        />

                                        <DangerZone
                                            repoKey={repo}
                                            username={username}
                                        />
                                    </>
                                )}
                                {activeTab === "permissions" && (
                                    <PermissionsSettings repoKey={repo} ownerUid={repoInfo.ownerUid} />
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
}
