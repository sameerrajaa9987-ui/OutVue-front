import { http } from "@/shared/api/http";
import type { AuthUser } from "@/modules/auth/types";

export type UpdateProfilePayload = {
  name?: string;
  businessType?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export async function getProfile() {
  const res = await http.get<{ data: AuthUser }>("/settings/profile");
  return res.data.data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const res = await http.patch<{ data: AuthUser; message: string }>(
    "/settings/profile",
    payload,
  );
  return res.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const res = await http.post<{ data: { changed: boolean }; message: string }>(
    "/settings/password",
    payload,
  );
  return res.data;
}

export async function downloadGdprExport(): Promise<void> {
  const res = await http.get("/settings/gdpr-export", {
    responseType: "blob",
  });

  const url = URL.createObjectURL(new Blob([res.data as BlobPart]));
  const a = document.createElement("a");
  a.href = url;
  const disposition = res.headers["content-disposition"] as string | undefined;
  const match = disposition?.match(/filename="(.+)"/);
  a.download = match?.[1] ?? `grospective-export-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
