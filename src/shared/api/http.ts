import axios from "axios";
import { store } from "@/app/store";
import { clearAuth, setAuth } from "@/modules/auth/authSlice";
import type { AuthUser } from "@/modules/auth/types";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 20_000,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  refreshQueue = [];
}

http.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (err: unknown) => {
    if (!axios.isAxiosError(err) || !err.config || !err.response) {
      return Promise.reject(err);
    }

    const originalRequest = err.config as typeof err.config & {
      _retry?: boolean;
    };

    if (err.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(err);
    }

    const { refreshToken } = store.getState().auth;
    if (!refreshToken) {
      store.dispatch(clearAuth());
      redirectToLogin();
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        originalRequest._retry = true;
        return http(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const res = await axios.post<{
        data: {
          accessToken: string;
          refreshToken: string;
          user: AuthUser;
        };
      }>(
        `${http.defaults.baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 10_000 },
      );

      const data = res.data.data;
      store.dispatch(
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        }),
      );

      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return http(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      store.dispatch(clearAuth());
      redirectToLogin();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

function redirectToLogin() {
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.assign("/login");
  }
}

type ApiValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

type ApiErrorResponse = {
  error?: {
    message?: string;
    details?: {
      issues?: ApiValidationIssue[];
    };
  };
};

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) return String(data.error.message);
    const issueMsg = data?.error?.details?.issues?.[0]?.message;
    if (issueMsg) return String(issueMsg);
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
