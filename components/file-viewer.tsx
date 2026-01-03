"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Copy, FileText, Monitor, Check, Code, BookOpen } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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
    const [copied, setCopied] = React.useState(false);

    // Markdown handling
    const isMarkdown = language === 'markdown';
    const [viewMode, setViewMode] = React.useState<'code' | 'preview'>('code');

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Switch to preview by default if it's markdown
    React.useEffect(() => {
        if (isMarkdown) {
            setViewMode('preview');
        } else {
            setViewMode('code');
        }
    }, [isMarkdown, filename]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                    {/* Markdown Toggle */}
                    {isMarkdown && (
                        <div className="flex items-center bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark rounded-lg p-0.5 mr-2">
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'preview' ? 'bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark shadow-sm' : 'text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark'}`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Preview</span>
                            </button>
                            <button
                                onClick={() => setViewMode('code')}
                                className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'code' ? 'bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-text-light dark:text-text-dark shadow-sm' : 'text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark'}`}
                            >
                                <Code className="w-3.5 h-3.5" />
                                <span>Code</span>
                            </button>
                        </div>
                    )}

                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-light dark:text-text-dark bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors opacity-50 cursor-not-allowed" title="Raw view not implemented yet">
                        <Monitor className="w-4 h-4" />
                        <span className="hidden sm:inline">Raw</span>
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-light dark:text-text-dark bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                    </button>
                </div>
            </div>

            {/* Code Viewer */}
            <div className={`text-sm ${viewMode === 'preview' && isMarkdown ? 'p-8 bg-component-bg-light dark:bg-component-bg-dark' : ''}`}>
                {viewMode === 'preview' && isMarkdown ? (
                    <MarkdownRenderer content={content} />
                ) : (
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
                )}
            </div>
        </div>
    );
}
