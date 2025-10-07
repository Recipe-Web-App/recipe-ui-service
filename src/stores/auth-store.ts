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
  hasHydrated: boolean;
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
      hasHydrated: false,
      pkceVerifier: null,
      pkceState: null,

      setUser: (user: AuthorizedUser) => {
        set({ user, isAuthenticated: true });

        // Sync user role to cookie for middleware access
        // Use first role from roles array (primary role)
        if (
          typeof window !== 'undefined' &&
          user.roles &&
          user.roles.length > 0
        ) {
          const primaryRole = user.roles[0];
          const maxAge = 60 * 60 * 24 * 7; // 7 days
          document.cookie = `userRole=${primaryRole}; path=/; max-age=${maxAge}; SameSite=Strict`;
        }
      },

      setAuthUser: (authUser: AuthUser) => {
        set({ authUser, isAuthenticated: true });

        // Sync user role to cookie for middleware access if authUser has roles
        if (typeof window !== 'undefined' && 'roles' in authUser) {
          const roles = (authUser as { roles?: string[] }).roles;
          if (roles && roles.length > 0) {
            const primaryRole = roles[0];
            const maxAge = 60 * 60 * 24 * 7; // 7 days
            document.cookie = `userRole=${primaryRole}; path=/; max-age=${maxAge}; SameSite=Strict`;
          }
        }
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
        if (!tokenData?.access_token) {
          console.error('Invalid token data - missing access_token');
          return;
        }

        const expiresAt = Date.now() + tokenData.expires_in * 1000;

        set({
          token: tokenData.access_token,
          refreshToken: tokenData.refresh_token ?? null,
          tokenExpiresAt: expiresAt,
          isAuthenticated: true,
          hasHydrated: true,
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
          document.cookie = 'userRole=; path=/; max-age=0';
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      isTokenExpired: () => {
        const { tokenExpiresAt, clearAuth } = get();
        if (!tokenExpiresAt) return true;

        const isExpired = Date.now() >= tokenExpiresAt - 5 * 60 * 1000; // 5 minutes buffer

        // Auto-clear auth state if token is expired to prevent sync issues
        // between cookies (used by middleware) and localStorage (used by client)
        if (isExpired && typeof window !== 'undefined') {
          clearAuth();
        }

        return isExpired;
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        authUser: state.authUser,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        // Set hasHydrated to true once rehydration is complete
        if (state) {
          // SYNC FROM COOKIES: If localStorage is empty but cookies exist, restore from cookies
          // This handles the case where localStorage was cleared but cookies remain valid
          if (!state.token && typeof window !== 'undefined') {
            // Check if we have auth cookies
            const cookieToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('authToken='))
              ?.split('=')[1];
            const cookieExpiresAt = document.cookie
              .split('; ')
              .find(row => row.startsWith('tokenExpiresAt='))
              ?.split('=')[1];

            if (cookieToken && cookieExpiresAt) {
              const expiresAt = Number(cookieExpiresAt);
              const now = Date.now();
              const isExpired = now >= expiresAt - 5 * 60 * 1000;

              if (!isExpired) {
                console.log('Restoring auth state from cookies');
                state.token = cookieToken;
                state.tokenExpiresAt = expiresAt;
                state.isAuthenticated = true;
              } else {
                console.log('Cookie token is expired, not restoring');
              }
            }
          }

          // Set hasHydrated BEFORE validation so ProtectedRoute can immediately react
          state.hasHydrated = true;

          const hasToken = Boolean(state.token);
          const hasUser = Boolean(state.user ?? state.authUser);

          const now = Date.now();
          const expiresAt = state.tokenExpiresAt ?? 0;
          const bufferMs = 5 * 60 * 1000;
          const secondsUntilExpiry = state.tokenExpiresAt
            ? Math.floor((state.tokenExpiresAt - now) / 1000)
            : 0;

          const isExpired = state.tokenExpiresAt
            ? now >= state.tokenExpiresAt - bufferMs
            : true;

          // Invalid state: marked as authenticated but missing critical data
          const isInvalidState =
            state.isAuthenticated && (!hasToken || !hasUser);

          console.log('Token expiration check:', {
            now: new Date(now).toISOString(),
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : 'none',
            secondsUntilExpiry,
            bufferMinutes: 5,
            isExpired,
            hasToken,
            hasUser,
          });

          if (isExpired || isInvalidState) {
            console.warn('Auth state validation failed during hydration:', {
              isExpired,
              isInvalidState,
              hasToken,
              hasUser,
            });
            state.clearAuth();
          }
        }
      },
    }
  )
);
