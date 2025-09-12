import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@/types/recipe-scraper';

const baseURL =
  process.env.NEXT_PUBLIC_RECIPE_SCRAPER_SERVICE_URL ?? 'http://localhost:8000';

export const recipeScraperClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

recipeScraperClient.interceptors.request.use(
  config => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

recipeScraperClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle general errors
    const errorData = error.response?.data as ErrorResponse | undefined;
    const message =
      errorData?.detail ?? error.message ?? 'An unexpected error occurred';

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);

export class RecipeScraperApiError extends Error {
  status?: number;
  error_code?: string;
  error_type?: string;

  constructor(
    message: string,
    status?: number,
    error_code?: string,
    error_type?: string
  ) {
    super(message);
    this.name = 'RecipeScraperApiError';
    this.status = status;
    this.error_code = error_code;
    this.error_type = error_type;
  }
}

export const handleRecipeScraperApiError = (error: unknown): never => {
  // Handle AxiosError instances
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse | undefined;

    throw new RecipeScraperApiError(
      errorData?.detail ?? error.message,
      error.response?.status,
      errorData?.error_code,
      errorData?.error_type
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
      errorData?.detail ??
        axiosLikeError.message ??
        'An unexpected error occurred',
      axiosLikeError.response?.status,
      errorData?.error_code,
      errorData?.error_type
    );
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorObj = error as {
      message: string;
      status?: number;
      error_code?: string;
      error_type?: string;
    };

    throw new RecipeScraperApiError(
      errorObj.message,
      errorObj.status,
      errorObj.error_code,
      errorObj.error_type
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
