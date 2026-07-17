import { apiClient } from "./apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: { role: { name: string } }[];
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface RefreshResponse {
  user: AuthUser;
}

class AuthClient {
  login(payload: LoginRequest) {
    return apiClient.post<LoginResponse>("/auth/login", payload);
  }

  register(payload: RegisterRequest) {
    return apiClient.post<RegisterResponse>("/auth/register", payload);
  }

  refresh() {
    return apiClient.post<RefreshResponse>("/auth/refresh");
  }

  logout() {
    return apiClient.post<{ message: string }>("/auth/logout");
  }
}

export const authClient = new AuthClient();
