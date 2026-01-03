"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Lock, Globe, AlertCircle } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { RepositorySettingsResponseDto, UpdateRepositoryInfoRequestDto, RepositoryInfoDto } from "@/types/repository-dto";

interface Props {
    repoKey: string;
    initialSettings: RepositorySettingsResponseDto;
    repoInfo: RepositoryInfoDto;
    onUpdate: () => void;
}

export function GeneralSettings({ repoKey, initialSettings, repoInfo, onUpdate }: Props) {
    // Initialize form with repoInfo since we are using the /info endpoint as the source of truth
    const [formData, setFormData] = useState<UpdateRepositoryInfoRequestDto>({
        name: repoInfo.name || "",
        description: repoInfo.description || "",
        privateRepo: repoInfo.privateRepo,
        defaultBranch: repoInfo.defaultBranch || "main",
    });

    // Sync state if props change
    useEffect(() => {
        setFormData({
            name: repoInfo.name || "",
            description: repoInfo.description || "",
            privateRepo: repoInfo.privateRepo,
            defaultBranch: repoInfo.defaultBranch || "main",
        });
    }, [repoInfo]);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const checkHasChanges = () => {
        return (
            formData.name !== repoInfo.name ||
            formData.description !== (repoInfo.description || "") ||
            formData.privateRepo !== repoInfo.privateRepo ||
            formData.defaultBranch !== repoInfo.defaultBranch
        );
    };

    const hasChanges = checkHasChanges();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        try {
            await repositoryService.updateRepositoryInfo(repoKey, formData);
            setSuccessMessage("Repository settings updated successfully.");
            onUpdate(); // Trigger parent refresh
        } catch (err: any) {
            console.error(err);
            setError("Failed to update repository settings: " + (err.message || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">General Settings</h3>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                    Manage your repository details and visibility.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Read-Only Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark rounded-lg border border-border-light dark:border-border-dark">
                    <div>
                        <span className="block text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider mb-1">
                            Versioning Mode
                        </span>
                        <div className="text-sm font-medium text-text-light dark:text-text-dark capitalize">
                            {repoInfo.versioningMode}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider mb-1">
                            Created At
                        </span>
                        <div className="text-sm text-text-light dark:text-text-dark">
                            {new Date(repoInfo.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider mb-1">
                            Last Updated
                        </span>
                        <div className="text-sm text-text-light dark:text-text-dark">
                            {new Date(repoInfo.updatedAt).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-secondary-text-light dark:text-secondary-text-dark uppercase tracking-wider mb-1">
                            Release Enabled
                        </span>
                        <div className="text-sm text-text-light dark:text-text-dark flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${repoInfo.releaseEnabled ? "bg-green-500" : "bg-gray-400"}`} />
                            {repoInfo.releaseEnabled ? "Yes" : "No"}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border-light dark:bg-border-dark" />

                {/* Repository Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-light dark:text-text-dark">
                        Repository Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full max-w-md px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-gray-900 dark:text-text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="my-awesome-repo"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-text-light dark:text-text-dark">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full max-w-xl px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-secondary-bg-light dark:bg-component-secondary-bg-dark text-gray-900 dark:text-text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        placeholder="A short description of your repository..."
                    />
                </div>

                {/* Visibility */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-text-light dark:text-text-dark">
                        Visibility
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        {/* Public Option */}
                        <div
                            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${!formData.privateRepo
                                ? "border-primary bg-primary/5"
                                : "border-border-light dark:border-border-dark hover:border-border-light/80"
                                }`}
                            onClick={() => setFormData(prev => ({ ...prev, privateRepo: false }))}
                        >
                            <Globe className={`w-5 h-5 mt-0.5 ${!formData.privateRepo ? "text-primary" : "text-secondary-text-light dark:text-secondary-text-dark"}`} />
                            <div>
                                <p className={`font-bold text-sm ${!formData.privateRepo ? "text-primary" : "text-text-light dark:text-text-dark"}`}>Public</p>
                                <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">
                                    Anyone on the internet can see this repository. You choose who can commit.
                                </p>
                            </div>
                        </div>

                        {/* Private Option */}
                        <div
                            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.privateRepo
                                ? "border-primary bg-primary/5"
                                : "border-border-light dark:border-border-dark hover:border-border-light/80"
                                }`}
                            onClick={() => setFormData(prev => ({ ...prev, privateRepo: true }))}
                        >
                            <Lock className={`w-5 h-5 mt-0.5 ${formData.privateRepo ? "text-primary" : "text-secondary-text-light dark:text-secondary-text-dark"}`} />
                            <div>
                                <p className={`font-bold text-sm ${formData.privateRepo ? "text-primary" : "text-text-light dark:text-text-dark"}`}>Private</p>
                                <p className="text-xs text-secondary-text-light dark:text-secondary-text-dark mt-1">
                                    You choose who can see and commit to this repository.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                {successMessage && (
                    <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-end">
                    <button
                        type="submit"
                        disabled={!hasChanges || isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
