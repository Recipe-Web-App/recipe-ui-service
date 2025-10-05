/**
 * Token Refresh Interceptor
 *
 * Centralized Axios response interceptor that handles automatic token refresh
 * when API requests fail with 401 Unauthorized errors.
 *
 * Features:
 * - Automatic token refresh on 401 errors
 * - Prevents infinite loops (skips refresh for /auth/refresh endpoint)
 * - Handles concurrent requests (only one refresh at a time)
 * - Retries failed requests with new token
 * - Graceful fallback on refresh failure (logout and redirect)
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { Token } from '@/types/auth';

/**
 * Refresh token response from auth service
 */
interface RefreshTokenResponse {
  token: Token;
}

/**
 * Flag to prevent multiple simultaneous refresh requests
 */
let isRefreshing = false;

/**
 * Queue of failed requests waiting for token refresh
 */
let failedRequestsQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 *
 * @param error - Optional error if refresh failed
 * @param token - New access token if refresh succeeded
 */
function processQueue(error: Error | null = null, token: string | null = null) {
  failedRequestsQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedRequestsQueue = [];
}

/**
 * Check if request is to the refresh endpoint
 *
 * @param config - Axios request config
 * @returns True if request is to refresh endpoint
 */
function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return config.url?.includes('/auth/refresh') ?? false;
}

/**
 * Perform token refresh
 *
 * @returns Promise with new access token
 */
async function refreshAccessToken(): Promise<string> {
  const {
    refreshToken: storedRefreshToken,
    setTokenData,
    clearAuth,
  } = useAuthStore.getState();

  if (!storedRefreshToken) {
    // No refresh token - clear auth and redirect
    clearAuth();

    if (typeof window !== 'undefined') {
      window.location.href =
        '/login?returnUrl=' + encodeURIComponent(window.location.pathname);
    }

    throw new Error('No refresh token available');
  }

  try {
    // Call auth service refresh endpoint directly with axios
    // Don't use authClient to avoid circular dependency
    const response = await axios.post<RefreshTokenResponse>(
      'http://auth-service.local/api/v1/auth/user-management/auth/refresh',
      { refresh_token: storedRefreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const tokenData: Token = response.data.token;

    // Update auth store with new token
    setTokenData(tokenData);

    return tokenData.access_token;
  } catch (error) {
    // Refresh failed - clear auth and logout
    clearAuth();

    // Redirect to login if in browser
    if (typeof window !== 'undefined') {
      window.location.href =
        '/login?returnUrl=' + encodeURIComponent(window.location.pathname);
    }

    throw error;
  }
}

/**
 * Create token refresh interceptor for an Axios instance
 *
 * Automatically refreshes tokens when requests fail with 401 errors,
 * except for the refresh endpoint itself to prevent infinite loops.
 *
 * @param axiosInstance - Axios instance to attach interceptor to
 * @returns Response interceptor ID (for removal if needed)
 */
export function attachTokenRefreshInterceptor(
  axiosInstance: AxiosInstance
): number {
  return axiosInstance.interceptors.response.use(
    // Success handler - pass through
    response => response,

    // Error handler - handle 401 and refresh token
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only handle 401 errors
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // Don't refresh if this is the refresh endpoint itself (prevent infinite loop)
      if (isRefreshRequest(originalRequest)) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      // Don't retry if already retried
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Update authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

/**
 * Reset the refresh state
 * Useful for testing or manual state cleanup
 */
export function resetRefreshState(): void {
  isRefreshing = false;
  failedRequestsQueue = [];
}
