import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Building2,
  Target,
  BarChart3,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSaveProfile } from "../hooks";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import {
  INDUSTRIES,
  BUSINESS_SIZES,
  BUDGET_RANGES,
  OBJECTIVES,
  REVENUE_CHANNELS,
  ACQUISITION_METHODS,
  REPORTING_PERIODS,
} from "../types";

const STEPS = [
  { id: 0, label: "Business", icon: Building2 },
  { id: 1, label: "Goals", icon: Target },
  { id: 2, label: "Channels", icon: BarChart3 },
  { id: 3, label: "Done", icon: Check },
];

type FormState = {
  industry: string;
  businessSize: string;
  annualBudgetRange: string;
  teamSize: string;
  mainObjective: string;
  keyRevenueChannels: string[];
  customerAcquisitionMethods: string[];
  preferredReportingPeriod: string;
};

const DEFAULT_FORM: FormState = {
  industry: "",
  businessSize: "",
  annualBudgetRange: "",
  teamSize: "",
  mainObjective: "",
  keyRevenueChannels: [],
  customerAcquisitionMethods: [],
  preferredReportingPeriod: "monthly",
};

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {active && <Check className="mr-1 inline-block h-3 w-3" />}
      {label}
    </button>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);
  const saveMutation = useSaveProfile();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(
    key: "keyRevenueChannels" | "customerAcquisitionMethods",
    item: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((v) => v !== item)
        : [...prev[key], item],
    }));
  }

  async function handleFinish() {
    setError(null);
    try {
      await saveMutation.mutateAsync({
        industry: form.industry || undefined,
        businessSize: form.businessSize || undefined,
        annualBudgetRange: form.annualBudgetRange || undefined,
        teamSize: form.teamSize ? Number(form.teamSize) : undefined,
        mainObjective: form.mainObjective || undefined,
        keyRevenueChannels: form.keyRevenueChannels,
        customerAcquisitionMethods: form.customerAcquisitionMethods,
        preferredReportingPeriod: form.preferredReportingPeriod || undefined,
      } as Record<string, unknown>);
      toast.success("Profile saved! Let\u2019s get started.");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  const isLastContentStep = step === 2;

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">OUTVUE</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Let&apos;s set up your growth profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This helps us personalise your dashboard and recommendations.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => idx <= step && setStep(idx)}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all",
                  idx === step
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : idx < step
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {idx < step ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <s.icon className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-6 rounded-full",
                    idx < step ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {/* Steps */}
        <Card className="p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">About your business</h2>
                <p className="text-sm text-muted-foreground">
                  Help us understand your organisation so we can tailor metrics.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                  >
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biz-size">Business size</Label>
                  <Select
                    id="biz-size"
                    value={form.businessSize}
                    onChange={(e) =>
                      updateField("businessSize", e.target.value)
                    }
                  >
                    <option value="">Select size...</option>
                    {BUSINESS_SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Annual marketing budget</Label>
                  <Select
                    id="budget"
                    value={form.annualBudgetRange}
                    onChange={(e) =>
                      updateField("annualBudgetRange", e.target.value)
                    }
                  >
                    <option value="">Select range...</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-size">Growth team size</Label>
                  <Input
                    id="team-size"
                    type="number"
                    min={0}
                    placeholder="e.g. 5"
                    value={form.teamSize}
                    onChange={(e) => updateField("teamSize", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Your main objective</h2>
                <p className="text-sm text-muted-foreground">
                  What&apos;s the primary reason you&apos;re using OUTVUE?
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    type="button"
                    onClick={() => updateField("mainObjective", obj.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all",
                      form.mainObjective === obj.value
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        form.mainObjective === obj.value
                          ? "bg-primary/15"
                          : "bg-muted",
                      )}
                    >
                      <Target className="h-4 w-4" />
                    </div>
                    {obj.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="reporting">Preferred reporting period</Label>
                <Select
                  id="reporting"
                  value={form.preferredReportingPeriod}
                  onChange={(e) =>
                    updateField("preferredReportingPeriod", e.target.value)
                  }
                >
                  {REPORTING_PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">
                  Revenue channels & acquisition
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select all that apply. This helps us track the right data.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Key revenue channels</Label>
                <div className="flex flex-wrap gap-2">
                  {REVENUE_CHANNELS.map((ch) => (
                    <ToggleChip
                      key={ch}
                      label={ch}
                      active={form.keyRevenueChannels.includes(ch)}
                      onClick={() =>
                        toggleArrayItem("keyRevenueChannels", ch)
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Customer acquisition methods</Label>
                <div className="flex flex-wrap gap-2">
                  {ACQUISITION_METHODS.map((m) => (
                    <ToggleChip
                      key={m}
                      label={m}
                      active={form.customerAcquisitionMethods.includes(m)}
                      onClick={() =>
                        toggleArrayItem("customerAcquisitionMethods", m)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold">You&apos;re all set!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your growth profile is ready. We&apos;ll personalise your
                dashboard, metrics, and AI recommendations based on your
                answers.
              </p>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => navigate("/dashboard", { replace: true })}
            >
              Skip for now
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              {isLastContentStep ? "Review" : "Continue"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
