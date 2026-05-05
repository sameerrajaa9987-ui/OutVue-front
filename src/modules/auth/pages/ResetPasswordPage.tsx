import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/modules/auth/hooks";
import { getApiErrorMessage } from "@/shared/api/http";
import { AuthLayout } from "../components/AuthLayout";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Needs an uppercase letter")
      .regex(/[a-z]/, "Needs a lowercase letter")
      .regex(/\d/, "Needs a number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const mutation = useResetPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    if (!token) {
      setError("Missing reset token. Please use the link from your email.");
      return;
    }
    try {
      await mutation.mutateAsync({ token, password: values.password });
      setSuccess(true);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Password updated
            </h1>
            <p className="text-sm text-muted-foreground">
              Your password has been reset. You can now sign in.
            </p>
            <Button
              className="mt-2"
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to sign in
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Set new password
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!token && (
              <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning-foreground">
                No reset token found. Please use the link from your email.
              </div>
            )}

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={
                  mutation.isPending || !form.formState.isValid || !token
                }
                type="submit"
              >
                {mutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
