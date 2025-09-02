import api from "./config";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types/User";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await api.put("/auth/change-password", data);
  },
};
