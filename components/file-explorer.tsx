import React from "react";
import Link from "next/link";
import { Folder, FileText, CornerLeftUp } from "lucide-react";

interface FileExplorerProps {
    username: string;
    repoName: string;
}

export function FileExplorer({ username, repoName }: FileExplorerProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Action Bar */}
            <div className="flex justify-between items-center gap-2 py-2">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 max-w-[480px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark text-sm font-medium leading-normal tracking-[0.015em] min-w-0 px-4 border border-border-light dark:border-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <CornerLeftUp className="w-4 h-4" />
                        <span className="truncate">..</span>
                    </button>
                </div>
            </div>

            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark">
                {/* Latest Commit Info */}
                <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAlGulPV4zkvz3m9GdyBQUQmXdipzA4qUV5RbgCiAeBVW98bYMaIpJZAH22u2TQTj7he-npCIltnd7HeVPn0TcKWpJ8vkkjSlOqDiprSMjEelBIyi7AaBx_jR-pW95t1L-SVvLAClyk_hk5KEWRHE8lEZq_GA9l1FYaNk16Ds976iQ_OWyAsJWseQzRKlK-BWwSP3B0aOZH8sJBzknUOBH6GAPXo0WJ7pdF8kJYEHSOn3zgGI8Sju7WLmX5kejitl0l7_Am-jGCuo")',
                            }}
                        ></div>
                        <span className="text-text-light dark:text-text-dark font-medium">dev-user</span>
                        <p className="text-secondary-text-light dark:text-secondary-text-dark text-sm truncate max-w-[200px] sm:max-w-none">
                            feat: Initial commit for UI redesign
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark hidden sm:flex">
                        <span>
                            Latest commit <span className="font-mono text-primary">a1b2c3d</span>
                        </span>
                        <span>2 hours ago</span>
                    </div>
                </div>

                {/* File List Table */}
                <div className="flex flex-col">
                    {/* Breadcrumbs inside table header */}
                    <div className="flex flex-wrap gap-1 p-4 text-sm items-center bg-component-secondary-bg-light dark:bg-background-dark/50 border-b border-border-light dark:border-border-dark">
                        <Link href="#" className="text-primary font-medium hover:underline">
                            {repoName}
                        </Link>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">/</span>
                        <Link href="#" className="text-primary font-medium hover:underline">
                            src
                        </Link>
                        <span className="text-secondary-text-light dark:text-secondary-text-dark">/</span>
                        <span className="text-text-light dark:text-text-dark font-medium">components</span>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {/* Parent directory link */}
                        <Link
                            href="#"
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/10 transition-colors"
                        >
                            <div className="w-1/2 flex items-center gap-3">
                                <CornerLeftUp className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                                <span className="italic">..</span>
                            </div>
                            <div className="w-1/2 flex justify-between">
                                <span></span>
                                <span className="text-right"></span>
                            </div>
                        </Link>

                        {/* Folder Row */}
                        <Link
                            href="#"
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/10 transition-colors group"
                        >
                            <div className="w-1/2 flex items-center gap-3">
                                <Folder className="w-5 h-5 text-primary fill-primary/20" />
                                <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary group-hover:underline">
                                    ui
                                </span>
                            </div>
                            <div className="w-1/2 flex justify-between items-center">
                                <span className="truncate mr-2">refactor: Move shared UI components</span>
                                <span className="text-right whitespace-nowrap hidden sm:block">1 day ago</span>
                            </div>
                        </Link>

                        {/* File Row */}
                        <Link
                            href={`/${username}/${repoName}/blob/main/ui/Button.tsx`}
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/10 transition-colors group"
                        >
                            <div className="w-1/2 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                                <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary group-hover:underline">
                                    Button.tsx
                                </span>
                            </div>
                            <div className="w-1/2 flex justify-between items-center">
                                <span className="truncate mr-2">feat: Add new button component</span>
                                <span className="text-right whitespace-nowrap hidden sm:block">2 hours ago</span>
                            </div>
                        </Link>

                        {/* File Row */}
                        <Link
                            href={`/${username}/${repoName}/blob/main/ui/Card.tsx`}
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/10 transition-colors group"
                        >
                            <div className="w-1/2 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                                <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary group-hover:underline">
                                    Card.tsx
                                </span>
                            </div>
                            <div className="w-1/2 flex justify-between items-center">
                                <span className="truncate mr-2">feat: Implement card layout</span>
                                <span className="text-right whitespace-nowrap hidden sm:block">5 hours ago</span>
                            </div>
                        </Link>

                        {/* File Row */}
                        <Link
                            href={`/${username}/${repoName}/blob/main/ui/index.ts`}
                            className="flex items-center px-4 py-2.5 text-sm text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-primary/10 transition-colors group"
                        >
                            <div className="w-1/2 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                                <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary group-hover:underline">
                                    index.ts
                                </span>
                            </div>
                            <div className="w-1/2 flex justify-between items-center">
                                <span className="truncate mr-2">chore: Export all components</span>
                                <span className="text-right whitespace-nowrap hidden sm:block">2 hours ago</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
