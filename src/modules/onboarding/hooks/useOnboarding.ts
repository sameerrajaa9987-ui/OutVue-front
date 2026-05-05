import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as onboardingApi from "../api/onboardingApi";
import type { BusinessProfile } from "../types";

const PROFILE_KEY = ["onboarding", "profile"];

export function useBusinessProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: onboardingApi.getProfile,
  });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BusinessProfile>) =>
      onboardingApi.saveProfile(data),
    onSuccess: (data) => {
      qc.setQueryData(PROFILE_KEY, data);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BusinessProfile>) =>
      onboardingApi.updateProfile(data),
    onSuccess: (data) => {
      qc.setQueryData(PROFILE_KEY, data);
    },
  });
}
