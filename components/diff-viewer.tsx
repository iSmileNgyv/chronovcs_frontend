"use client";

import React from "react";
import { Plus, Minus, FileText } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { FileDiff, DiffStats } from "@/types/diff-dto";

interface DiffViewerProps {
    files: FileDiff[];
    stats: DiffStats;
}

const getLanguageFromPath = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase() || "";
    const languageMap: Record<string, string> = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        rb: "ruby",
        java: "java",
        go: "go",
        rs: "rust",
        c: "c",
        cpp: "cpp",
        h: "c",
        hpp: "cpp",
        cs: "csharp",
        php: "php",
        swift: "swift",
        kt: "kotlin",
        scala: "scala",
        sh: "bash",
        bash: "bash",
        zsh: "bash",
        json: "json",
        yaml: "yaml",
        yml: "yaml",
        xml: "xml",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        md: "markdown",
        sql: "sql",
        graphql: "graphql",
    };
    return languageMap[ext] || "text";
};

const getStatusColor = (status: FileDiff["status"]) => {
    switch (status) {
        case "added":
            return "text-green-500";
        case "deleted":
            return "text-red-500";
        case "modified":
            return "text-yellow-500";
        case "renamed":
            return "text-blue-500";
        default:
            return "text-secondary-text-light dark:text-secondary-text-dark";
    }
};

const getStatusLabel = (status: FileDiff["status"]) => {
    switch (status) {
        case "added":
            return "Added";
        case "deleted":
            return "Deleted";
        case "modified":
            return "Modified";
        case "renamed":
            return "Renamed";
        default:
            return status;
    }
};

export function DiffViewer({ files, stats }: DiffViewerProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div className="space-y-4">
            {/* Stats Summary */}
            <div className="flex items-center gap-4 text-sm text-secondary-text-light dark:text-secondary-text-dark">
                <span>{stats.filesChanged} file{stats.filesChanged !== 1 ? "s" : ""} changed</span>
                <span className="flex items-center gap-1 text-green-500">
                    <Plus className="w-4 h-4" />
                    {stats.additions}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                    <Minus className="w-4 h-4" />
                    {stats.deletions}
                </span>
            </div>

            {/* File List */}
            {files.map((file, index) => (
                <div
                    key={file.path}
                    className="border border-border-light dark:border-border-dark rounded-lg overflow-hidden"
                >
                    {/* File Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark border-b border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-secondary-text-light dark:text-secondary-text-dark" />
                            <span className="font-mono text-sm text-text-light dark:text-text-dark">
                                {file.oldPath && file.oldPath !== file.path ? (
                                    <>
                                        <span className="text-red-500 line-through">{file.oldPath}</span>
                                        <span className="mx-2">→</span>
                                        <span>{file.path}</span>
                                    </>
                                ) : (
                                    file.path
                                )}
                            </span>
                            <span
                                className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(file.status)}`}
                            >
                                {getStatusLabel(file.status)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-green-500">+{file.additions}</span>
                            <span className="text-red-500">-{file.deletions}</span>
                        </div>
                    </div>

                    {/* Diff Content */}
                    {file.binary ? (
                        <div className="px-4 py-8 text-center text-secondary-text-light dark:text-secondary-text-dark">
                            Binary file not shown
                        </div>
                    ) : file.patch ? (
                        <div className="overflow-x-auto">
                            <DiffPatch patch={file.patch} language={getLanguageFromPath(file.path)} isDark={isDark} />
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-secondary-text-light dark:text-secondary-text-dark">
                            No changes to display
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

interface DiffPatchProps {
    patch: string;
    language: string;
    isDark: boolean;
}

function DiffPatch({ patch, language, isDark }: DiffPatchProps) {
    const lines = patch.split("\n");

    return (
        <table className="w-full text-sm font-mono">
            <tbody>
                {lines.map((line, index) => {
                    let bgColor = "";
                    let textColor = "text-text-light dark:text-text-dark";
                    let linePrefix = " ";

                    if (line.startsWith("+") && !line.startsWith("+++")) {
                        bgColor = "bg-green-500/10";
                        textColor = "text-green-600 dark:text-green-400";
                        linePrefix = "+";
                    } else if (line.startsWith("-") && !line.startsWith("---")) {
                        bgColor = "bg-red-500/10";
                        textColor = "text-red-600 dark:text-red-400";
                        linePrefix = "-";
                    } else if (line.startsWith("@@")) {
                        bgColor = "bg-blue-500/10";
                        textColor = "text-blue-600 dark:text-blue-400";
                    }

                    return (
                        <tr key={index} className={bgColor}>
                            <td className="px-2 py-0.5 text-right text-secondary-text-light dark:text-secondary-text-dark select-none w-10 border-r border-border-light dark:border-border-dark">
                                {index + 1}
                            </td>
                            <td className={`px-2 py-0.5 w-4 ${textColor} select-none`}>
                                {linePrefix}
                            </td>
                            <td className={`px-2 py-0.5 ${textColor} whitespace-pre`}>
                                {line.startsWith("+") || line.startsWith("-")
                                    ? line.substring(1)
                                    : line}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
