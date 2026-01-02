"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
    const { register, isAuthenticated, user: authUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated && authUser) {
            router.push(`/${authUser.username || authUser.email?.split("@")[0]}`);
        }
    }, [isAuthenticated, authUser, router, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = (): string | null => {
        if (formData.password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }
        if (formData.displayName.length < 2) {
            return "Display name must be at least 2 characters long.";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            await register(formData.email, formData.password, formData.displayName);
            // Redirect handled by auth provider
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show register if checking auth
    if (authLoading) {
        return (
            <div className="flex min-h-full flex-1 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-display">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center gap-2 text-primary">
                        <svg
                            fill="currentColor"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-12"
                        >
                            <path
                                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-text-light dark:text-text-dark">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm/6 text-secondary-text-light dark:text-secondary-text-dark">
                    Join ChronoVCS and start versioning your projects.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Display Name */}
                    <div>
                        <label
                            htmlFor="displayName"
                            className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                        >
                            Display Name
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                required
                                autoComplete="name"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                        >
                            Email address
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                        >
                            Password
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark transition-all"
                                placeholder="Min. 8 characters"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark transition-colors" />
                                ) : (
                                    <Eye className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm/6 font-medium text-text-light dark:text-text-dark"
                        >
                            Confirm Password
                        </label>
                        <div className="mt-2 relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6 bg-white dark:bg-component-bg-dark transition-all"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark transition-colors" />
                                ) : (
                                    <Eye className="h-5 w-5 text-secondary-text-light dark:text-secondary-text-dark hover:text-text-light dark:hover:text-text-dark transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-lg bg-primary px-3 py-2.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Creating account...
                                </span>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-xs text-secondary-text-light dark:text-secondary-text-dark">
                    By creating an account, you agree to our{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                        Privacy Policy
                    </Link>
                    .
                </p>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-light dark:border-border-dark" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background-light dark:bg-background-dark px-2 text-secondary-text-light dark:text-secondary-text-dark">
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-component-bg-dark px-3 py-2.5 text-sm font-semibold text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-transparent transition-all"
                        >
                            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-component-bg-dark px-3 py-2.5 text-sm font-semibold text-text-light dark:text-text-dark shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-transparent transition-all"
                        >
                            <svg
                                className="h-5 w-5 fill-[#24292F] dark:fill-white"
                                aria-hidden="true"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">GitHub</span>
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm/6 text-secondary-text-light dark:text-secondary-text-dark">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
