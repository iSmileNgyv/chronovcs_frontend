"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitCommit, Copy, Check, Loader2 } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { CommitSnapshotDto } from "@/types/repository-dto";
import { BranchSelector } from "@/components/branch-selector";
import { TopNavBar } from "@/components/top-nav-bar";

interface CommitsPageProps {
    params: Promise<{ username: string; repo: string }>;
    searchParams: Promise<{ branch?: string }>;
}

export default function CommitsPage({ params, searchParams }: CommitsPageProps) {
    const [resolvedParams, setResolvedParams] = useState<{ username: string; repo: string } | null>(null);
    const [currentBranch, setCurrentBranch] = useState("main");
    const [commits, setCommits] = useState<CommitSnapshotDto[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([params, searchParams]).then(([p, sp]) => {
            setResolvedParams(p);
            if (sp.branch) setCurrentBranch(sp.branch);
        });
    }, [params, searchParams]);

    useEffect(() => {
        if (!resolvedParams) return;

        const fetchCommits = async () => {
            setIsLoading(true);
            try {
                const response = await repositoryService.getCommitHistory(resolvedParams.repo, {
                    branch: currentBranch,
                    limit: 30,
                });
                setCommits(response.commits);
                setHasMore(response.hasMore);
            } catch (error) {
                console.error("Failed to fetch commits:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommits();
    }, [resolvedParams, currentBranch]);

    const copyHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    // Group commits by date
    const groupedCommits = commits.reduce((groups, commit) => {
        const date = formatDate(commit.timestamp);
        if (!groups[date]) groups[date] = [];
        groups[date].push(commit);
        return groups;
    }, {} as Record<string, CommitSnapshotDto[]>);

    if (!resolvedParams) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    const { username, repo } = resolvedParams;

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
            <TopNavBar />
            <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${username}/${repo}`}
                            className="text-primary hover:underline font-medium"
                        >
                            {repo}
                        </Link>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">/</span>
                        <span className="text-text-light dark:text-text-dark font-medium">Commits</span>
                    </div>
                    <BranchSelector
                        repoKey={repo}
                        currentBranch={currentBranch}
                        onBranchChange={setCurrentBranch}
                    />
                </div>

                {/* Commits List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : commits.length === 0 ? (
                    <div className="text-center py-12">
                        <GitCommit className="w-12 h-12 mx-auto text-secondary-text-light dark:text-secondary-text-dark mb-4" />
                        <p className="text-secondary-text-light dark:text-secondary-text-dark">
                            No commits found on this branch.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedCommits).map(([date, dateCommits]) => (
                            <div key={date}>
                                {/* Date Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                                    <span className="text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark whitespace-nowrap">
                                        Commits on {date}
                                    </span>
                                    <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                                </div>

                                {/* Commits */}
                                <div className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                                    {dateCommits.map((commit, index) => (
                                        <div
                                            key={commit.id}
                                            className={`flex items-center justify-between p-4 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors ${index !== dateCommits.length - 1
                                                    ? "border-b border-border-light dark:border-border-dark"
                                                    : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                <GitCommit className="w-5 h-5 mt-0.5 flex-shrink-0 text-secondary-text-light dark:text-secondary-text-dark" />
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/${username}/${repo}/commit/${commit.id}`}
                                                        className="text-text-light dark:text-text-dark font-medium hover:text-primary hover:underline line-clamp-1"
                                                    >
                                                        {commit.message}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-secondary-text-light dark:text-secondary-text-dark">
                                                        <span className="font-medium">{commit.authorUid}</span>
                                                        <span>committed {formatRelativeTime(commit.timestamp)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                                <button
                                                    onClick={() => copyHash(commit.id)}
                                                    className="flex items-center gap-1 px-2 py-1 rounded border border-border-light dark:border-border-dark text-xs font-mono text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors"
                                                >
                                                    {copiedHash === commit.id ? (
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-3 h-3" />
                                                    )}
                                                    {commit.id.substring(0, 7)}
                                                </button>
                                                <Link
                                                    href={`/${username}/${repo}/commit/${commit.id}`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <div className="text-center">
                                <button className="px-4 py-2 text-sm font-medium text-primary hover:underline">
                                    Load more commits
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
