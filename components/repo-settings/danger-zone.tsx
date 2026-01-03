"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { repositoryService } from "@/services/repository-service";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { useRouter } from "next/navigation";

interface Props {
    repoKey: string;
    username: string;
}

export function DangerZone({ repoKey, username }: Props) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await repositoryService.deleteRepository(repoKey);
            // Redirect to user profile or dashboard after deletion
            router.push(`/${username}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to delete repository");
            setIsDeleting(false); // Only stop loading if failed, otherwise we redirect
        } finally {
            if (error) {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="mt-8 border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-900/50">
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">
                    Irreversible actions for this repository.
                </p>
            </div>

            <div className="p-6 bg-component-bg-light dark:bg-component-bg-dark">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-text-light dark:text-text-dark">Delete this repository</h4>
                        <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark mt-1">
                            Once you delete a repository, there is no going back. Please be certain.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                    >
                        Delete Repository
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                        Error: {error}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Repository?"
                message={`Are you absolutely sure you want to delete ${repoKey}? This action cannot be undone.`}
                confirmText="Delete this repository"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
