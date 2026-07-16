import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig, type Method } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
const REFRESH_PATH = "/auth/refresh";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[] | undefined>;

  constructor(message: string, status: number, errors?: Record<string, string[] | undefined>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface ErrorResponseBody {
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

class ApiClient {
  private readonly http: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<(error?: unknown) => void> = [];

  constructor(baseURL: string) {
    this.http = axios.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error)
    );
  }

  private async handleResponseError(error: AxiosError<ErrorResponseBody>) {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isRefreshCall = originalRequest?.url === REFRESH_PATH;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isRefreshCall) {
      throw this.toApiError(error);
    }

    originalRequest._retry = true;

    try {
      await this.refreshAccessToken();
      return this.http.request(originalRequest);
    } catch (refreshError) {
      throw this.toApiError(refreshError as AxiosError<ErrorResponseBody>);
    }
  }

  private refreshAccessToken(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push((error) => (error ? reject(error) : resolve()));
      });
    }

    this.isRefreshing = true;

    return this.http
      .post(REFRESH_PATH)
      .then(() => {
        this.refreshQueue.forEach((resolveQueued) => resolveQueued());
      })
      .catch((error) => {
        this.refreshQueue.forEach((resolveQueued) => resolveQueued(error));
        throw error;
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshQueue = [];
      });
  }

  private toApiError(error: AxiosError<ErrorResponseBody>): ApiError {
    if (error.isAxiosError) {
      return new ApiError(
        error.response?.data.message ?? "Something went wrong",
        error.response?.status ?? 500,
        error.response?.data.errors
      );
    }
    return new ApiError("Something went wrong", 500);
  }

  private async request<T>(path: string, method: Method, body?: unknown): Promise<T> {
    try {
      const response = await this.http.request<T>({ url: path, method, data: body });
      return response.data;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw this.toApiError(err as AxiosError<ErrorResponseBody>);
    }
  }

  get<T>(path: string) {
    return this.request<T>(path, "GET");
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, "POST", body);
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, "PUT", body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, "PATCH", body);
  }

  delete<T>(path: string) {
    return this.request<T>(path, "DELETE");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
