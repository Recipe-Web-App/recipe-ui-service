import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getServiceUrl } from '@/config/services';
import { attachTokenRefreshInterceptor } from '@/lib/api/shared/token-refresh-interceptor';

const baseURL = getServiceUrl('NOTIFICATION');

export const notificationClient = axios.create({
  baseURL,
  timeout: 15000, // Standard timeout for notification operations
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const requestErrorHandler = (error: unknown): Promise<never> =>
  Promise.reject(error);

notificationClient.interceptors.request.use(
  requestInterceptor,
  requestErrorHandler
);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  const message =
    (
      error.response?.data as {
        error?: string;
        message?: string;
        detail?: string;
      }
    )?.error ??
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

notificationClient.interceptors.response.use(
  responseInterceptor,
  responseErrorHandler
);

// Attach token refresh interceptor (runs after error handler above)
attachTokenRefreshInterceptor(notificationClient);

export class NotificationApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NotificationApiError';
    this.status = status;
    this.details = details;
  }
}

export const handleNotificationApiError = (error: unknown): never => {
  // Handle AxiosError instances
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as
      | {
          error?: string;
          message?: string;
          detail?: string;
          details?: Record<string, unknown>;
        }
      | undefined;

    const message =
      errorData?.error ??
      errorData?.message ??
      errorData?.detail ??
      error.message;

    throw new NotificationApiError(
      message,
      error.response?.status,
      errorData?.details
    );
  }

  // Handle axios-like error objects (for testing and compatibility)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosLikeError = error as {
      response?: {
        status?: number;
        data?: {
          error?: string;
          message?: string;
          detail?: string;
          details?: Record<string, unknown>;
        };
      };
      message?: string;
    };

    const errorData = axiosLikeError.response?.data;
    const message =
      errorData?.error ??
      errorData?.message ??
      errorData?.detail ??
      axiosLikeError.message ??
      'An unexpected error occurred';

    throw new NotificationApiError(
      message,
      axiosLikeError.response?.status,
      errorData?.details
    );
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorObj = error as {
      message: string;
      status?: number;
      details?: Record<string, unknown>;
    };

    throw new NotificationApiError(
      errorObj.message,
      errorObj.status,
      errorObj.details
    );
  }

  if (error instanceof Error) {
    throw new NotificationApiError(error.message);
  }

  throw new NotificationApiError('An unexpected error occurred');
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
