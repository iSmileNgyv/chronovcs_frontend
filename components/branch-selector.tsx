"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, GitBranch, Check, Plus, Search, Loader2 } from "lucide-react";
import { branchService } from "@/services/branch-service";
import { BranchResponse } from "@/types/branch-dto";

interface BranchSelectorProps {
    repoKey: string;
    currentBranch?: string;
    onBranchChange?: (branchName: string) => void;
}

export function BranchSelector({ repoKey, currentBranch = "main", onBranchChange }: BranchSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [branches, setBranches] = useState<BranchResponse[]>([]);
    const [defaultBranch, setDefaultBranch] = useState("main");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch branches when dropdown opens
    useEffect(() => {
        if (isOpen && branches.length === 0) {
            fetchBranches();
        }
    }, [isOpen]);

    const fetchBranches = async () => {
        setIsLoading(true);
        try {
            const response = await branchService.listBranches(repoKey);
            setBranches(response.branches);
            setDefaultBranch(response.defaultBranch);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectBranch = (branchName: string) => {
        onBranchChange?.(branchName);
        setIsOpen(false);
        setSearchQuery("");
    };

    const filteredBranches = branches.filter((branch) =>
        branch.branchName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-1.5 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-bg-light dark:hover:bg-component-bg-dark transition-colors"
            >
                <GitBranch className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                <span className="max-w-[120px] truncate">{currentBranch}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark shadow-lg z-50">
                    {/* Header */}
                    <div className="border-b border-border-light dark:border-border-dark px-3 py-2">
                        <div className="text-xs font-medium text-secondary-text-light dark:text-secondary-text-dark mb-2">
                            Switch branches
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                            <input
                                type="text"
                                placeholder="Find a branch..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark pl-8 pr-3 py-1.5 text-sm placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Branch List */}
                    <div className="max-h-64 overflow-y-auto py-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-5 h-5 animate-spin text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-secondary-text-light dark:text-secondary-text-dark">
                                {searchQuery ? (
                                    <>No branches matching &quot;{searchQuery}&quot;</>
                                ) : (
                                    "No branches found"
                                )}
                            </div>
                        ) : (
                            filteredBranches.map((branch) => (
                                <button
                                    key={branch.branchName}
                                    onClick={() => handleSelectBranch(branch.branchName)}
                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors ${branch.branchName === currentBranch
                                            ? "bg-primary/10"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <GitBranch className="w-4 h-4 flex-shrink-0 text-secondary-text-light dark:text-secondary-text-dark" />
                                        <span className="truncate text-text-light dark:text-text-dark">
                                            {branch.branchName}
                                        </span>
                                        {branch.isDefault && (
                                            <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                default
                                            </span>
                                        )}
                                    </div>
                                    {branch.branchName === currentBranch && (
                                        <Check className="w-4 h-4 flex-shrink-0 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border-light dark:border-border-dark">
                        <button
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors"
                            onClick={() => {
                                // TODO: Open create branch modal
                                setIsOpen(false);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create new branch</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
