import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { updateUser } from "@/modules/auth/authSlice";
import { getApiErrorMessage } from "@/shared/api/http";
import {
  getProfile,
  updateProfile,
  changePassword,
  downloadGdprExport,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "../api/settingsApi";

const PROFILE_KEY = ["settings", "profile"] as const;

export function useProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: getProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: PROFILE_KEY });
      dispatch(
        updateUser({
          name: res.data.name,
          businessType: res.data.businessType ?? undefined,
        }),
      );
      toast.success(res.message ?? "Profile updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (res) => toast.success(res.message ?? "Password changed"),
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useGdprExport() {
  return useMutation({
    mutationFn: downloadGdprExport,
    onSuccess: () => toast.success("Your data export has been downloaded"),
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
