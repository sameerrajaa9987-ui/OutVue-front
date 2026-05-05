import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Platform metadata ─────────────────────────────────────────────────────────

const PLATFORMS = [
  { value: "meta", label: "Meta (Facebook / Instagram)" },
  { value: "google", label: "Google Ads" },
  { value: "linkedin", label: "LinkedIn Ads" },
] as const;

type Platform = "meta" | "google" | "linkedin" | "";

const PLATFORM_CONFIG: Record<
  Exclude<Platform, "">,
  {
    color: string;
    accountIdLabel: string;
    accountIdPlaceholder: string;
    accountIdHint: string;
    tokenLabel: string;
    tokenHint: string;
    showRefreshToken: boolean;
    refreshTokenLabel?: string;
    refreshTokenHint?: string;
    steps: string[];
    docsNote: string;
  }
> = {
  meta: {
    color: "border-blue-500/30 bg-blue-500/5",
    accountIdLabel: "Ad Account ID",
    accountIdPlaceholder: "act_123456789  or  123456789",
    accountIdHint:
      "Your numeric ad account ID from Meta Business Manager → Accounts → Ad Accounts. The act_ prefix is added automatically.",
    tokenLabel: "System User Access Token",
    tokenHint:
      "A System User token never expires and is recommended. Generate it in Meta Business Manager → Users → System Users → Generate Token.",
    showRefreshToken: false,
    steps: [
      "Open Meta Business Manager (business.facebook.com)",
      "Go to Business Settings → Users → System Users",
      "Create a System User with Admin or Employee role",
      "Click Generate New Token → select your app",
      "Enable ads_management and ads_read permissions",
      "Copy the generated token (it won't be shown again)",
      "Your Ad Account ID is in Business Settings → Accounts → Ad Accounts",
    ],
    docsNote:
      "System User tokens do not expire. User tokens expire in ~60 days and will stop syncing.",
  },
  google: {
    color: "border-red-500/30 bg-red-500/5",
    accountIdLabel: "Customer ID",
    accountIdPlaceholder: "1234567890",
    accountIdHint:
      "Your 10-digit Google Ads Customer ID — no dashes. Find it in the top-right of your Google Ads account.",
    tokenLabel: "OAuth 2.0 Access Token",
    tokenHint:
      "An OAuth 2.0 access token scoped to https://www.googleapis.com/auth/adwords. Generated via Google Cloud Console OAuth flow.",
    showRefreshToken: true,
    refreshTokenLabel: "OAuth Refresh Token",
    refreshTokenHint:
      "The refresh token lets OUTVUE automatically renew access tokens. Provide this alongside the access token for uninterrupted syncing.",
    steps: [
      "In Google Cloud Console, create an OAuth 2.0 client (Web application type)",
      "Add https://developers.google.com/oauthplayground as an authorised redirect URI",
      "Open OAuth 2.0 Playground (developers.google.com/oauthplayground)",
      "In settings (⚙) use your own Client ID and Client Secret",
      "Authorise scope: https://www.googleapis.com/auth/adwords",
      "Click Exchange authorisation code for tokens",
      "Copy both the Access Token and Refresh Token",
      "Your Developer Token is in Google Ads → Admin → API Center",
      "Set GOOGLE_ADS_DEVELOPER_TOKEN in the backend .env file",
    ],
    docsNote:
      "Access tokens expire in ~1 hour. Provide a Refresh Token so OUTVUE can renew automatically. A Developer Token must also be set in backend .env.",
  },
  linkedin: {
    color: "border-indigo-500/30 bg-indigo-500/5",
    accountIdLabel: "Sponsored Account ID",
    accountIdPlaceholder: "123456789",
    accountIdHint:
      "Your numeric LinkedIn Campaign Manager account ID. Find it in Campaign Manager → Account Assets — the number in the URL after /accounts/.",
    tokenLabel: "Access Token",
    tokenHint:
      "An OAuth 2.0 token with rw_ads scope. Alternatively, generate a Direct API token in Campaign Manager → Data → Signals Manager → Direct API.",
    showRefreshToken: false,
    steps: [
      "Option A — Direct API Token (easiest):",
      "  Open LinkedIn Campaign Manager",
      "  Go to Data → Signals Manager → Direct API",
      "  Click Generate access token and sign in",
      "  Copy the token (LinkedIn does not store it)",
      "",
      "Option B — OAuth App Token:",
      "  Create an app at linkedin.com/developers",
      "  Add the Marketing Platform product to your app",
      "  Request rw_ads and r_ads_reporting scopes",
      "  Implement the OAuth 2.0 authorisation code flow",
      "  Exchange the code for an access token (valid 60 days)",
    ],
    docsNote:
      "LinkedIn access tokens expire after 60 days. You must reconnect and paste a new token when it expires.",
  },
};

