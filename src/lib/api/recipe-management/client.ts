import axios, { AxiosError, AxiosResponse } from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL ??
  'http://localhost:8080/api/v1/recipe-management';

export const recipeManagementClient = axios.create({
  baseURL,
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

recipeManagementClient.interceptors.request.use(
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

recipeManagementClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle general errors
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
  }
);

export class RecipeManagementApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RecipeManagementApiError';
    this.status = status;
    this.details = details;
  }
}

export const handleRecipeManagementApiError = (error: unknown): never => {
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

    throw new RecipeManagementApiError(
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

    throw new RecipeManagementApiError(
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

    throw new RecipeManagementApiError(
      errorObj.message,
      errorObj.status,
      errorObj.details
    );
  }

  if (error instanceof Error) {
    throw new RecipeManagementApiError(error.message);
  }

  throw new RecipeManagementApiError('An unexpected error occurred');
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

// Helper for creating FormData for file uploads
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

// Pagination parameters interface
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string[];
}
