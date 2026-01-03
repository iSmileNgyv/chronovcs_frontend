"use client";

import React, { useState, useEffect } from "react";
import { FileViewer } from "@/components/file-viewer";
import { repositoryService } from "@/services/repository-service";
import { Loader2, AlertCircle } from "lucide-react";
import { TreeEntryDto } from "@/types/repository-dto";

interface BlobContentProps {
    username: string;
    repoName: string;
    branch: string;
    path: string;
}

export function BlobContent({ username, repoName, branch, path }: BlobContentProps) {
    const [content, setContent] = useState<string>("");
    const [fileInfo, setFileInfo] = useState<TreeEntryDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Get file metadata (SHA) via getTree
                // The backend returns a single entry list if the path matches a file
                const treeResponse = await repositoryService.getTree(repoName, branch, path);

                if (!treeResponse.entries || treeResponse.entries.length === 0) {
                    throw new Error("File not found");
                }

                // Find the exact file entry if multiple returned (unlikely for exact path, but safe check)
                // Actually CloneService logic returns the exact file as single entry if matched.
                // But let's look for the one matching the suffix of the path just in case.
                const filename = path.split('/').pop() || "";
                const entry = treeResponse.entries.find(e => e.path.endsWith(filename)) || treeResponse.entries[0];

                if (!entry || (entry.type !== "FILE" && entry.type !== "blob")) {
                    // If it's a directory, we shouldn't be here (or maybe redirected)
                    throw new Error("Not a file");
                }

                setFileInfo(entry);

                // 2. Fetch content using SHA
                if (entry.blobHash) {
                    const blobContent = await repositoryService.getBlob(repoName, entry.blobHash);
                    setContent(blobContent);
                } else {
                    throw new Error("File SHA not found");
                }

            } catch (err: any) {
                console.error("Failed to fetch file:", err);
                setError(err.message || "Failed to load file content");
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [repoName, branch, path]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-secondary-text-light dark:text-secondary-text-dark">Loading file content...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                <AlertCircle className="w-10 h-10 mb-4" />
                <h3 className="text-lg font-semibold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!fileInfo) return null;

    // Detect language from extension
    const ext = fileInfo.path.split('.').pop()?.toLowerCase() || "text";
    const languageMap: Record<string, string> = {
        ts: "typescript",
        tsx: "tsx",
        js: "javascript",
        jsx: "jsx",
        py: "python",
        java: "java",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
        yml: "yaml",
        yaml: "yaml",
        xml: "xml",
        sql: "sql",
        sh: "bash",
        bash: "bash",
        go: "go",
        rs: "rust",
        php: "php"
    };

    const language = languageMap[ext] || "text";

    // Calculate size: use fileInfo.size if available, otherwise calculate from content
    const byteSize = fileInfo.size || new Blob([content]).size;
    const sizeStr = byteSize < 1024 ? `${byteSize} B` : `${(byteSize / 1024).toFixed(1)} KB`;
    // Count lines roughly
    const lineCount = content.split('\n').length;

    return (
        <FileViewer
            filename={fileInfo.path}
            content={content}
            language={language}
            size={sizeStr}
            lines={lineCount}
        />
    );
}
