import { create } from "zustand";
import { ApiError } from "../client/apiClient";
import { authClient, type AuthUser } from "../client/auth.client";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { user } = await authClient.login({ email, password });
      set({ user, loading: false });
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      set({ error: message, loading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });

    try {
      const { user } = await authClient.register({ name, email, password });
      set({ user, loading: false });
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      set({ error: message, loading: false });
      return false;
    }
  },

  refresh: async () => {
    try {
      const { user } = await authClient.refresh();
      set({ user });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await authClient.logout();
    } finally {
      set({ user: null });
    }
  },
}));
