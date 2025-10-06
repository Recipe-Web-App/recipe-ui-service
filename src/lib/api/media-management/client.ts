import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ErrorResponse } from '@/types/media-management';
import { getServiceUrl } from '@/config/services';
import { attachTokenRefreshInterceptor } from '@/lib/api/shared/token-refresh-interceptor';

const baseURL = getServiceUrl('MEDIA_MANAGEMENT');

export const mediaManagementClient = axios.create({
  baseURL,
  timeout: 30000, // Longer timeout for file uploads
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

mediaManagementClient.interceptors.request.use(
  requestInterceptor,
  requestErrorHandler
);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  // Token refresh interceptor will handle 401 errors, so we can remove this manual handling
  return Promise.reject(error);
};

mediaManagementClient.interceptors.response.use(
  responseInterceptor,
  responseErrorHandler
);

// Attach token refresh interceptor (handles 401 errors automatically)
attachTokenRefreshInterceptor(mediaManagementClient);

export class MediaManagementApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MediaManagementApiError';
    this.status = status;
    this.details = details;
  }
}

export const handleMediaManagementApiError = (error: unknown): never => {
  // Handle AxiosError or axios-like error objects
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };
    const errorData = axiosError.response?.data as ErrorResponse | undefined;
    const message =
      errorData?.message ??
      axiosError.message ??
      'An unexpected error occurred';
    const details = errorData?.details;
    throw new MediaManagementApiError(
      message,
      axiosError.response?.status,
      details
    );
  }

  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const messageError = error as {
      message: string;
      status?: number;
      data?: unknown;
    };

    // Check if it has additional data property
    if (
      'data' in messageError &&
      messageError.data &&
      typeof messageError.data === 'object'
    ) {
      const data = messageError.data as { message?: string };
      const message = data.message ?? messageError.message;
      throw new MediaManagementApiError(message, messageError.status);
    }

    throw new MediaManagementApiError(
      messageError.message,
      messageError.status
    );
  }

  if (error instanceof Error) {
    throw new MediaManagementApiError(error.message);
  }

  throw new MediaManagementApiError('An unexpected error occurred');
};

export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};
