import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Lock,
  ShieldCheck,
  Download,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useGdprExport,
} from "../hooks";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "privacy", label: "Data & Privacy", icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

const BUSINESS_TYPES = [
  { value: "", label: "— select —" },
  { value: "sme", label: "SME" },
  { value: "professional-services", label: "Professional Services" },
  { value: "advisory", label: "Advisory" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "association", label: "Association" },
  { value: "growth-stage", label: "Growth-Stage" },
];

// ── Profile tab ──────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  businessType: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

function ProfileTab() {
  const { data: profile, isLoading } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? "",
      businessType: profile?.businessType ?? "",
    },
  });

  const onSubmit = (values: ProfileForm) => {
    mutate({
      name: values.name,
      businessType: values.businessType || null,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} placeholder="Your name" />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          value={profile?.email ?? ""}
          disabled
          className="opacity-60 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="businessType">Business Type</Label>
        <select
          id="businessType"
          {...register("businessType")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {BUSINESS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-1">
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// ── Security tab ─────────────────────────────────────────────
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Must be at least 8 characters").max(128),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

function SecurityTab() {
  const { mutate, isPending, isSuccess } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = (values: PasswordForm) => {
    mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => reset() },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {isSuccess && (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Password updated successfully.
        </div>
      )}

      <div className="pt-1">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Change Password
        </Button>
      </div>
    </form>
  );
}

// ── Data & Privacy tab ────────────────────────────────────────
function PrivacyTab() {
  const { mutate: exportData, isPending } = useGdprExport();

  return (
    <div className="space-y-6">
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your Rights Under UK GDPR</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <span className="font-medium text-foreground">Purpose:</span> Your
            data is processed to provide growth analytics and AI-driven
            recommendations.
          </p>
          <p>
            <span className="font-medium text-foreground">Legal basis:</span>{" "}
            Legitimate interest and user consent under UK GDPR.
          </p>
          <p>
            <span className="font-medium text-foreground">Retention:</span> Data
            is retained for the duration of your subscription plus 90 days after
            cancellation.
          </p>
          <p>
            <span className="font-medium text-foreground">Your rights:</span>{" "}
            Access, rectify, erase, restrict processing, and port your data.
          </p>
          <p>
            <span className="font-medium text-foreground">Contact:</span>{" "}
            privacy@grospective.io
          </p>
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Export Your Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Download a complete copy of all personal data held in your account
            (UK GDPR Article 20 — Right to Data Portability). The export
            includes your profile, marketing spend entries, BD activities,
            operational costs, revenue data, ecosystem records, and actions.
          </p>
          <Button
            variant="outline"
            onClick={() => exportData()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Data Export (JSON)
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-amber-600">
              Right to Erasure:
            </span>{" "}
            To request deletion of your account and all associated data, email{" "}
            <span className="font-medium">privacy@grospective.io</span> with the
            subject line "Data Deletion Request". We will process your request
            within 30 days in accordance with UK GDPR Article 17.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and privacy preferences.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card className="border border-border/50">
        <CardContent className="pt-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "privacy" && <PrivacyTab />}
        </CardContent>
      </Card>
    </div>
  );
}
