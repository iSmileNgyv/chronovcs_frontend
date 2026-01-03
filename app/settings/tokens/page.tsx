"use client";

import React, { useState, useEffect } from "react";
import { Key, Plus, Copy, Check, Trash2, Shield, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth-service";
import { TokenSummaryDto } from "@/types/token-dto";
import { TokenPermissionsModal } from "@/components/token-permissions-modal";
import { ConfirmationModal } from "@/components/confirmation-modal";

export default function TokensPage() {
    const [tokens, setTokens] = useState<TokenSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [newToken, setNewToken] = useState<string | null>(null);
    const [permissionModalToken, setPermissionModalToken] = useState<{ id: number, name: string } | null>(null);

    // Revoke Confirmation State
    const [revokeTokenId, setRevokeTokenId] = useState<number | null>(null);
    const [isRevoking, setIsRevoking] = useState(false);

    const loadTokens = async () => {
        setIsLoading(true);
        try {
            const data = await authService.listTokens();
            setTokens(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to list tokens", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTokens();
    }, []);

    const confirmRevoke = (id: number) => {
        setRevokeTokenId(id);
    };

    const handleRevoke = async () => {
        if (revokeTokenId === null) return;

        setIsRevoking(true);
        try {
            await authService.revokeToken(revokeTokenId.toString());
            setTokens(prev => prev.map(t => t.id === revokeTokenId ? { ...t, revoked: true } : t));
            setRevokeTokenId(null);
        } catch (error) {
            console.error("Failed to revoke token", error);
            alert("Failed to revoke token");
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Access Tokens</h1>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark mt-1">
                        Manage Personal Access Tokens for CLI authentication.
                    </p>
                </div>
                <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Generate New Token
                </button>
            </div>

            {/* Token List */}
            <div className="border rounded-lg border-border-light dark:border-border-dark bg-component-bg-light dark:bg-component-bg-dark overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : tokens.length === 0 ? (
                    <div className="p-12 text-center text-secondary-text-light dark:text-secondary-text-dark">
                        <Key className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="mb-2 font-medium">No tokens found</p>
                        <p className="text-sm">Personal access tokens function like ordinary OAuth access tokens. They can be used instead of a password for Git over HTTPS.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {tokens.map(token => (
                            <div key={token.id} className="p-4 flex items-center justify-between hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                                <div>
                                    <h3 className="font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                                        {token.tokenName}
                                        {token.revoked && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded border border-red-200">Revoked</span>}
                                        {token.tokenPrefix && <span className="text-xs font-mono text-secondary-text-light dark:text-secondary-text-dark bg-gray-100 dark:bg-gray-800 px-1.5 rounded">{token.tokenPrefix}...</span>}
                                    </h3>
                                    <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">
                                        Created on {new Date(token.createdAt).toLocaleDateString()} • Expires {token.expiresAt ? new Date(token.expiresAt).toLocaleDateString() : 'Never'}
                                    </p>
                                </div>
                                {!token.revoked && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPermissionModalToken({ id: token.id, name: token.tokenName })}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-white dark:hover:bg-black/20 transition-colors text-text-light dark:text-text-dark"
                                        >
                                            <Shield className="w-3 h-3" />
                                            Permissions
                                        </button>
                                        <button
                                            onClick={() => confirmRevoke(token.id)}
                                            className="p-2 text-secondary-text-light dark:text-secondary-text-dark hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Revoke Token"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Generate Token Modal */}
            {isGenerateModalOpen && (
                <GenerateTokenModal
                    onClose={() => setIsGenerateModalOpen(false)}
                    onSuccess={(token) => {
                        setNewToken(token);
                        setIsGenerateModalOpen(false);
                        loadTokens();
                    }}
                />
            )}

            {/* New Token Result Modal */}
            {newToken && (
                <NewTokenDisplayModal
                    token={newToken}
                    onClose={() => setNewToken(null)}
                />
            )}

            {/* Permissions Modal */}
            {permissionModalToken && (
                <TokenPermissionsModal
                    tokenId={permissionModalToken.id}
                    tokenName={permissionModalToken.name}
                    isOpen={!!permissionModalToken}
                    onClose={() => setPermissionModalToken(null)}
                />
            )}

            {/* Revoke Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!revokeTokenId}
                onClose={() => setRevokeTokenId(null)}
                onConfirm={handleRevoke}
                title="Revoke Token?"
                message="Are you sure you want to revoke this token? Any script or application using it will immediately lose access. This action cannot be undone."
                confirmText="Revoke Token"
                variant="danger"
                isLoading={isRevoking}
            />
        </div>
    );
}

// ------ Sub Components (Inline for speed, can extract later) ------

function GenerateTokenModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (token: string) => void }) {
    const [name, setName] = useState("");
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.createToken({ tokenName: name, expiresInDays: days });
            onSuccess(res.rawToken);
        } catch (error) {
            console.error(error);
            alert("Failed to create token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-xl max-w-md w-full p-6 border border-border-light dark:border-border-dark transform scale-100 transition-all">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Generate New Token</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                            Token Note (Name)
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm text-text-light dark:text-text-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. My Laptop CLI"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
                            <option value={60}>60 days</option>
                            <option value={90}>90 days</option>
                            <option value={365}>1 year</option>
                            <option value={0}>No expiration (Not recommended)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Generate Token
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NewTokenDisplayModal({ token, onClose }: { token: string; onClose: () => void }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-xl max-w-lg w-full p-6 border border-border-light dark:border-border-dark transform scale-100 transition-all">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Token Generated!</h3>
                    <p className="text-secondary-text-light dark:text-secondary-text-dark mt-2 text-sm">
                        Make sure to copy your personal access token now. You won’t be able to see it again!
                    </p>
                </div>

                <div className="bg-component-secondary-bg-light dark:bg-black/30 border border-border-light dark:border-border-dark rounded-lg p-4 flex items-center gap-3 mb-6 relative group">
                    <code className="flex-1 font-mono text-primary text-sm break-all">
                        {token}
                    </code>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-secondary-text-light dark:text-secondary-text-dark hover:text-primary transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        I have copied it
                    </button>
                </div>
            </div>
        </div>
    );
}
