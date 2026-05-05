export type Role = "Admin" | "Manager" | "User";

export type SubscriptionTier =
  | "starter"
  | "professional"
  | "growth"
  | "enterprise";

export type SubscriptionStatus =
  | "trial"
  | "pilot"
  | "active"
  | "suspended"
  | "cancelled";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  businessType?: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string | null;
  pilotEndsAt?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
