import { BaseService, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from './base-service';
import {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    UserDto,
    CreateTokenRequest,
    TokenResponse,
} from '@/types/auth-dto';
import { TokenSummaryDto, TokenPermissionDto, TokenPermissionRequestDto } from '@/types/token-dto';

class AuthService extends BaseService {
    /**
     * Login with email and password
     * POST /api/auth/login
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/auth/login', credentials, true);

        // Store tokens
        this.setTokens(response.accessToken, response.refreshToken);

        // Store basic user info
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify({
                email: response.email,
                userUid: response.userUid,
            }));
        }

        return response;
    }

    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/auth/register', data, true);

        // Store tokens
        this.setTokens(response.accessToken, response.refreshToken);

        // Store basic user info
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify({
                email: response.email,
                userUid: response.userUid,
            }));
        }

        return response;
    }

    /**
     * Get current user info
     * GET /api/auth/self
     */
    async getSelf(): Promise<UserDto> {
        return this.get<UserDto>('/auth/self');
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    async refresh(refreshToken: string): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>(
            '/auth/refresh',
            { refreshToken },
            true
        );

        this.setTokens(response.accessToken, response.refreshToken);
        return response;
    }

    /**
     * Create a Personal Access Token (PAT)
     * POST /api/auth/tokens
     */
    async createToken(data: CreateTokenRequest): Promise<TokenResponse> {
        return this.post<TokenResponse>('/auth/tokens', data);
    }

    /**
     * List all PAT tokens
     * GET /api/auth/tokens
     */
    async listTokens(): Promise<TokenSummaryDto[]> {
        return this.get<TokenSummaryDto[]>('/auth/tokens');
    }

    /**
     * Revoke a PAT token
     * DELETE /api/auth/tokens/{tokenId}
     */
    async revokeToken(tokenId: string): Promise<void> {
        return this.delete(`/auth/tokens/${tokenId}`);
    }

    /**
     * List permissions for a token
     * GET /api/auth/tokens/{tokenId}/permissions
     */
    async listTokenPermissions(tokenId: string): Promise<TokenPermissionDto[]> {
        return this.get<TokenPermissionDto[]>(`/auth/tokens/${tokenId}/permissions`);
    }

    /**
     * Upsert permissions for a token on a repo
     * PUT /api/auth/tokens/{tokenId}/permissions/{repoKey}
     */
    async upsertTokenPermission(
        tokenId: string,
        repoKey: string,
        permissions: TokenPermissionRequestDto
    ): Promise<TokenPermissionDto> {
        return this.put<TokenPermissionDto>(`/auth/tokens/${tokenId}/permissions/${repoKey}`, permissions);
    }

    /**
     * Delete permissions for a token on a repo
     * DELETE /api/auth/tokens/{tokenId}/permissions/{repoKey}
     */
    async deleteTokenPermission(tokenId: string, repoKey: string): Promise<void> {
        return this.delete(`/auth/tokens/${tokenId}/permissions/${repoKey}`);
    }

    /**
     * Logout - clear all tokens
     */
    logout(): void {
        this.clearTokens();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * Get stored user data
     */
    getStoredUser(): UserDto | null {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem(USER_DATA_KEY);
            if (userData) {
                try {
                    return JSON.parse(userData);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }
}

export const authService = new AuthService();
