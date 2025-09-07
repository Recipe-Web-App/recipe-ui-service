import axios, { AxiosError, AxiosResponse } from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL ??
  'http://localhost:8000/api/v1/user-management';

export const userManagementClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// OAuth2 scope requirements mapping
const SCOPE_REQUIREMENTS: Record<string, string[]> = {
  'GET:/users/*/profile': ['user:read'],
  'GET:/users/search': ['user:read'],
  'GET:/users/*': ['user:read'],
  'GET:/*/following': ['user:read'],
  'GET:/*/followers': ['user:read'],
  'GET:/*/activity': ['user:read'],
  'GET:/notifications': ['user:read'],
  'GET:/notifications/preferences': ['user:read'],
  'PUT:/users/profile': ['user:write'],
  'POST:/users/account/delete-request': ['user:write'],
  'DELETE:/users/account': ['user:write'],
  'PUT:/*/follow/*': ['user:write'],
  'PUT:/notifications/*/read': ['user:write'],
  'PUT:/notifications/read-all': ['user:write'],
  'PUT:/notifications/preferences': ['user:write'],
  'GET:/admin/*': ['admin'],
  'DELETE:/admin/*': ['admin'],
  'GET:/metrics/*': ['admin'],
  'POST:/metrics/*': ['admin'],
};

// Get required scopes for an endpoint
function getRequiredScopes(method: string, url: string): string[] {
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

userManagementClient.interceptors.request.use(
  config => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add required scopes as header for debugging/logging
    if (config.method && config.url) {
      const requiredScopes = getRequiredScopes(config.method, config.url);
      config.headers['X-Required-Scopes'] = requiredScopes.join(' ');
    }

    return config;
  },
  error => Promise.reject(error)
);

userManagementClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
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
  }
);

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
export interface PaginationParams {
  limit?: number;
  offset?: number;
  count_only?: boolean;
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
