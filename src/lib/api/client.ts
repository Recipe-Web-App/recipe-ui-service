import axios, { AxiosError, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }

    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'An unexpected error occurred';

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as { message?: string } | undefined;
    const message = errorData?.message ?? error.message;
    throw new ApiError(message, error.response?.status);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError('An unexpected error occurred');
};
