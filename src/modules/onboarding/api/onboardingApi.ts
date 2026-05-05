import { http } from "@/shared/api/http";
import type { BusinessProfile } from "../types";

export async function getProfile() {
  const res = await http.get<{ data: BusinessProfile | null }>(
    "/onboarding/profile",
  );
  return res.data.data;
}

export async function saveProfile(data: Partial<BusinessProfile>) {
  const res = await http.post<{ data: BusinessProfile }>(
    "/onboarding/profile",
    data,
  );
  return res.data.data;
}

export async function updateProfile(data: Partial<BusinessProfile>) {
  const res = await http.put<{ data: BusinessProfile }>(
    "/onboarding/profile",
    data,
  );
  return res.data.data;
}
