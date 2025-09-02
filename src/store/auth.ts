import { defineStore } from "pinia";
import { ref, computed } from "vue";
// import { authApi } from "@/api/auth";
import { demoUsers } from "@/utils/demoData";
import type { User, LoginCredentials, RegisterData } from "@/types/User";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const refreshToken = ref<string | null>(localStorage.getItem("refreshToken"));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isLoanOfficer = computed(() => user.value?.role === "loan_officer");

  // Function to restore user from stored token
  const restoreUserFromToken = () => {
    if (token.value && !user.value) {
      // Try to extract user info from demo token
      // In a real app, this would decode a JWT token
      const tokenParts = token.value.split("_");
      if (tokenParts.length >= 3 && tokenParts[0] === "demo") {
        const userId = tokenParts[1];
        const demoUser = demoUsers.find((u) => u.id === userId);
        if (demoUser) {
          user.value = demoUser;
        }
      }
    }
  };

  // Restore user on store initialization
  restoreUserFromToken();

  const setTokens = (newToken: string, newRefreshToken: string) => {
    token.value = newToken;
    refreshToken.value = newRefreshToken;
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const clearTokens = () => {
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Mock authentication with demo data
      const demoUser = demoUsers.find((u) => u.email === credentials.email);

      if (!demoUser) {
        throw new Error("Invalid email or password");
      }

      // For demo purposes, accept any password
      // In production, this would validate against the backend
      const mockToken = `demo_token_${demoUser.id}_${Date.now()}`;
      const mockRefreshToken = `demo_refresh_${demoUser.id}_${Date.now()}`;

      user.value = demoUser;
      setTokens(mockToken, mockRefreshToken);

      return {
        user: demoUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      };
    } catch (err: any) {
      error.value = err.message || "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Mock registration - create a new demo user
      const newUser: User = {
        id: `demo_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = `demo_token_${newUser.id}_${Date.now()}`;
      const mockRefreshToken = `demo_refresh_${newUser.id}_${Date.now()}`;

      user.value = newUser;
      setTokens(mockToken, mockRefreshToken);

      return {
        user: newUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
      };
    } catch (err: any) {
      error.value = err.message || "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      // Mock logout - no API call needed
      console.log("Logging out user:", user.value?.email);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      user.value = null;
      clearTokens();
    }
  };

  const refreshAuth = async () => {
    if (!refreshToken.value) return false;

    try {
      // Mock token refresh
      if (user.value) {
        const mockToken = `demo_token_${user.value.id}_${Date.now()}`;
        const mockRefreshToken = `demo_refresh_${user.value.id}_${Date.now()}`;
        setTokens(mockToken, mockRefreshToken);
        return true;
      }
      return false;
    } catch (err) {
      clearTokens();
      return false;
    }
  };

  const getProfile = async () => {
    if (!token.value) return;

    try {
      // Mock profile - return current user
      if (user.value) {
        return user.value;
      }
    } catch (err) {
      console.error("Failed to get profile:", err);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Mock profile update
      if (user.value) {
        const updatedProfile = { ...user.value, ...data, updatedAt: new Date().toISOString() };
        user.value = updatedProfile;
        return updatedProfile;
      }
      throw new Error("No user logged in");
    } catch (err: any) {
      error.value = err.message || "Profile update failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isLoanOfficer,

    // Actions
    login,
    register,
    logout,
    refreshAuth,
    getProfile,
    updateProfile,
    clearError,
    setTokens,
    clearTokens,
  };
});
