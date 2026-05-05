import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/modules/auth/hooks";
import { getApiErrorMessage } from "@/shared/api/http";
import { AuthLayout } from "../components/AuthLayout";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const mutation = useForgotPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await mutation.mutateAsync(values.email);
      setSent(true);
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

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {form.getValues("email")}
              </span>
              , we&apos;ve sent a password reset link. It expires in 1 hour.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setSent(false)}
            >
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Reset your password
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={mutation.isPending || !form.formState.isValid}
                type="submit"
              >
                {mutation.isPending ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
