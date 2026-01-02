import { LoginResponse } from '@/types/auth-dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export abstract class BaseService {
    protected baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // =====================================
    // Token Management
    // =====================================

    protected getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    }

    protected getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
    }

    protected setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    }

    protected clearTokens(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
        }
    }

    protected getAuthHeader(): { Authorization?: string } {
        const token = this.getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    // =====================================
    // Token Refresh
    // =====================================

    private async refreshAccessToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                this.clearTokens();
                return null;
            }

            const data: LoginResponse = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearTokens();
            return null;
        }
    }

    // =====================================
    // HTTP Request with Auto-Refresh
    // =====================================

    protected async request<T>(
        endpoint: string,
        options: RequestInit = {},
        skipAuth: boolean = false
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(!skipAuth ? this.getAuthHeader() : {}),
            ...(options.headers as Record<string, string> || {}),
        };

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            let response = await fetch(url, config);

            // Handle 401 - try to refresh token
            if (response.status === 401 && !skipAuth) {
                const newToken = await this.refreshAccessToken();
                if (newToken) {
                    // Retry with new token
                    headers.Authorization = `Bearer ${newToken}`;
                    response = await fetch(url, { ...config, headers });
                } else {
                    // Redirect to login
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    throw new Error('Session expired. Please login again.');
                }
            }

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                } catch {
                    // Ignore JSON parse error
                }
                throw new Error(errorMessage);
            }

            // Handle empty responses (204 No Content)
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // =====================================
    // Convenience Methods
    // =====================================

    protected get<T>(endpoint: string, skipAuth: boolean = false): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, skipAuth);
    }

    protected post<T>(endpoint: string, data?: unknown, skipAuth: boolean = false): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            },
            skipAuth
        );
    }

    protected put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Export token keys for use in auth provider
export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY };
