"use client";

import React, { useState, useEffect } from "react";
import { Shield, Check, X, AlertCircle, Plus, Trash2, Edit2, Loader2, Save } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import {
    HandshakePermissionDto,
    RepoPermissionResponseDto,
    EffectivePermissionResponseDto,
    RepoPermissionUpdateRequestDto
} from "@/types/repository-dto";

interface Props {
    repoKey: string;
    ownerUid?: string;
}

const PERMISSION_KEYS: (keyof HandshakePermissionDto)[] = [
    'canRead', 'canPull', 'canPush', 'canCreateBranch', 'canDeleteBranch',
    'canMerge', 'canCreateTag', 'canDeleteTag', 'canManageRepo', 'canBypassTaskPolicy'
];

const PERMISSION_LABELS: Record<keyof HandshakePermissionDto, string> = {
    canRead: 'Read',
    canPull: 'Pull',
    canPush: 'Push',
    canCreateBranch: 'Create Branch',
    canDeleteBranch: 'Delete Branch',
    canMerge: 'Merge',
    canCreateTag: 'Create Tag',
    canDeleteTag: 'Delete Tag',
    canManageRepo: 'Manage Repo',
    canBypassTaskPolicy: 'Bypass Policy'
};

import { ToastNotification, ToastType } from "@/components/toast-notification";

interface EditingPermissionState {
    id?: string;
    userEmail?: string;
    userUid?: string;
    permissions?: Partial<HandshakePermissionDto>;
}

