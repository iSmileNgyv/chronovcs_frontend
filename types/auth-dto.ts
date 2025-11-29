export interface UserDto {
    userId: number;
    userUid: string;
    email: string;
    username: string;
}

export interface AuthResponse {
    token?: string; // If you use token based auth later
    user: UserDto;
}
