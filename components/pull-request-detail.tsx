"use client";

import React, { useState, useEffect } from "react";
import { Link } from "lucide-react"; // Wait, Link icon vs next/link
import NextLink from "next/link";
import {
    GitPullRequest,
    Check,
    X,
    Clock,
    MessageSquare,
    FileText,
    GitMerge,
    AlertCircle,
    Copy
} from "lucide-react";
import { pullRequestService } from "@/services/pull-request-service";
import { diffService } from "@/services/diff-service";
import { PullRequestResponseDto, DiffResponse, MergeAnalysisResponse } from "@/types/repository-dto";
import { formatDistanceToNow } from "date-fns";
import { DiffViewer } from "@/components/diff-viewer";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface PullRequestDetailProps {
    username: string;
    repoName: string;
    prId: number;
}

export function PullRequestDetail({ username, repoName, prId }: PullRequestDetailProps) {
    const [pr, setPr] = useState<PullRequestResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'conversation' | 'files'>('conversation');

    // Diff state
    const [diff, setDiff] = useState<DiffResponse | null>(null);
    const [loadingDiff, setLoadingDiff] = useState(false);

    // Merge state
    const [mergeAnalysis, setMergeAnalysis] = useState<MergeAnalysisResponse | null>(null);
    const [merging, setMerging] = useState(false);

    useEffect(() => {
        loadPr();
    }, [prId]);

    useEffect(() => {
        if (activeTab === 'files' && !diff && pr) {
            loadDiff();
        }
    }, [activeTab, pr]);

    useEffect(() => {
        if (pr && pr.status === 'OPEN') {
            checkMergeability();
        }
    }, [pr]);

    const loadPr = async () => {
        try {
            const data = await pullRequestService.getPullRequest(repoName, prId);
            setPr(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadDiff = async () => {
        if (!pr) return;
        setLoadingDiff(true);
        try {
            const data = await diffService.compare(repoName, pr.targetBranch, pr.sourceBranch);
            setDiff(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDiff(false);
        }
    };

    const checkMergeability = async () => {
        if (!pr) return;
        try {
            const analysis = await pullRequestService.analyze(repoName, prId);
            setMergeAnalysis(analysis);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMerge = async () => {
        setMerging(true);
        try {
            await pullRequestService.merge(repoName, prId);
            // Refresh
            loadPr();
        } catch (err) {
            console.error(err);
            alert("Merge failed");
        } finally {
            setMerging(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-sm text-secondary-text-light">Loading...</div>;
    if (!pr) return <div className="p-8 text-center text-red-500">Pull request not found</div>;

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-light text-text-light dark:text-text-dark mb-2">
                        {pr.title} <span className="text-secondary-text-light dark:text-secondary-text-dark font-light">#{pr.id}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${pr.status === 'OPEN' ? 'bg-green-600' :
                        pr.status === 'MERGED' ? 'bg-purple-600' : 'bg-red-600'
                        }`}>
                        {pr.status === 'OPEN' && <GitPullRequest className="w-4 h-4" />}
                        {pr.status === 'MERGED' && <GitMerge className="w-4 h-4" />}
                        {pr.status === 'CLOSED' && <X className="w-4 h-4" />}
                        <span className="capitalize">{pr.status.toLowerCase()}</span>
                    </div>

                    <div className="text-sm text-text-light dark:text-text-dark flex items-center gap-1 flex-wrap">
                        <span className="font-semibold">{pr.createdBy.displayName}</span>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">wants to merge into</span>
                        <span className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-1.5 py-0.5 rounded font-mono text-xs">{pr.targetBranch}</span>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">from</span>
                        <span className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-1.5 py-0.5 rounded font-mono text-xs">{pr.sourceBranch}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border-light dark:border-border-dark flex gap-6 mt-6">
                    <button
                        onClick={() => setActiveTab('conversation')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'conversation'
                            ? 'border-primary text-text-light dark:text-text-dark'
                            : 'border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Conversation
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'files'
                            ? 'border-primary text-text-light dark:text-text-dark'
                            : 'border-transparent text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Files Changed
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                    {activeTab === 'conversation' && (
                        <div className="flex flex-col gap-6">
                            {/* Description Box */}
                            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark overflow-hidden">
                                <div className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-4 py-2 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                    <span className="text-sm font-semibold">{pr.createdBy.displayName}</span>
                                    <span className="text-xs text-secondary-text-light dark:text-secondary-text-dark">{formatDistanceToNow(new Date(pr.createdAt))} ago</span>
                                </div>
                                <div className="p-4 text-sm text-text-light dark:text-text-dark">
                                    {pr.description ? (
                                        <MarkdownRenderer content={pr.description} />
                                    ) : (
                                        <i className="text-secondary-text-light dark:text-secondary-text-dark">No description provided.</i>
                                    )}
                                </div>
                            </div>

                            {/* Timeline / Status */}
                            <div className="relative pl-8 border-l-2 border-border-light dark:border-border-dark space-y-8 my-4">
                                {/* Added Commits (Mock for now until we have endpoint) */}
                                {/* Merge Box */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] text-white bg-secondary-text-light p-1 rounded-full border-4 border-background-light dark:border-background-dark">
                                        <GitMerge className="w-4 h-4" />
                                    </div>

                                    <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark p-4">
                                        {pr.status === 'OPEN' ? (
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-medium flex items-center gap-2">
                                                        {!mergeAnalysis ? (
                                                            <>
                                                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                                                Checking for ability to merge automatically...
                                                            </>
                                                        ) : mergeAnalysis.canMerge ? (
                                                            <>
                                                                <Check className="w-5 h-5 text-green-500 rounded-full border border-green-500 p-0.5" />
                                                                This branch has no conflicts with the base branch
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X className="w-5 h-5 text-red-500 rounded-full border border-red-500 p-0.5" />
                                                                This branch has conflicts that must be resolved
                                                            </>
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleMerge}
                                                        disabled={merging || !mergeAnalysis?.canMerge}
                                                        className={`px-4 py-2 text-white font-medium rounded-md transition-colors ${merging || !mergeAnalysis?.canMerge
                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                : 'bg-green-600 hover:bg-green-700'
                                                            }`}
                                                    >
                                                        {merging ? "Merging..." : "Merge Pull Request"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full text-white ${pr.status === 'MERGED' ? 'bg-purple-600' : 'bg-red-600'}`}>
                                                    <GitPullRequest className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-light dark:text-text-dark">Pull request {pr.status.toLowerCase()}</p>
                                                    {pr.mergedBy && (
                                                        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                                                            Merged by {pr.mergedBy.displayName} {pr.mergedAt && formatDistanceToNow(new Date(pr.mergedAt))} ago
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div>
                            {loadingDiff ? (
                                <div className="text-center p-8">Loading diff...</div>
                            ) : (
                                <DiffViewer diffs={diff?.files || []} />
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    {/* Reviewers, Assignees, Labels - Mock layout */}
                    <div className="border-b border-border-light dark:border-border-dark pb-4">
                        <h3 className="text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase mb-2">Reviewers</h3>
                        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">No reviewers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
