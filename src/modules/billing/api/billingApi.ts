import { http } from "@/shared/api/http";

export type TierFeatures = {
  channelsTracked: number;
  aiInsights: string;
  scenarioModelling: boolean | string;
  bdTracking: boolean;
  usersAllowed: number;
};

export type Tier = {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  features: TierFeatures;
};

export type Pilot = {
  id: string;
  name: string;
  price: number;
  durationWeeks: number;
  convertsTo: string;
};

export type Subscription = {
  id: string;
  tier: string;
  tierName: string;
  billingCycle: string;
  status: string;
  features: TierFeatures;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  pilotType: string | null;
  pilotExpiresAt: string | null;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
};

export type CheckoutResult = {
  sessionId: string;
  url: string;
};

export async function getTiers() {
  const res = await http.get<{ data: Tier[] }>("/billing/tiers");
  return res.data.data;
}

export async function getPilots() {
  const res = await http.get<{ data: Pilot[] }>("/billing/pilots");
  return res.data.data;
}

export async function getSubscription() {
  const res = await http.get<{ data: Subscription }>("/billing/subscription");
  return res.data.data;
}

export async function createCheckout(tier: string, billingCycle: string) {
  const res = await http.post<{ data: CheckoutResult }>("/billing/create-checkout", { tier, billingCycle });
  return res.data.data;
}

export async function cancelSubscription() {
  const res = await http.post<{ data: { message: string } }>("/billing/cancel");
  return res.data.data;
}

export async function upgradeSubscription(tier: string, billingCycle?: string) {
  const res = await http.post<{ data: { message: string; tier: string; billingCycle: string } }>("/billing/upgrade", { tier, billingCycle });
  return res.data.data;
}