export function PermissionsSettings({ repoKey, ownerUid }: Props) {
    const [effective, setEffective] = useState<EffectivePermissionResponseDto | null>(null);
    const [permissionsList, setPermissionsList] = useState<RepoPermissionResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState<EditingPermissionState | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [effData, listData] = await Promise.all([
                repositoryService.getEffectivePermissions(repoKey),
                repositoryService.listPermissions(repoKey)
            ]);
            setEffective(effData);
            setPermissionsList(listData);
        } catch (err) {
            console.error(err);
            setError("Failed to load permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [repoKey]);

    const handleSave = async () => {
        if (!editingUser?.userEmail && !editingUser?.userUid) return;
        setIsSaving(true);
        try {
            // Flatten the permissions for the API request
            const payload: RepoPermissionUpdateRequestDto = {
                userEmail: editingUser.userEmail,
                userUid: editingUser.userUid,
                ...editingUser.permissions
            };

            await repositoryService.upsertPermission(repoKey, payload);
            setEditingUser(null);
            setIsEditing(false);
            setToast({ message: "Permissions saved successfully", type: "success" });
            fetchData();
        } catch (err: any) {
            console.error(err);
            setToast({ message: "Failed to save permission: " + err.message, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (email: string, uid: string) => {
        if (!confirm("Are you sure you want to remove permissions for this user?")) return;
        try {
            await repositoryService.deletePermission(repoKey, email, uid);
            setToast({ message: "Permission removed successfully", type: "success" });
            fetchData();
        } catch (err: any) {
            console.error(err);
            setToast({ message: "Failed to delete permission: " + err.message, type: "error" });
        }
    };

    // Define DEFAULT_PERMISSIONS inside the component for now, as per instruction
    const DEFAULT_PERMISSIONS: HandshakePermissionDto = {
        canRead: false,
        canPull: false,
        canPush: false,
        canCreateBranch: false,
        canDeleteBranch: false,
        canMerge: false,
        canCreateTag: false,
        canDeleteTag: false,
        canManageRepo: false,
        canBypassTaskPolicy: false
    };

    const startEdit = (perm: RepoPermissionResponseDto) => {
        setEditingUser({
            id: perm.userUid, // Use UID as ID for edit mode (disables email/uid inputs)
            userEmail: perm.userEmail,
            userUid: perm.userUid,
            permissions: {
                canRead: perm.canRead,
                canPull: perm.canPull,
                canPush: perm.canPush,
                canCreateBranch: perm.canCreateBranch,
                canDeleteBranch: perm.canDeleteBranch,
                canMerge: perm.canMerge,
                canCreateTag: perm.canCreateTag,
                canDeleteTag: perm.canDeleteTag,
                canManageRepo: perm.canManageRepo,
                canBypassTaskPolicy: perm.canBypassTaskPolicy
            }
        });
        setIsEditing(true);
    };

    const startNew = () => {
        setEditingUser({
            userEmail: "",
            userUid: "",
            permissions: {
                ...DEFAULT_PERMISSIONS,
                canRead: true,
                canPull: true
            }
        });
        setIsEditing(true);
    };

    const togglePermission = (key: keyof HandshakePermissionDto) => {
        if (!editingUser || !editingUser.permissions) return;
        setEditingUser({
            ...editingUser,
            permissions: {
                ...editingUser.permissions,
                [key]: !editingUser.permissions[key]
            }
        });
    };

    if (isLoading && !effective) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Effective Permissions Banner */}
            {effective && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-4">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Your Effective Permissions</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 mb-2">
                            Source: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">{effective.source}</span>
                            {effective.tokenId && <span> (Token: {effective.tokenId})</span>}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {PERMISSION_KEYS.map(key => effective.permissions[key] && (
                                <span key={key} className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                                    {PERMISSION_LABELS[key]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* User Permissions List */}
            <div className="bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-text-light dark:text-text-dark">User Permissions</h3>
                        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                            Manage access for other users.
                        </p>
                    </div>
                    <button
                        onClick={startNew}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                </div>

                <div className="divide-y divide-border-light dark:divide-border-dark">
                    {permissionsList.length === 0 ? (
                        <div className="p-8 text-center text-secondary-text-light dark:text-secondary-text-dark">
                            No explicit user permissions configured.
                        </div>
                    ) : (
                        permissionsList.map((perm, index) => {
                            const isOwner = ownerUid && perm.userUid === ownerUid;
                            return (
                                <div key={perm.userUid || index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-text-light dark:text-text-dark">{perm.userEmail}</span>
                                            <span className="text-xs font-mono text-secondary-text-light dark:text-secondary-text-dark">({perm.userUid})</span>
                                            {isOwner && (
                                                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary rounded-full border border-primary/20">
                                                    Owner
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {isOwner ? (
                                                <span className="text-xs text-secondary-text-light dark:text-secondary-text-dark italic">Full Access (Repository Owner)</span>
                                            ) : (
                                                PERMISSION_KEYS.map(key => perm[key] && (
                                                    <span key={key} className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                                        {PERMISSION_LABELS[key]}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    {!isOwner && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => startEdit(perm)}
                                                className="p-2 text-secondary-text-light dark:text-secondary-text-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(perm.userEmail, perm.userUid)}
                                                className="p-2 text-secondary-text-light dark:text-secondary-text-dark hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Edit Modal / Form */}
            {isEditing && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-component-bg-light dark:bg-component-bg-dark rounded-xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                                {editingUser.id ? "Edit Permission" : "Add Permission"}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-light dark:text-text-dark">User Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.userEmail}
                                        onChange={e => setEditingUser({ ...editingUser, userEmail: e.target.value })}
                                        placeholder="user@example.com"
                                        className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-gray-900 dark:text-text-dark"
                                        disabled={!!editingUser.id} // Disable email edit for existing
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-light dark:text-text-dark">User UID (Optional if Email provided)</label>
                                    <input
                                        type="text"
                                        value={editingUser.userUid}
                                        onChange={e => setEditingUser({ ...editingUser, userUid: e.target.value })}
                                        placeholder="UID123..."
                                        className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-gray-900 dark:text-text-dark"
                                        disabled={!!editingUser.id}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-light dark:text-text-dark block">Capabilities</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PERMISSION_KEYS.map(key => (
                                        <button
                                            key={key}
                                            onClick={() => togglePermission(key)}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${editingUser.permissions?.[key]
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-secondary-text-light dark:text-secondary-text-dark hover:border-gray-400"
                                                }`}
                                        >
                                            <span className="text-sm font-medium">{PERMISSION_LABELS[key]}</span>
                                            {editingUser.permissions?.[key] && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark border-t border-border-light dark:border-border-dark flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || (!editingUser.userEmail && !editingUser.userUid)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Permissions
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
