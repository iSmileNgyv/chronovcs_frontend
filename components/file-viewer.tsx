"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Copy, FileText, Monitor } from "lucide-react";

interface FileViewerProps {
    filename: string;
    content: string;
    language: string;
    size: string;
    lines: number;
}

export function FileViewer({ filename, content, language, size, lines }: FileViewerProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark mt-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark">
                <div className="flex items-center gap-2 text-sm text-text-light dark:text-text-dark">
                    <span className="font-mono font-medium">{lines} lines</span>
                    <span className="text-secondary-text-light dark:text-secondary-text-dark">|</span>
                    <span className="font-mono font-medium">{size}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-light dark:text-text-dark bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                        <Monitor className="w-4 h-4" />
                        <span className="hidden sm:inline">Raw</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-light dark:text-text-dark bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                    </button>
                </div>
            </div>

            {/* Code Viewer */}
            <div className="text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={resolvedTheme === "dark" ? oneDark : oneLight}
                    showLineNumbers={true}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                    }}
                    codeTagProps={{
                        style: {
                            background: "transparent",
                        },
                    }}
                    lineNumberStyle={{
                        minWidth: "3em",
                        paddingRight: "1em",
                        color: resolvedTheme === "dark" ? "#4b5563" : "#9ca3af",
                        textAlign: "right",
                    }}
                >
                    {content}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
