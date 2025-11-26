export interface UserDto {
    userId: number;
    userUid: string;
    email: string;
}

export interface AuthResponse {
    token?: string; // If you use token based auth later
    user: UserDto;
}
