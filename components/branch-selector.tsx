"use client";

import React, { useState, useEffect, useRef } from "react";
import { GitBranch, ChevronDown, Check, Search, AlertCircle } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { useRouter } from "next/navigation";

interface BranchSelectorProps {
    username: string;
    repoName: string;
    currentBranch: string;
    onBranchChange?: (branch: string) => void;
    className?: string;
}

export function BranchSelector({ username, repoName, currentBranch, onBranchChange, className }: BranchSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [branches, setBranches] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch branches when dropdown opens
    useEffect(() => {
        if (isOpen && branches.length === 0) {
            fetchBranches();
        }
    }, [isOpen]);

    const fetchBranches = async () => {
        setLoading(true);
        setError(null);
        try {
            const refs = await repositoryService.getRefs(repoName);
            // refs.branches is Record<string, string>
            const branchList = Object.keys(refs.branches);
            setBranches(branchList);
        } catch (err) {
            console.error("Failed to fetch branches:", err);
            setError("Failed to load branches");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBranch = (branch: string) => {
        setIsOpen(false);
        if (onBranchChange) {
            onBranchChange(branch);
        } else {
            // Default behavior: Navigate to tree view of new branch
            router.push(`/${username}/${repoName}/tree/${branch}`);
        }
    };

    const filteredBranches = branches.filter(branch =>
        branch.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={className || "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-light dark:text-text-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"}
                title="Switch branch"
            >
                <GitBranch className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                <span className="max-w-[120px] truncate">{currentBranch}</span>
                <ChevronDown className={`w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-border-light dark:border-border-dark bg-component-secondary-bg-light/50 dark:bg-component-secondary-bg-dark/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                            <input
                                type="text"
                                placeholder="Find a branch..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-sm bg-component-bg-light dark:bg-black/20 border border-border-light dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark placeholder-secondary-text-light dark:placeholder-secondary-text-dark"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-sm text-secondary-text-light dark:text-secondary-text-dark">
                                Loading branches...
                            </div>
                        ) : error ? (
                            <div className="px-4 py-8 text-center text-sm text-red-500 flex flex-col items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-secondary-text-light dark:text-secondary-text-dark">
                                No branches found.
                            </div>
                        ) : (
                            filteredBranches.map((branch) => (
                                <button
                                    key={branch}
                                    onClick={() => handleSelectBranch(branch)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group"
                                >
                                    <span className={`font-medium ${branch === currentBranch ? "text-primary" : "text-text-light dark:text-text-dark"}`}>
                                        {branch}
                                    </span>
                                    {branch === currentBranch && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer Actions (Optional) */}
                    <div className="p-2 border-t border-border-light dark:border-border-dark bg-component-secondary-bg-light/30 dark:bg-component-secondary-bg-dark/30 text-center">
                        <a href="#" className="text-xs font-medium text-secondary-text-light dark:text-secondary-text-dark hover:text-primary transition-colors">View all branches</a>
                    </div>
                </div>
            )}
        </div>
    );
}
