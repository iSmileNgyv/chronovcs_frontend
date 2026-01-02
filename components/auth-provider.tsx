"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserDto } from "@/types/auth-dto";
import { authService } from "@/services/auth-service";
import { ACCESS_TOKEN_KEY, USER_DATA_KEY } from "@/services/base-service";

interface AuthContextType {
    user: UserDto | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Initialize auth state from storage
    useEffect(() => {
        const initAuth = async () => {
            if (typeof window === "undefined") {
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_DATA_KEY);

            if (token && storedUser) {
                try {
                    // Try to parse stored user first for immediate display
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Then verify with backend and get fresh data
                    const freshUser = await authService.getSelf();
                    setUser(freshUser);
                    localStorage.setItem(USER_DATA_KEY, JSON.stringify(freshUser));
                } catch (e) {
                    console.error("Failed to restore auth session", e);
                    authService.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await authService.login({ email, password });

        // Fetch full user data
        const userData = await authService.getSelf();
        setUser(userData);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

        // Redirect to user profile
        router.push(`/${userData.username || response.email.split("@")[0]}`);
    }, [router]);

    const register = useCallback(async (email: string, password: string, displayName: string) => {
        const response = await authService.register({ email, password, displayName });

        // Fetch full user data
        const userData = await authService.getSelf();
        setUser(userData);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

        // Redirect to user profile
        router.push(`/${userData.username || response.email.split("@")[0]}`);
    }, [router]);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        router.push("/login");
    }, [router]);

    const refreshUser = useCallback(async () => {
        if (!authService.isAuthenticated()) return;

        try {
            const userData = await authService.getSelf();
            setUser(userData);
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        } catch (e) {
            console.error("Failed to refresh user", e);
            logout();
        }
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
