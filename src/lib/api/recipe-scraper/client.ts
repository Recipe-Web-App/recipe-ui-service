import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ErrorDetail, ErrorResponse } from '@/types/recipe-scraper';
import { getServiceUrl } from '@/config/services';
import { attachTokenRefreshInterceptor } from '@/lib/api/shared/token-refresh-interceptor';

const baseURL = getServiceUrl('RECIPE_SCRAPER');

export const recipeScraperClient = axios.create({
  baseURL,
  timeout: 30000,
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

recipeScraperClient.interceptors.request.use(
  requestInterceptor,
  requestErrorHandler
);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  const errorData = error.response?.data as ErrorResponse | undefined;
  const message =
    errorData?.message ?? error.message ?? 'An unexpected error occurred';

  return Promise.reject({
    ...error,
    message,
    status: error.response?.status,
  });
};

recipeScraperClient.interceptors.response.use(
  responseInterceptor,
  responseErrorHandler
);

// Attach token refresh interceptor (runs after error handler above)
attachTokenRefreshInterceptor(recipeScraperClient);

export class RecipeScraperApiError extends Error {
  status?: number;
  error?: string;
  details?: ErrorDetail[];
  requestId?: string;

  constructor(
    message: string,
    status?: number,
    error?: string,
    details?: ErrorDetail[],
    requestId?: string
  ) {
    super(message);
    this.name = 'RecipeScraperApiError';
    this.status = status;
    this.error = error;
    this.details = details;
    this.requestId = requestId;
  }
}

export const handleRecipeScraperApiError = (error: unknown): never => {
  // Handle AxiosError instances
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse | undefined;

    throw new RecipeScraperApiError(
      errorData?.message ?? error.message,
      error.response?.status,
      errorData?.error,
      errorData?.details ?? undefined,
      errorData?.requestId ?? undefined
    );
  }

  // Handle axios-like error objects (for testing and compatibility)
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosLikeError = error as {
      response?: {
        status?: number;
        data?: ErrorResponse;
      };
      message?: string;
    };

    const errorData = axiosLikeError.response?.data;

    throw new RecipeScraperApiError(
      errorData?.message ??
        axiosLikeError.message ??
        'An unexpected error occurred',
      axiosLikeError.response?.status,
      errorData?.error,
      errorData?.details ?? undefined,
      errorData?.requestId ?? undefined
    );
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorObj = error as {
      message: string;
      status?: number;
      error?: string;
      details?: ErrorDetail[];
      requestId?: string;
    };

    throw new RecipeScraperApiError(
      errorObj.message,
      errorObj.status,
      errorObj.error,
      errorObj.details,
      errorObj.requestId
    );
  }

  if (error instanceof Error) {
    throw new RecipeScraperApiError(error.message);
  }

  throw new RecipeScraperApiError('An unexpected error occurred');
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
