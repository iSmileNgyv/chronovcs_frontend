import { BaseService } from "./base-service";
import { UserDto } from "@/types/auth-dto";

class AuthService extends BaseService {
    async login(email: string, password: string): Promise<UserDto> {
        const credentials = btoa(`${email}:${password}`);
        const response = await this.request<UserDto>("/auth/self", {
            method: "GET",
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        });

        if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", credentials);
            localStorage.setItem("user_data", JSON.stringify(response));
        }

        return response;
    }
}

export const authService = new AuthService();
