import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getServiceUrl } from '@/config/services';
import { attachTokenRefreshInterceptor } from '@/lib/api/shared/token-refresh-interceptor';

const baseURL = getServiceUrl('AUTH');

export const authClient = axios.create({
  baseURL,
  timeout: 10000,
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

authClient.interceptors.request.use(requestInterceptor, requestErrorHandler);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  const message =
    (error.response?.data as { error_description?: string; message?: string })
      ?.error_description ??
    (error.response?.data as { message?: string })?.message ??
    error.message ??
    'An unexpected error occurred';

  return Promise.reject({
    ...error,
    message,
    status: error.response?.status,
  });
};

authClient.interceptors.response.use(responseInterceptor, responseErrorHandler);

// Attach token refresh interceptor (runs after error handler above)
attachTokenRefreshInterceptor(authClient);

export class AuthApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

export const handleAuthApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as
      | { error_description?: string; message?: string }
      | undefined;
    const message =
      errorData?.error_description ?? errorData?.message ?? error.message;
    throw new AuthApiError(message, error.response?.status);
  }

  if (error instanceof Error) {
    throw new AuthApiError(error.message);
  }

  throw new AuthApiError('An unexpected error occurred');
};
