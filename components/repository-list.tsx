"use client";

import React from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";

export function RepositoryList() {
    return (
        <div className="flex flex-col gap-4">
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
                            className="block w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark py-2 pl-10 pr-3 text-sm text-text-light dark:text-text-dark placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark focus:border-primary focus:ring-primary focus:outline-none"
                            id="search-repo"
                            name="search"
                            placeholder="Find a repository..."
                            type="search"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                        <span>Type</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                        <span>Language</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                        <span>Sort</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="border-b border-border-light dark:border-border-dark py-4">
                    <Link
                        className="text-primary font-bold text-lg hover:underline"
                        href="/alice_codes/QuantumLeap"
                    >
                        QuantumLeap
                    </Link>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1">
                        A next-generation state management library for React.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                            <span>JavaScript</span>
                        </div>
                        <span>Updated 2 hours ago</span>
                    </div>
                </div>
                <div className="border-b border-border-light dark:border-border-dark py-4">
                    <Link
                        className="text-primary font-bold text-lg hover:underline"
                        href="/alice_codes/Nova-UI"
                    >
                        Nova-UI
                    </Link>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1">
                        A sleek, modern component library for building beautiful UIs.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            <span>TypeScript</span>
                        </div>
                        <span>Updated 5 hours ago</span>
                    </div>
                </div>
                <div className="border-b border-border-light dark:border-border-dark py-4">
                    <Link
                        className="text-primary font-bold text-lg hover:underline"
                        href="/alice_codes/AlgoVisualizer"
                    >
                        AlgoVisualizer
                    </Link>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1">
                        Interactive platform to visualize algorithms and data structures.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-red-500"></span>
                            <span>Python</span>
                        </div>
                        <span>Updated yesterday</span>
                    </div>
                </div>
                <div className="border-b border-border-light dark:border-border-dark py-4">
                    <Link
                        className="text-primary font-bold text-lg hover:underline"
                        href="/alice_codes/dotfiles"
                    >
                        dotfiles
                    </Link>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1">
                        My personal dotfiles for a customized development environment.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            <span>Shell</span>
                        </div>
                        <span>Updated 3 days ago</span>
                    </div>
                </div>
                <div className="border-b border-border-light dark:border-border-dark py-4">
                    <Link
                        className="text-primary font-bold text-lg hover:underline"
                        href="/alice_codes/CodeSync"
                    >
                        CodeSync
                    </Link>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm mt-1">
                        A real-time collaborative code editor built with WebSockets.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                            <span>JavaScript</span>
                        </div>
                        <span>Updated 1 week ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
