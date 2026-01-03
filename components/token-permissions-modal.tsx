"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Shield, Check, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth-service";
import { TokenPermissionDto } from "@/types/token-dto";
import { repositoryService } from "@/services/repository-service";
import { RepositoryInfoDto } from "@/types/repository-dto";
import { ConfirmationModal } from "@/components/confirmation-modal";

interface Props {
    tokenId: number;
    tokenName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function TokenPermissionsModal({ tokenId, tokenName, isOpen, onClose }: Props) {
    const [permissions, setPermissions] = useState<TokenPermissionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [repositories, setRepositories] = useState<RepositoryInfoDto[]>([]);

    // Form state
    const [selectedRepo, setSelectedRepo] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [permissionFlags, setPermissionFlags] = useState({
        canRead: true,
        canPull: true,
        canPush: false,
        canCreateBranch: false,
        canDeleteBranch: false,
        canMerge: false,
        canCreateTag: false,
        canDeleteTag: false,
        canManageRepo: false,
        canBypassTaskPolicy: false,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Delete Confirmation State
    const [deleteRepoKey, setDeleteRepoKey] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && tokenId) {
            loadData();
        }
    }, [isOpen, tokenId]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [perms, repos] = await Promise.all([
                authService.listTokenPermissions(tokenId.toString()),
                repositoryService.listRepositories()
            ]);
            setPermissions(perms);
            setRepositories(Array.isArray(repos) ? repos : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load permissions");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedRepo) return;

        setIsSaving(true);
        try {
            await authService.upsertTokenPermission(tokenId.toString(), selectedRepo, permissionFlags);
            await loadData(); // Refresh list
            resetForm();
        } catch (err) {
            console.error(err);
            setError("Failed to save permission");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = (repoKey: string) => {
        setDeleteRepoKey(repoKey);
    };

    const handleDelete = async () => {
        if (!deleteRepoKey) return;

        setIsDeleting(true);
        try {
            await authService.deleteTokenPermission(tokenId.toString(), deleteRepoKey);
            setPermissions(prev => prev.filter(p => p.repoKey !== deleteRepoKey));
            setDeleteRepoKey(null);
        } catch (err) {
            console.error(err);
            setError("Failed to remove permission");
        } finally {
            setIsDeleting(false);
        }
    };

    const resetForm = () => {
        setSelectedRepo("");
        setIsEditing(false);
        setPermissionFlags({
            canRead: true, canPull: true, canPush: false, canCreateBranch: false,
            canDeleteBranch: false, canMerge: false, canCreateTag: false,
            canDeleteTag: false, canManageRepo: false, canBypassTaskPolicy: false
        });
    };

    const toggleFlag = (key: keyof typeof permissionFlags) => {
        setPermissionFlags(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    // Filter out repos clearly already having permissions if creating new
    const availableRepos = repositories.filter(r =>
        !permissions.find(p => p.repoKey === (r.key || r.name))
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-border-light dark:border-border-dark">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
                    <div>
                        <h2 className="text-xl font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Manage Permissions
                        </h2>
                        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                            Control repository access for token: <span className="font-semibold text-text-light dark:text-text-dark">{tokenName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark rounded-lg">
                        <X className="w-5 h-5 text-secondary-text-light dark:text-secondary-text-dark" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* Left: Permission List */}
                    <div className="flex-1 overflow-y-auto p-6 border-r border-border-light dark:border-border-dark">
                        <h3 className="text-sm font-bold text-text-light dark:text-text-dark mb-4 uppercase tracking-wider">
                            Active Permissions
                        </h3>

                        {isLoading ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : permissions.length === 0 ? (
                            <div className="text-center py-8 text-secondary-text-light dark:text-secondary-text-dark text-sm border-2 border-dashed border-border-light dark:border-border-dark rounded-lg">
                                No specific permissions set.<br />The token has no access to any repository.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {permissions.map(perm => (
                                    <div key={perm.repoKey} className="p-3 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark rounded-lg border border-border-light dark:border-border-dark">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-text-light dark:text-text-dark">{perm.repoKey}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRepo(perm.repoKey);
                                                        setPermissionFlags({
                                                            canRead: perm.canRead, canPull: perm.canPull, canPush: perm.canPush,
                                                            canCreateBranch: perm.canCreateBranch, canDeleteBranch: perm.canDeleteBranch,
                                                            canMerge: perm.canMerge, canCreateTag: perm.canCreateTag,
                                                            canDeleteTag: perm.canDeleteTag, canManageRepo: perm.canManageRepo,
                                                            canBypassTaskPolicy: perm.canBypassTaskPolicy
                                                        });
                                                        setIsEditing(true);
                                                    }}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(perm.repoKey)}
                                                    className="text-secondary-text-light dark:text-secondary-text-dark hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(perm).map(([key, val]) => {
                                                if (key.startsWith('can') && val === true) {
                                                    return (
                                                        <span key={key} className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-white dark:bg-black/20 rounded border border-border-light dark:border-border-dark text-secondary-text-light dark:text-secondary-text-dark">
                                                            {key.replace('can', '')}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:border-primary hover:text-primary transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Repository Permission
                            </button>
                        )}
                    </div>

                    {/* Right: Editor Form */}
                    {isEditing && (
                        <div className="w-full md:w-[400px] flex flex-col bg-component-bg-light dark:bg-component-bg-dark p-6">
                            <h3 className="text-sm font-bold text-text-light dark:text-text-dark mb-4">
                                {selectedRepo && permissions.find(p => p.repoKey === selectedRepo) ? `Edit: ${selectedRepo}` : "New Permission"}
                            </h3>

                            <div className="space-y-4 flex-1 overflow-y-auto">
                                {!permissions.find(p => p.repoKey === selectedRepo) && (
                                    <div>
                                        <label className="block text-xs font-bold text-secondary-text-light dark:text-secondary-text-dark uppercase mb-1">Repository</label>
                                        <select
                                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark px-3 py-2 text-sm outline-none"
                                            value={selectedRepo}
                                            onChange={(e) => setSelectedRepo(e.target.value)}
                                            disabled={!!(selectedRepo && permissions.find(p => p.repoKey === selectedRepo))}
                                        >
                                            <option value="">Select a repository...</option>
                                            {availableRepos.map(repo => (
                                                <option key={repo.id} value={repo.key || repo.name}>{repo.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-secondary-text-light dark:text-secondary-text-dark uppercase mb-1">Access Levels</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.entries(permissionFlags).map(([key, val]) => (
                                            <label key={key} className="flex items-center gap-3 p-2 rounded hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer transition-colors">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${val ? 'bg-primary border-primary' : 'border-border-light dark:border-border-dark'}`}>
                                                    {val && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={val}
                                                    onChange={() => toggleFlag(key as keyof typeof permissionFlags)}
                                                />
                                                <span className="text-sm text-text-light dark:text-text-dark">{key.replace('can', '')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-border-light dark:border-border-dark">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark rounded-lg transition-colors flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedRepo || isSaving}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center gap-2 flex-1 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={!!deleteRepoKey}
                    onClose={() => setDeleteRepoKey(null)}
                    onConfirm={handleDelete}
                    title="Remove Permissions?"
                    message={`Are you sure you want to remove permissions for ${deleteRepoKey}? The token will lose all access to this repository.`}
                    confirmText="Remove"
                    variant="danger"
                    isLoading={isDeleting}
                />
            </div>
        </div>
    );
}
