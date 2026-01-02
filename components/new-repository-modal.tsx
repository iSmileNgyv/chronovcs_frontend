"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { CreateRepositoryRequestDto } from "@/types/repository-dto";

interface NewRepositoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (repoKey: string) => void;
}

export function NewRepositoryModal({ isOpen, onClose, onSuccess }: NewRepositoryModalProps) {
    const [formData, setFormData] = useState<CreateRepositoryRequestDto>({
        name: "",
        description: "",
        versioningMode: "project",
        privateRepo: true,
        defaultBranch: "main",
        releaseEnabled: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await repositoryService.createRepository(formData);
            onSuccess?.(response.key);
            onClose();
            // Reset form
            setFormData({
                name: "",
                description: "",
                versioningMode: "project",
                privateRepo: true,
                defaultBranch: "main",
                releaseEnabled: false,
            });
        } catch (err) {
            console.error("Failed to create repository:", err);
            setError(err instanceof Error ? err.message : "Failed to create repository.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg transform rounded-xl bg-component-bg-light dark:bg-component-bg-dark border border-border-light dark:border-border-dark shadow-xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-6 py-4">
                        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                            Create a new repository
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                        {/* Repository Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                            >
                                Repository name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                pattern="^[a-zA-Z0-9_-]+$"
                                title="Letters, numbers, underscores and hyphens only"
                                className="block w-full rounded-lg border-0 py-2 px-3 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-white dark:bg-component-secondary-bg-dark transition-all"
                                placeholder="my-awesome-project"
                            />
                            <p className="mt-1 text-xs text-secondary-text-light dark:text-secondary-text-dark">
                                Great repository names are short and memorable.
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                            >
                                Description <span className="text-secondary-text-light dark:text-secondary-text-dark">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2 px-3 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-white dark:bg-component-secondary-bg-dark transition-all resize-none"
                                placeholder="A short description of your repository"
                            />
                        </div>

                        {/* Visibility */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
                                Visibility
                            </label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-start gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={!formData.privateRepo}
                                        onChange={() => setFormData((p) => ({ ...p, privateRepo: false }))}
                                        className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-text-light dark:text-text-dark">
                                            Public
                                        </span>
                                        <span className="text-xs text-secondary-text-light dark:text-secondary-text-dark">
                                            Anyone can see this repository.
                                        </span>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-component-secondary-bg-light dark:hover:bg-component-secondary-bg-dark cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={formData.privateRepo}
                                        onChange={() => setFormData((p) => ({ ...p, privateRepo: true }))}
                                        className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-text-light dark:text-text-dark">
                                            Private
                                        </span>
                                        <span className="text-xs text-secondary-text-light dark:text-secondary-text-dark">
                                            Only you and people you invite can see this repository.
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <details className="group">
                            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark transition-colors">
                                <span>Advanced options</span>
                            </summary>
                            <div className="mt-3 space-y-3 pl-4 border-l-2 border-border-light dark:border-border-dark">
                                {/* Default Branch */}
                                <div>
                                    <label
                                        htmlFor="defaultBranch"
                                        className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                                    >
                                        Default branch
                                    </label>
                                    <input
                                        id="defaultBranch"
                                        name="defaultBranch"
                                        type="text"
                                        value={formData.defaultBranch}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-2 px-3 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-white dark:bg-component-secondary-bg-dark transition-all"
                                    />
                                </div>

                                {/* Versioning Mode */}
                                <div>
                                    <label
                                        htmlFor="versioningMode"
                                        className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                                    >
                                        Versioning mode
                                    </label>
                                    <select
                                        id="versioningMode"
                                        name="versioningMode"
                                        value={formData.versioningMode}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-0 py-2 px-3 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-white dark:bg-component-secondary-bg-dark transition-all"
                                    >
                                        <option value="project">Project</option>
                                        <option value="object">Object</option>
                                    </select>
                                </div>

                                {/* Release Enabled */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="releaseEnabled"
                                        checked={formData.releaseEnabled}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded text-primary focus:ring-primary border-border-light dark:border-border-dark"
                                    />
                                    <span className="text-sm text-text-light dark:text-text-dark">
                                        Enable releases
                                    </span>
                                </label>
                            </div>
                        </details>

                        {error && (
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-border-light dark:border-border-dark px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !formData.name}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Create repository
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
