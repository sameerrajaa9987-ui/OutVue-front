import { http } from "@/shared/api/http";
import type { AuthResponse, AuthUser } from "../types";

export async function login(email: string, password: string) {
  const res = await http.post<{ data: AuthResponse }>("/auth/login", {
    email,
    password,
  });
  return res.data.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  businessType?: string;
}) {
  const res = await http.post<{ data: AuthResponse }>("/auth/register", data);
  return res.data.data;
}

export async function forgotPassword(email: string) {
  const res = await http.post<{ data: { sent: boolean }; message: string }>(
    "/auth/forgot-password",
    { email },
  );
  return res.data;
}

export async function resetPassword(token: string, password: string) {
  const res = await http.post<{ data: { reset: boolean }; message: string }>(
    "/auth/reset-password",
    { token, password },
  );
  return res.data;
}

export async function getMe() {
  const res = await http.get<{ data: { user: AuthUser } }>("/auth/me");
  return res.data.data.user;
}

export async function logout(refreshToken?: string, allDevices?: boolean) {
  const res = await http.post<{ data: { revokedAll: boolean } }>(
    "/auth/logout",
    { refreshToken, allDevices },
  );
  return res.data.data;
}
