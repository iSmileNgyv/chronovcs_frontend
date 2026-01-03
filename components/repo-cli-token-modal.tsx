"use client";

import React, { useState } from "react";
import { Copy, Terminal, Check, Info } from "lucide-react";
import { CreateTokenRequest } from "@/types/auth-dto";
import { repositoryService } from "@/services/repository-service";
import { CliTokenResponseDto } from "@/types/repository-dto";

interface Props {
    repoKey: string;
    isOpen: boolean;
    onClose: () => void;
}

export function RepoCliTokenModal({ repoKey, isOpen, onClose }: Props) {
    const [step, setStep] = useState<"form" | "result">("form");
    const [tokenName, setTokenName] = useState("");
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CliTokenResponseDto | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await repositoryService.createCliToken(repoKey, {
                tokenName: tokenName || `CLI-${repoKey}`,
                expiresInDays: days
            });
            setResult(res);
            setStep("result");
        } catch (error) {
            console.error(error);
            alert("Failed to generate token");
        } finally {
            setLoading(false);
        }
    };

    const copyToken = () => {
        if (result?.token.rawToken) {
            navigator.clipboard.writeText(result.token.rawToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-xl max-w-lg w-full p-6 border border-border-light dark:border-border-dark">
                {step === "form" ? (
                    <>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Web Terminal Access</h3>
                                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">Create a CLI token for this repository</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                    Token Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    placeholder={`e.g. CLI-${repoKey}`}
                                    value={tokenName}
                                    onChange={e => setTokenName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                                    Expiration
                                </label>
                                <select
                                    className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm text-text-light dark:text-text-dark outline-none"
                                    value={days}
                                    onChange={e => setDays(Number(e.target.value))}
                                >
                                    <option value={7}>7 days</option>
                                    <option value={30}>30 days</option>
                                    <option value={90}>90 days</option>
                                    <option value={365}>1 year</option>
                                </select>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>This token allows read/write access to this specific repository based on your current permissions.</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2">
                                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    Generate
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Token Generated!</h3>
                            <p className="text-secondary-text-light dark:text-secondary-text-dark mt-2 text-sm">Use this token as your password for CLI operations.</p>
                        </div>

                        <div className="bg-component-secondary-bg-light dark:bg-black/30 border border-border-light dark:border-border-dark rounded-lg p-3 flex items-center gap-3 mb-2">
                            <code className="flex-1 font-mono text-primary text-sm break-all">{result?.token.rawToken}</code>
                            <button onClick={copyToken} className="p-2 text-secondary-text-light dark:text-secondary-text-dark hover:text-primary">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="text-left text-xs text-secondary-text-light dark:text-secondary-text-dark space-y-2 mt-4 border-t border-border-light dark:border-border-dark pt-4">
                            <p className="font-semibold text-text-light dark:text-text-dark">Active Permissions:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(result?.permissions || {}).map(([key, val]) => (
                                    val && <span key={key} className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" /> {key.replace('can', '')}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button onClick={onClose} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">Done</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
