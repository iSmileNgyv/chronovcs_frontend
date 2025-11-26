export abstract class BaseService {
    protected baseUrl: string;

    constructor(baseUrl: string = "/api") {
        this.baseUrl = baseUrl;
    }

    protected getAuthHeader(): { Authorization?: string } {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("auth_token");
            return token ? { Authorization: `Basic ${token}` } : {};
        }
        return {};
    }

    protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const authHeader = this.getAuthHeader();
        const headers = {
            "Content-Type": "application/json",
            ...authHeader,
            ...options.headers,
        };

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Try to parse error message from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // Ignore JSON parse error for error response
                }
                throw new Error(errorMessage);
            }

            // Handle empty responses (e.g. 204 No Content)
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            console.error("API Request Error:", error);
            throw error;
        }
    }
}
