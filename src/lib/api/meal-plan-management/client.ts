import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getServiceUrl } from '@/config/services';

const baseURL = getServiceUrl('MEAL_PLAN_MANAGEMENT');

export const mealPlanManagementClient = axios.create({
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

mealPlanManagementClient.interceptors.request.use(
  requestInterceptor,
  requestErrorHandler
);

export const responseInterceptor = (response: AxiosResponse) => response;

export const responseErrorHandler = (error: AxiosError) => {
  const message =
    (
      error.response?.data as {
        error?: { message?: string };
        message?: string;
        detail?: string;
      }
    )?.error?.message ??
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

mealPlanManagementClient.interceptors.response.use(
  responseInterceptor,
  responseErrorHandler
);

export class MealPlanManagementApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MealPlanManagementApiError';
    this.status = status;
    this.details = details;
  }
}

export const handleMealPlanManagementApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as
      | {
          error?: { message?: string; details?: string[] };
          message?: string;
          detail?: string;
          details?: Record<string, unknown>;
        }
      | undefined;

    const message =
      errorData?.error?.message ??
      errorData?.message ??
      errorData?.detail ??
      error.message;

    throw new MealPlanManagementApiError(
      message,
      error.response?.status,
      errorData?.details
    );
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const axiosLikeError = error as {
      response?: {
        status?: number;
        data?: {
          error?: { message?: string; details?: string[] };
          message?: string;
          detail?: string;
          details?: Record<string, unknown>;
        };
      };
      message?: string;
    };

    const errorData = axiosLikeError.response?.data;
    const message =
      errorData?.error?.message ??
      errorData?.message ??
      errorData?.detail ??
      axiosLikeError.message ??
      'An unexpected error occurred';

    throw new MealPlanManagementApiError(
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

    throw new MealPlanManagementApiError(
      errorObj.message,
      errorObj.status,
      errorObj.details
    );
  }

  if (error instanceof Error) {
    throw new MealPlanManagementApiError(error.message);
  }

  throw new MealPlanManagementApiError('An unexpected error occurred');
};

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

export interface PaginationParams {
  page?: number;
  limit?: number;
}
