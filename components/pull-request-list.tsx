"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GitPullRequest, Check, X, Clock, MessageSquare } from "lucide-react";
import { pullRequestService } from "@/services/pull-request-service";
import { PullRequestResponseDto } from "@/types/repository-dto";
import { formatDistanceToNow } from "date-fns";

interface PullRequestListProps {
    username: string;
    repoName: string;
}

export function PullRequestList({ username, repoName }: PullRequestListProps) {
    const [prs, setPrs] = useState<PullRequestResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'OPEN' | 'CLOSED' | 'MERGED'>('OPEN');

    useEffect(() => {
        loadPrs();
    }, [statusFilter]);

    const loadPrs = async () => {
        setLoading(true);
        try {
            const data = await pullRequestService.list(repoName, statusFilter);
            setPrs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm">
                    <button
                        onClick={() => setStatusFilter('OPEN')}
                        className={`font-semibold ${statusFilter === 'OPEN' ? 'text-text-light dark:text-text-dark' : 'text-secondary-text-light dark:text-secondary-text-dark'}`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setStatusFilter('CLOSED')}
                        className={`font-semibold ${statusFilter === 'CLOSED' ? 'text-text-light dark:text-text-dark' : 'text-secondary-text-light dark:text-secondary-text-dark'}`}
                    >
                        Closed
                    </button>
                    {/* Allow Merged as separate filter or part of Closed? GitHub mixes Closed/Merged. 
                        For now, simple individual tabs. */}
                    <button
                        onClick={() => setStatusFilter('MERGED')}
                        className={`font-semibold ${statusFilter === 'MERGED' ? 'text-text-light dark:text-text-dark' : 'text-secondary-text-light dark:text-secondary-text-dark'}`}
                    >
                        Merged
                    </button>
                </div>

                <Link
                    href={`/${username}/${repoName}/pulls/new`}
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                    New Pull Request
                </Link>
            </div>

            {/* List */}
            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark overflow-hidden">
                {/* Header Row */}
                <div className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-4 py-3 border-b border-border-light dark:border-border-dark text-sm font-medium text-text-light dark:text-text-dark flex items-center justify-between">
                    <span>{prs.length} {statusFilter.toLowerCase()} pull requests</span>
                    {/* Sort/Filter dropdowns could go here */}
                </div>

                {loading ? (
                    <div className="p-8 text-center text-secondary-text-light dark:text-secondary-text-dark">Loading...</div>
                ) : prs.length === 0 ? (
                    <div className="p-12 text-center text-secondary-text-light dark:text-secondary-text-dark">
                        <GitPullRequest className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <h3 className="text-lg font-medium">No pull requests found.</h3>
                    </div>
                ) : (
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {prs.map(pr => (
                            <div key={pr.id} className="p-4 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors flex items-start gap-3">
                                {/* Icon */}
                                <div className="mt-1">
                                    {pr.status === 'OPEN' && <GitPullRequest className="w-5 h-5 text-green-500" />}
                                    {pr.status === 'MERGED' && <GitPullRequest className="w-5 h-5 text-purple-500" />}
                                    {pr.status === 'CLOSED' && <X className="w-5 h-5 text-red-500" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link href={`/${username}/${repoName}/pulls/${pr.id}`} className="text-base font-semibold text-text-light dark:text-text-dark hover:text-primary truncate block">
                                        {pr.title}
                                    </Link>
                                    <div className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1 flex items-center gap-1">
                                        <span>#{pr.id} {pr.status.toLowerCase()}</span>
                                        <span>•</span>
                                        <span>opened {formatDistanceToNow(new Date(pr.createdAt))} ago by {pr.createdBy.displayName}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <div className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-1.5 py-0.5 rounded border border-border-light dark:border-border-dark font-mono text-[10px]">{pr.targetBranch}</div>
                                            ←
                                            <div className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-1.5 py-0.5 rounded border border-border-light dark:border-border-dark font-mono text-[10px]">{pr.sourceBranch}</div>
                                        </span>
                                    </div>
                                </div>

                                {/* Comments Count (Placeholder) */}
                                <div className="flex items-center gap-1 text-secondary-text-light dark:text-secondary-text-dark text-xs mt-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>0</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
