"use client";

import React, { useState } from "react";
import { FileDiff } from "@/types/repository-dto";
import { ChevronDown, ChevronRight, File, FileCode } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface DiffViewerProps {
    diffs: FileDiff[];
}

export function DiffViewer({ diffs }: DiffViewerProps) {
    if (!diffs || diffs.length === 0) {
        return <div className="text-center p-8 text-secondary-text-light dark:text-secondary-text-dark">No changes found.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {diffs.map((file, index) => (
                <FileDiffCard key={index} file={file} />
            ))}
        </div>
    );
}

function FileDiffCard({ file }: { file: FileDiff }) {
    const [collapsed, setCollapsed] = useState(false);
    const { resolvedTheme } = useTheme();

    // Determine filename to display
    // If RENAMED, show old -> new?
    const displayName = file.changeType === 'RENAMED'
        ? `${file.oldPath} → ${file.newPath}`
        : (file.newPath || file.oldPath || "Unknown file");

    const isBinary = file.binary;

    return (
        <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark overflow-hidden">
            {/* Header */}
            <div
                className="bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-4 py-2 border-b border-border-light dark:border-border-dark flex items-center justify-between cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="flex items-center gap-2">
                    <button className="text-secondary-text-light dark:text-secondary-text-dark">
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-sm font-medium text-text-light dark:text-text-dark">{displayName}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded border border-border-light dark:border-border-dark text-secondary-text-light dark:text-secondary-text-dark">
                        {file.changeType}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-green-500">+{file.linesAdded}</span>
                    <span className="text-red-500">-{file.linesDeleted}</span>
                </div>
            </div>

            {/* Content */}
            {!collapsed && (
                <div className="text-xs overflow-x-auto">
                    {isBinary ? (
                        <div className="p-8 text-center text-secondary-text-light dark:text-secondary-text-dark italic">
                            Binary file not shown.
                        </div>
                    ) : file.patch ? (
                        <SyntaxHighlighter
                            language="diff"
                            style={resolvedTheme === "dark" ? oneDark : oneLight}
                            showLineNumbers={true} // Line numbers for diff are tricky as they differ for +/-. SyntaxHighlighter just counts lines of patch.
                            // Better than nothing.
                            customStyle={{
                                margin: 0,
                                padding: "1rem",
                                background: "transparent",
                                fontSize: "0.80rem", // slightly smaller for diffs
                            }}
                        >
                            {file.patch}
                        </SyntaxHighlighter>
                    ) : (
                        <div className="p-8 text-center text-secondary-text-light dark:text-secondary-text-dark italic">
                            No content changes (maybe empty file or type change only).
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
