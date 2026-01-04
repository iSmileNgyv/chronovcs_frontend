"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pullRequestService } from "@/services/pull-request-service";
import { BranchSelector } from "@/components/branch-selector";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { repositoryService } from "@/services/repository-service";

interface PullRequestCreateProps {
    username: string;
    repoName: string;
}

export function PullRequestCreate({ username, repoName }: PullRequestCreateProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sourceBranch, setSourceBranch] = useState("");
    const [targetBranch, setTargetBranch] = useState(""); // Base
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize defaults (e.g. main)
    useEffect(() => {
        // Fetch repo info to get default branch? Or just try main?
        // Let's assume 'main' for target default, and leave source empty for user to pick.
        // Actually BranchSelector fetches branches. I can use it.
        setTargetBranch("main");
    }, []);

    const handleCreate = async () => {
        if (!title || !sourceBranch || !targetBranch) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const pr = await pullRequestService.create(repoName, {
                title,
                description,
                sourceBranch,
                targetBranch
            });
            router.push(`/${username}/${repoName}/pulls/${pr.id}`);
        } catch (err: any) {
            setError(err.message || "Failed to create pull request");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Compare and pull request</h1>
                <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mb-6">
                    Choose two branches to see what’s changed or to start a new pull request.
                </p>

                {/* Branch Selection Bar */}
                <div className="flex items-center gap-4 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark p-4 rounded-lg border border-border-light dark:border-border-dark mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark">base:</span>
                        <BranchSelector
                            username={username}
                            repoName={repoName}
                            currentBranch={targetBranch}
                            onBranchChange={setTargetBranch}
                        />
                    </div>

                    <ArrowLeft className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark">compare:</span>
                        <BranchSelector
                            username={username}
                            repoName={repoName}
                            currentBranch={sourceBranch || "Select branch"}
                            onBranchChange={setSourceBranch}
                        />
                    </div>
                </div>

                {/* Form */}
                <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                            placeholder="Title"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow min-h-[150px]"
                            placeholder="Leave a comment"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={loading || !sourceBranch || !targetBranch}
                            className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-md transition-all ${loading ? "opacity-70 cursor-wait" : "hover:bg-primary/90"}`}
                        >
                            {loading ? "Creating..." : "Create Pull Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
