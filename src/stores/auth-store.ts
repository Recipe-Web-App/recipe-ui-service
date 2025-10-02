import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthorizedUser } from '@/types';
import type { User as AuthUser, Token } from '@/types/auth';

export interface AuthState {
  user: AuthorizedUser | null;
  authUser: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pkceVerifier: string | null;
  pkceState: string | null;
  setUser: (user: AuthorizedUser) => void;
  setAuthUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  setTokenData: (tokenData: Token) => void;
  setPKCEData: (verifier: string, state: string) => void;
  clearPKCEData: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authUser: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      pkceVerifier: null,
      pkceState: null,

      setUser: (user: AuthorizedUser) => {
        set({ user, isAuthenticated: true });
      },

      setAuthUser: (authUser: AuthUser) => {
        set({ authUser, isAuthenticated: true });
      },

      setToken: (token: string) => {
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour default
        set({ token, tokenExpiresAt: expiresAt });
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token);

          // Also set cookie for middleware access
          const maxAge = 60 * 60; // 1 hour in seconds
          document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
          document.cookie = `tokenExpiresAt=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Strict`;
        }
      },

      setTokenData: (tokenData: Token) => {
        const expiresAt = Date.now() + tokenData.expires_in * 1000;
        set({
          token: tokenData.access_token,
          refreshToken: tokenData.refresh_token ?? null,
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('refreshToken', tokenData.refresh_token);
          }

          // Also set cookies for middleware access
          const maxAge = tokenData.expires_in; // in seconds
          document.cookie = `authToken=${tokenData.access_token}; path=/; max-age=${maxAge}; SameSite=Strict`;
          document.cookie = `tokenExpiresAt=${expiresAt}; path=/; max-age=${maxAge}; SameSite=Strict`;

          if (tokenData.refresh_token) {
            // Set refresh token cookie with longer expiration (if provided)
            document.cookie = `refreshToken=${tokenData.refresh_token}; path=/; max-age=${maxAge * 2}; SameSite=Strict`;
          }
        }
      },

      setPKCEData: (verifier: string, state: string) => {
        set({ pkceVerifier: verifier, pkceState: state });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pkceVerifier', verifier);
          sessionStorage.setItem('pkceState', state);
        }
      },

      clearPKCEData: () => {
        set({ pkceVerifier: null, pkceState: null });
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pkceVerifier');
          sessionStorage.removeItem('pkceState');
        }
      },

      clearAuth: () => {
        set({
          user: null,
          authUser: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');

          // Also clear cookies for middleware
          document.cookie = 'authToken=; path=/; max-age=0';
          document.cookie = 'tokenExpiresAt=; path=/; max-age=0';
          document.cookie = 'refreshToken=; path=/; max-age=0';
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt - 5 * 60 * 1000; // 5 minutes buffer
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        authUser: state.authUser,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
