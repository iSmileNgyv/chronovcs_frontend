"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Folder,
    FileText,
    CornerLeftUp,
    Loader2,
    FolderOpen,
    GitBranch,
    Terminal,
    FileCode,
    FileImage,
    File,
    ChevronRight,
    Home
} from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { CommitSnapshotDto, TreeEntryDto } from "@/types/repository-dto";

interface FileExplorerProps {
    username: string;
    repoName: string;
    branch?: string;
    path?: string;
}

export function FileExplorer({ username, repoName, branch = "main", path = "" }: FileExplorerProps) {
    const [files, setFiles] = useState<TreeEntryDto[]>([]);
    const [lastCommit, setLastCommit] = useState<CommitSnapshotDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch commit history for basic info (latest commit on branch)
                const historyPromise = repositoryService.getCommitHistory(repoName, {
                    branch,
                    limit: 1,
                });

                // Fetch file tree from the new endpoint
                const treePromise = repositoryService.getTree(repoName, branch, path);

                const [historyResponse, treeResponse] = await Promise.all([
                    historyPromise,
                    treePromise,
                ]);

                // Handle commit info
                if (historyResponse.commits && historyResponse.commits.length > 0) {
                    setLastCommit(historyResponse.commits[0]);
                    setIsEmpty(false);
                } else {
                    setLastCommit(null);
                    if (path === "") {
                        setIsEmpty(true); // Only consider empty if root is empty
                    }
                }

                // Handle tree files
                if (treeResponse.entries) {
                    // Sort: folders first, then files
                    const sorted = [...treeResponse.entries].sort((a, b) => {
                        if (a.type === b.type) return a.path.localeCompare(b.path);
                        return a.type === "DIR" ? -1 : 1;
                    });
                    setFiles(sorted);
                } else {
                    setFiles([]);
                }

            } catch (error) {
                console.error("Failed to fetch repository data:", error);
                setFiles([]);
                // If distinct error for empty repo, set isEmpty. For now assume error on root means empty/problem
                if (path === "") setIsEmpty(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [repoName, branch, path]);

    const pathParts = path ? path.split("/") : [];

    // Format relative time
    const formatRelativeTime = (timestamp?: string) => {
        if (!timestamp) return "";
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
            if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
            return "Just now";
        } catch {
            return "";
        }
    };

    // Helper for file icons
    const getFileIcon = (name: string, type: string) => {
        if (type === "DIR") return <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />;

        const ext = name.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'ts':
            case 'tsx':
            case 'js':
            case 'jsx':
                return <FileCode className="w-5 h-5 text-yellow-500" />;
            case 'md':
            case 'txt':
                return <FileText className="w-5 h-5 text-gray-500" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'svg':
                return <FileImage className="w-5 h-5 text-purple-500" />;
            case 'json':
            case 'yml':
            case 'yaml':
            case 'xml':
                return <FileCode className="w-5 h-5 text-green-500" />;
            default:
                return <File className="w-5 h-5 text-gray-400" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    // Empty Repository State
    if (isEmpty) {
        return (
            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark p-8 shadow-sm">
                <div className="flex flex-col items-center text-center max-w-md mx-auto">
                    <div className="rounded-full bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark p-4 mb-4 ring-1 ring-border-light dark:ring-border-dark">
                        <FolderOpen className="w-10 h-10 text-secondary-text-light dark:text-secondary-text-dark" />
                    </div>
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                        Get started with your repository
                    </h3>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark mb-8 leading-relaxed">
                        This is where your code will live. You can initialize this repository
                        following the instructions below.
                    </p>

                    {/* Quick Setup */}
                    <div className="w-full text-left space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-text-light dark:text-text-dark">
                            <Terminal className="w-4 h-4 text-primary" />
                            <span>Quick setup</span>
                        </div>
                        <div className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark rounded-lg p-5 font-mono text-sm text-secondary-text-light dark:text-secondary-text-dark overflow-x-auto border border-border-light dark:border-border-dark shadow-inner">
                            <pre className="whitespace-pre-wrap break-all leading-loose">
                                {`# Create a new repository
chrono init
chrono remote add origin ${typeof window !== 'undefined' ? window.location.origin : ''}/${username}/${repoName}
chrono push -u origin ${branch}

# Or push an existing repository
chrono remote add origin ${typeof window !== 'undefined' ? window.location.origin : ''}/${username}/${repoName}
chrono push -u origin ${branch}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Branch and Breadcrumbs Bar removed as per user request */}

            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark overflow-hidden shadow-sm">
                {/* Latest Commit Header */}
                {lastCommit && (
                    <div className="flex items-center justify-between p-3 px-4 border-b border-border-light dark:border-border-dark bg-component-secondary-bg-light/30 dark:bg-component-secondary-bg-dark/30 backdrop-blur-sm">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                {lastCommit.authorUid?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <span className="text-text-light dark:text-text-dark font-semibold text-sm truncate">
                                {lastCommit.authorUid}
                            </span>
                            <span className="text-secondary-text-light dark:text-secondary-text-dark text-sm truncate flex-1 min-w-0 opacity-80 pl-2 border-l border-border-light dark:border-border-dark ml-2">
                                {lastCommit.message}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-secondary-text-light dark:text-secondary-text-dark hidden md:flex flex-shrink-0">
                            <span className="font-mono bg-component-secondary-bg-light dark:bg-black/20 px-2 py-1 rounded border border-border-light dark:border-border-dark select-all cursor-pointer hover:border-primary/50 transition-colors" title="Copy commit hash">
                                {lastCommit.id?.substring(0, 7)}
                            </span>
                            <span>{formatRelativeTime(lastCommit.timestamp)}</span>
                        </div>
                    </div>
                )}

                {/* File List */}
                <div className="flex flex-col">
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {/* Parent directory link */}
                        {path && (
                            <Link
                                href={
                                    pathParts.length > 1
                                        ? `/${username}/${repoName}/tree/${branch}/${pathParts.slice(0, -1).join("/")}`
                                        : `/${username}/${repoName}`
                                }
                                className="flex items-center px-4 py-2 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/5 transition-colors"
                            >
                                <div className="w-8 flex justify-center text-primary">
                                    <CornerLeftUp className="w-4 h-4" />
                                </div>
                                <span className="font-medium px-2 py-1">..</span>
                            </Link>
                        )}

                        {/* Files and Folders */}
                        {files.map((item) => (
                            <Link
                                key={item.path}
                                href={
                                    item.type === "DIR"
                                        ? `/${username}/${repoName}/tree/${branch}/${item.path}`
                                        : `/${username}/${repoName}/blob/${branch}/${item.path}`
                                }
                                className="flex items-center px-4 py-2.5 text-sm hover:bg-component-secondary-bg-light dark:hover:bg-primary/5 transition-all group"
                            >
                                <div className="w-8 flex justify-center flex-shrink-0">
                                    {getFileIcon(item.name || item.path, item.type)}
                                </div>

                                <span className={`${item.type === 'DIR' ? 'font-semibold text-text-light dark:text-text-dark' : 'text-text-light dark:text-text-dark'} group-hover:text-primary group-hover:underline px-2 flex-grow truncate transition-colors`}>
                                    {item.name || item.path}
                                </span>

                                {/* Last commit message (Placeholder for now as tree endpoint doesn't return it per file yet) */}
                                <span className="hidden md:block text-xs text-secondary-text-light dark:text-secondary-text-dark truncate max-w-[30%] mr-4 opacity-0 group-hover:opacity-60 transition-opacity">
                                    Update {item.name || item.path}
                                </span>

                                <span className="text-xs text-secondary-text-light dark:text-secondary-text-dark whitespace-nowrap min-w-[70px] text-right">
                                    {/* Simple size formatting if size is present */}
                                    {item.type !== 'DIR' && item.size !== undefined ? (
                                        item.size < 1024 ? `${item.size} B` : `${(item.size / 1024).toFixed(1)} KB`
                                    ) : ''}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