// ── Zod schema ────────────────────────────────────────────────────────────────

const schema = z.object({
  platform: z.enum(["meta", "google", "linkedin"], { required_error: "Select a platform" }),
  accountId: z.string().min(1, "Account ID is required").trim(),
  accessToken: z.string().min(1, "Access token is required").trim(),
  refreshToken: z.string().trim().optional(),
  label: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  isPending?: boolean;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ConnectAccountDialog({ open, onClose, onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platform: undefined, accountId: "", accessToken: "", refreshToken: "", label: "" },
  });

  const selectedPlatform = watch("platform") as Platform;
  const config = selectedPlatform ? PLATFORM_CONFIG[selectedPlatform] : null;

  useEffect(() => {
    if (open) reset({ platform: undefined, accountId: "", accessToken: "", refreshToken: "", label: "" });
  }, [open, reset]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Connect Ad Account</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 p-6">

            {/* Security notice */}
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Tokens are encrypted with AES-256-GCM before storage. Plaintext credentials are never persisted.
              </p>
            </div>

            {/* Platform select */}
            <div className="space-y-1.5">
              <Label htmlFor="platform">Platform *</Label>
              <Select id="platform" {...register("platform")}>
                <option value="">Select platform…</option>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </Select>
              {errors.platform && (
                <p className="text-xs text-destructive">{errors.platform.message}</p>
              )}
            </div>

            {/* Platform-specific setup instructions */}
            {config && (
              <div className={cn("rounded-lg border p-4 space-y-2", config.color)}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  How to get your credentials
                </div>
                <ol className="space-y-1 text-xs text-muted-foreground pl-1">
                  {config.steps.map((step, i) =>
                    step === "" ? (
                      <li key={i} className="h-1" />
                    ) : (
                      <li key={i} className={step.startsWith("  ") ? "pl-4" : ""}>
                        {!step.startsWith("  ") && !step.endsWith(":") && (
                          <span className="font-medium text-foreground mr-1">{i + 1}.</span>
                        )}
                        {step.trimStart()}
                      </li>
                    )
                  )}
                </ol>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium pt-1 border-t border-amber-200/50">
                  ⚠ {config.docsNote}
                </p>
              </div>
            )}

            <Separator />

            {/* Account ID */}
            <div className="space-y-1.5">
              <Label htmlFor="accountId">
                {config?.accountIdLabel ?? "Account ID"} *
              </Label>
              <Input
                id="accountId"
                placeholder={config?.accountIdPlaceholder ?? "Enter account ID"}
                {...register("accountId")}
              />
              {config && (
                <p className="text-xs text-muted-foreground">{config.accountIdHint}</p>
              )}
              {errors.accountId && (
                <p className="text-xs text-destructive">{errors.accountId.message}</p>
              )}
            </div>

            {/* Access Token */}
            <div className="space-y-1.5">
              <Label htmlFor="accessToken">
                {config?.tokenLabel ?? "Access Token"} *
              </Label>
              <Input
                id="accessToken"
                type="password"
                placeholder="Paste your access token"
                {...register("accessToken")}
              />
              {config && (
                <p className="text-xs text-muted-foreground">{config.tokenHint}</p>
              )}
              {errors.accessToken && (
                <p className="text-xs text-destructive">{errors.accessToken.message}</p>
              )}
            </div>

            {/* Refresh Token — shown only for Google */}
            {config?.showRefreshToken && (
              <div className="space-y-1.5">
                <Label htmlFor="refreshToken">
                  {config.refreshTokenLabel ?? "Refresh Token"}{" "}
                  <span className="text-muted-foreground font-normal">(recommended)</span>
                </Label>
                <Input
                  id="refreshToken"
                  type="password"
                  placeholder="Paste OAuth refresh token"
                  {...register("refreshToken")}
                />
                {config.refreshTokenHint && (
                  <p className="text-xs text-muted-foreground">{config.refreshTokenHint}</p>
                )}
              </div>
            )}

            <Separator />

            {/* Label */}
            <div className="space-y-1.5">
              <Label htmlFor="label">
                Label{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="label"
                placeholder="e.g. Main Business Account, EMEA Campaign"
                {...register("label")}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Connecting…" : "Connect Account"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
