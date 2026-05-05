import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as billingApi from "../api/billingApi";

export function useTiers() {
  return useQuery({
    queryKey: ["billing-tiers"],
    queryFn: billingApi.getTiers,
  });
}

export function usePilots() {
  return useQuery({
    queryKey: ["billing-pilots"],
    queryFn: billingApi.getPilots,
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ["billing-subscription"],
    queryFn: billingApi.getSubscription,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ tier, billingCycle }: { tier: string; billingCycle: string }) =>
      billingApi.createCheckout(tier, billingCycle),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: billingApi.cancelSubscription,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing-subscription"] }),
  });
}

export function useUpgradeSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tier, billingCycle }: { tier: string; billingCycle?: string }) =>
      billingApi.upgradeSubscription(tier, billingCycle),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing-subscription"] }),
  });
}
