// =====================================
// Auth DTOs - JWT Authentication
// =====================================

export interface UserDto {
    userId: number;
    userUid: string;
    email: string;
    username: string;
    displayName?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
    username?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    userUid: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface CreateTokenRequest {
    tokenName: string;
    expiresInDays: number;
}

export interface TokenResponse {
    tokenId: string;
    tokenName: string;
    rawToken: string; // Only returned once when created
    expiresAt: string;
    createdAt: string;
}

// Legacy support
export interface AuthResponse {
    token?: string;
    user: UserDto;
}
