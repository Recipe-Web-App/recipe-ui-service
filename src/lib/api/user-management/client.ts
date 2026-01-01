import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getServiceUrl } from '@/config/services';
import { attachTokenRefreshInterceptor } from '@/lib/api/shared/token-refresh-interceptor';

const baseURL = getServiceUrl('USER_MANAGEMENT');

export const userManagementClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// OAuth2 scope requirements mapping
// Updated per new OpenAPI spec
const SCOPE_REQUIREMENTS: Record<string, string[]> = {
  // User endpoints
  'GET:/users/*/profile': ['user:read'],
  'GET:/users/search': ['user:read'],
  'GET:/users/*': ['user:read'],
  'PUT:/users/*/profile': ['user:write'],
  'POST:/users/*/account/delete-request': ['user:write'],
  'DELETE:/users/*/account': ['user:write'],

  // Social/Follow endpoints - Updated: POST/DELETE instead of PUT toggle
  'GET:/users/*/following': ['user:read'],
  'GET:/users/*/followers': ['user:read'],
  'GET:/users/*/activity': ['user:read'],
  'GET:/users/*/follow/*': ['user:read'], // isFollowing check
  'POST:/users/*/follow/*': ['user:write'], // follow user
  'DELETE:/users/*/follow/*': ['user:write'], // unfollow user
  'GET:/users/*/mutual-follows/*': ['user:read'],
  'GET:/users/*/follow-stats': ['user:read'],

  // Preferences endpoints - New per OpenAPI spec
  'GET:/users/*/preferences': ['user:read'],
  'PUT:/users/*/preferences': ['user:write'],
  'GET:/users/*/preferences/*': ['user:read'],
  'PUT:/users/*/preferences/*': ['user:write'],

  // Notifications endpoints (kept for now per user request)
  'GET:/notifications': ['user:read'],
  'GET:/notifications/preferences': ['user:read'],
  'PUT:/notifications/*/read': ['user:write'],
  'PUT:/notifications/read-all': ['user:write'],
  'PUT:/notifications/preferences': ['user:write'],

  // Admin endpoints
  'GET:/admin/*': ['admin'],
  'DELETE:/admin/*': ['admin'],
  'POST:/admin/cache/clear': ['admin'], // New: moved from metrics

  // Metrics endpoints (admin only)
  'GET:/metrics/*': ['admin'],

  // Health endpoints (public - no scope required, but default to user:read)
  'GET:/health': [],
  'GET:/ready': [],
};

// Get required scopes for an endpoint
export function getRequiredScopes(method: string, url: string): string[] {
  const normalizedUrl = url
    .replace(/\/\d+/g, '/*')
    .replace(/\/[a-f0-9-]{36}/g, '/*');
  const key = `${method.toUpperCase()}:${normalizedUrl}`;

  for (const pattern in SCOPE_REQUIREMENTS) {
    if (!Object.prototype.hasOwnProperty.call(SCOPE_REQUIREMENTS, pattern)) {
      continue;
    }
    const escapedPattern = pattern.replace(/\*/g, '[^/]+');
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(escapedPattern);
    if (regex.test(key)) {
      // eslint-disable-next-line security/detect-object-injection
      return SCOPE_REQUIREMENTS[pattern] || [];
    }
  }

  return ['user:read']; // Default scope
}

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add required scopes as header for debugging/logging
  if (config.method && config.url) {
    const requiredScopes = getRequiredScopes(config.method, config.url);
    config.headers = config.headers ?? {};
    config.headers['X-Required-Scopes'] = requiredScopes.join(' ');
  }

  return config;
};

export const requestErrorHandler = (error: unknown): Promise<never> =>
  Promise.reject(error);

userManagementClient.interceptors.request.use(
  requestInterceptor,
  requestErrorHandler
);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  // Handle OAuth2 scope errors
  if (error.response?.status === 403) {
    const errorData = error.response.data as {
      error_code?: string;
      required_scopes?: string[];
    };
    if (errorData?.error_code && errorData?.required_scopes) {
      const message = `Insufficient OAuth2 scopes. Required: ${errorData.required_scopes.join(', ')}`;
      return Promise.reject({
        ...error,
        message,
        status: error.response.status,
        scopes: errorData.required_scopes,
        errorCode: errorData.error_code,
      });
    }
  }

  // Handle general errors
  const message =
    (
      error.response?.data as {
        error_description?: string;
        message?: string;
        detail?: string;
      }
    )?.error_description ??
    (error.response?.data as { message?: string })?.message ??
    (error.response?.data as { detail?: string })?.detail ??
    error.message ??
    'An unexpected error occurred';

  return Promise.reject({
    ...error,
    message,
    status: error.response?.status,
  });
};

userManagementClient.interceptors.response.use(
  responseInterceptor,
  responseErrorHandler
);

// Attach token refresh interceptor (runs after error handler above)
attachTokenRefreshInterceptor(userManagementClient);

export class UserManagementApiError extends Error {
  status?: number;
  scopes?: string[];
  errorCode?: string;

  constructor(
    message: string,
    status?: number,
    requiredScopes?: string[],
    errorCode?: string
  ) {
    super(message);
    this.name = 'UserManagementApiError';
    this.status = status;
    this.scopes = requiredScopes;
    this.errorCode = errorCode;
  }
}

export const handleUserManagementApiError = (error: unknown): never => {
  // Handle AxiosError instances
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as
      | {
          error_description?: string;
          message?: string;
          detail?: string;
          required_scopes?: string[];
          error_code?: string;
        }
      | undefined;

    const message =
      errorData?.error_description ??
      errorData?.message ??
      errorData?.detail ??
      error.message;

    throw new UserManagementApiError(
      message,
      error.response?.status,
      errorData?.required_scopes,
      errorData?.error_code
    );
  }

  // Handle axios-like error objects (for testing and compatibility)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosLikeError = error as {
      response?: {
        status?: number;
        data?: {
          error_description?: string;
          message?: string;
          detail?: string;
          required_scopes?: string[];
          error_code?: string;
        };
      };
      message?: string;
    };

    const errorData = axiosLikeError.response?.data;
    const message =
      errorData?.error_description ??
      errorData?.message ??
      errorData?.detail ??
      axiosLikeError.message ??
      'An unexpected error occurred';

    throw new UserManagementApiError(
      message,
      axiosLikeError.response?.status,
      errorData?.required_scopes,
      errorData?.error_code
    );
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorObj = error as {
      message: string;
      status?: number;
      scopes?: string[];
      errorCode?: string;
    };

    throw new UserManagementApiError(
      errorObj.message,
      errorObj.status,
      errorObj.scopes,
      errorObj.errorCode
    );
  }

  if (error instanceof Error) {
    throw new UserManagementApiError(error.message);
  }

  throw new UserManagementApiError('An unexpected error occurred');
};

// Helper for creating paginated requests
// Updated: count_only → countOnly per OpenAPI spec camelCase convention
export interface PaginationParams {
  limit?: number;
  offset?: number;
  countOnly?: boolean;
}

// Helper for handling file uploads
export const createFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Helper for building query parameters
export const buildQueryParams = (
  params: Record<string, unknown> | object
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};
