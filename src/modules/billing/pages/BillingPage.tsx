import { useState } from "react";
import {
  CreditCard,
  Check,
  Crown,
  Zap,
  Rocket,
  Building2,
  Loader2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTiers, usePilots, useSubscription, useCreateCheckout, useCancelSubscription } from "../hooks";

const TIER_ICONS: Record<string, typeof Zap> = {
  starter: Zap,
  professional: Rocket,
  growth: Crown,
  enterprise: Building2,
};

const TIER_COLORS: Record<string, string> = {
  starter: "border-blue-500/30 hover:border-blue-500/60",
  professional: "border-violet-500/30 hover:border-violet-500/60",
  growth: "border-emerald-500/30 hover:border-emerald-500/60",
  enterprise: "border-amber-500/30 hover:border-amber-500/60",
};

const TIER_BADGE_COLORS: Record<string, string> = {
  starter: "bg-blue-500/10 text-blue-600",
  professional: "bg-violet-500/10 text-violet-600",
  growth: "bg-emerald-500/10 text-emerald-600",
  enterprise: "bg-amber-500/10 text-amber-600",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  trial: { label: "Trial", color: "bg-blue-500" },
  pilot: { label: "Pilot", color: "bg-violet-500" },
  active: { label: "Active", color: "bg-emerald-500" },
  suspended: { label: "Suspended", color: "bg-amber-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
  upgraded: { label: "Upgraded", color: "bg-emerald-500" },
};

const fmtPrice = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

const FEATURE_LABELS: Record<string, string> = {
  channelsTracked: "Channels Tracked",
  aiInsights: "AI Insights",
  scenarioModelling: "Scenario Modelling",
  bdTracking: "BD Tracking",
  usersAllowed: "Users Allowed",
};

function featureDisplay(key: string, val: unknown): string {
  if (val === true) return "Included";
  if (val === false) return "Not included";
  if (val === Infinity || val === null) return "Unlimited";
  if (typeof val === "number" && val > 9999) return "Unlimited";
  if (typeof val === "string") return val.charAt(0).toUpperCase() + val.slice(1);
  return String(val);
}

export function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { data: tiers, isLoading: tiersLoading } = useTiers();
  const { data: pilots } = usePilots();
  const { data: sub, isLoading: subLoading } = useSubscription();
  const checkoutMut = useCreateCheckout();
  const cancelMut = useCancelSubscription();

  const handleCheckout = (tierId: string) => {
    checkoutMut.mutate(
      { tier: tierId, billingCycle },
      {
        onSuccess: (data) => {
          if (data.url) window.location.href = data.url;
          else toast.success("Checkout session created");
        },
        onError: () => toast.error("Failed to create checkout"),
      },
    );
  };

  const handleCancel = () => {
    cancelMut.mutate(undefined, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error("Failed to cancel subscription"),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan, billing cycle, and payment.</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <Skeleton className="h-20" />
          ) : sub ? (
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{sub.tierName}</span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", TIER_BADGE_COLORS[sub.tier] || "bg-muted text-muted-foreground")}>
                    {sub.tierName}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground capitalize">{sub.billingCycle} billing</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[sub.status]?.color || "bg-gray-400")} />
                <span className="text-sm font-medium">{STATUS_CONFIG[sub.status]?.label || sub.status}</span>
              </div>

              {sub.status === "trial" && sub.trialEndsAt && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Trial ends {new Date(sub.trialEndsAt).toLocaleDateString("en-GB")}
                </div>
              )}

              {sub.currentPeriodEnd && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Renews {new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB")}
                </div>
              )}

              {sub.cancelAtPeriodEnd && (
                <div className="flex items-center gap-1.5 text-sm text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cancels at period end
                </div>
              )}

              {sub.status === "active" && !sub.cancelAtPeriodEnd && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancel}
                  disabled={cancelMut.isPending}
                >
                  {cancelMut.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancel Plan"}
                </Button>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <Button
          size="sm"
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </Button>
        <Button
          size="sm"
          variant={billingCycle === "annual" ? "default" : "outline"}
          onClick={() => setBillingCycle("annual")}
          className="gap-1.5"
        >
          Annual
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
            SAVE 10%
          </span>
        </Button>
      </div>

      {/* Pricing Cards */}
      {tiersLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />)}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers?.map((tier) => {
            const TierIcon = TIER_ICONS[tier.id] || Zap;
            const isCurrent = sub?.tier === tier.id;
            const price = billingCycle === "annual" ? tier.annualPrice : tier.monthlyPrice;

            return (
              <Card
                key={tier.id}
                className={cn(
                  "relative transition-all",
                  TIER_COLORS[tier.id],
                  isCurrent && "ring-2 ring-primary",
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
                    CURRENT PLAN
                  </div>
                )}
                <CardHeader className="pb-2 pt-6">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", TIER_BADGE_COLORS[tier.id])}>
                      <TierIcon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    {price ? (
                      <>
                        <span className="text-3xl font-bold">{fmtPrice(price)}</span>
                        <span className="text-muted-foreground text-sm">
                          /{billingCycle === "annual" ? "year" : "month"}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">Custom</span>
                    )}
                  </div>

                  <ul className="space-y-2.5">
                    {Object.entries(tier.features).map(([key, val]) => {
                      const included = val !== false;
                      return (
                        <li key={key} className={cn("flex items-center gap-2 text-sm", !included && "text-muted-foreground")}>
                          <Check className={cn("h-4 w-4 shrink-0", included ? "text-emerald-500" : "text-muted-foreground/30")} />
                          <span>{FEATURE_LABELS[key] || key}: <strong>{featureDisplay(key, val)}</strong></span>
                        </li>
                      );
                    })}
                  </ul>

                  {tier.id === "enterprise" ? (
                    <Button className="w-full" variant="outline">
                      Contact Sales
                    </Button>
                  ) : isCurrent ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleCheckout(tier.id)}
                      disabled={checkoutMut.isPending}
                    >
                      {checkoutMut.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `Get ${tier.name}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pilot Programs */}
      {pilots && pilots.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Pilot Programs</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {pilots.map((pilot) => (
              <Card key={pilot.id} className="border-dashed">
                <CardContent className="p-5">
                  <h3 className="font-semibold">{pilot.name}</h3>
                  <p className="text-2xl font-bold mt-1">{fmtPrice(pilot.price)}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pilot.durationWeeks} weeks &middot; Converts to{" "}
                    <span className="capitalize font-medium">{pilot.convertsTo}</span>
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 w-full">
                    Start Pilot
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
