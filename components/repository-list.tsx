"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Plus, Lock, Globe, Loader2, AlertCircle } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { RepositoryInfoDto } from "@/types/repository-dto";
import { NewRepositoryModal } from "@/components/new-repository-modal";
import { useAuth } from "@/components/auth-provider";

// Language color mapping
const languageColors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    Java: "bg-red-500",
    Go: "bg-cyan-500",
    Rust: "bg-orange-600",
    Shell: "bg-green-600",
    PHP: "bg-purple-500",
    C: "bg-gray-500",
    "C++": "bg-pink-500",
    Ruby: "bg-red-600",
    project: "bg-indigo-500",
    object: "bg-teal-500",
};

interface RepositoryListProps {
    username?: string;
}

export function RepositoryList({ username }: RepositoryListProps) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [repositories, setRepositories] = useState<RepositoryInfoDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewRepoModalOpen, setIsNewRepoModalOpen] = useState(false);

    // Check if viewing own profile
    const isOwnProfile = user?.username === username || user?.email?.split("@")[0] === username;

    const fetchRepositories = async () => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const repos = await repositoryService.listRepositories();

            // Backend might return string instead of array (not yet implemented)
            if (Array.isArray(repos)) {
                setRepositories(repos);
            } else {
                // Backend returns placeholder string, treat as empty
                console.warn("Repository list endpoint not fully implemented:", repos);
                setRepositories([]);
            }
        } catch (err) {
            console.error("Failed to fetch repositories:", err);
            // Check if it's a parse error (backend returns string instead of JSON array)
            const errorMessage = err instanceof Error ? err.message : "Failed to load repositories";
            if (errorMessage.includes("pattern") || errorMessage.includes("JSON") || errorMessage.includes("Unexpected")) {
                // Backend not returning array yet, show empty state
                setRepositories([]);
                setError(null);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRepositories();
    }, [isAuthenticated]);

    const handleRepoCreated = async (repoKey: string) => {
        // Refresh list
        await fetchRepositories();
        // Navigate to new repo
        if (username) {
            router.push(`/${username}/${repoKey}`);
        }
    };

    // Filter repositories based on search
    const filteredRepos = repositories.filter((repo) =>
        repo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format relative time - with null check
    const formatRelativeTime = (dateString?: string) => {
        if (!dateString) return "Recently";

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Recently";

            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 30) return date.toLocaleDateString();
            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
            if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
            if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
            return "Just now";
        } catch {
            return "Recently";
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="sr-only" htmlFor="search-repo">
                        Search Repositories
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                        </div>
                        <input
                            className="block w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark py-2 pl-10 pr-3 text-sm text-text-light dark:text-text-dark placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark focus:border-primary focus:ring-primary focus:outline-none transition-all"
                            id="search-repo"
                            name="search"
                            placeholder="Find a repository..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                        <span>Type</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                        <span>Sort</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    {isOwnProfile && (
                        <button
                            onClick={() => setIsNewRepoModalOpen(true)}
                            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                    <button
                        onClick={fetchRepositories}
                        className="ml-auto text-sm font-medium hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!error && filteredRepos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark p-4 mb-4">
                        <Search className="w-8 h-8 text-secondary-text-light dark:text-secondary-text-dark" />
                    </div>
                    <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                        {searchQuery ? "No repositories found" : "No repositories yet"}
                    </h3>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark max-w-sm">
                        {searchQuery
                            ? `No repositories match "${searchQuery}".`
                            : "Get started by creating your first repository."}
                    </p>
                    {isOwnProfile && !searchQuery && (
                        <button
                            onClick={() => setIsNewRepoModalOpen(true)}
                            className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New repository
                        </button>
                    )}
                </div>
            )}

            {/* Repository List */}
            <div className="flex flex-col">
                {filteredRepos.map((repo) => (
                    <div
                        key={repo.id || repo.key}
                        className="border-b border-border-light dark:border-border-dark py-4 first:pt-0"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Link
                                        className="text-primary font-bold text-lg hover:underline truncate"
                                        href={`/${username}/${repo.key || repo.name}`}
                                    >
                                        {repo.name}
                                    </Link>
                                    {repo.privateRepo ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-0.5 text-xs text-secondary-text-light dark:text-secondary-text-dark">
                                            <Lock className="w-3 h-3" />
                                            Private
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-0.5 text-xs text-secondary-text-light dark:text-secondary-text-dark">
                                            <Globe className="w-3 h-3" />
                                            Public
                                        </span>
                                    )}
                                </div>
                                {repo.description && (
                                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1 line-clamp-2">
                                        {repo.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                                    {/* Versioning Mode Badge */}
                                    {repo.versioningMode && (
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`h-3 w-3 rounded-full ${languageColors[repo.versioningMode] || "bg-gray-400"
                                                    }`}
                                            ></span>
                                            <span className="capitalize">{repo.versioningMode}</span>
                                        </div>
                                    )}
                                    <span>Updated {formatRelativeTime(repo.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Repository Modal */}
            <NewRepositoryModal
                isOpen={isNewRepoModalOpen}
                onClose={() => setIsNewRepoModalOpen(false)}
                onSuccess={handleRepoCreated}
            />
        </div>
    );
}
