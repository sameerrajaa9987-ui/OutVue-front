import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/modules/auth/hooks";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/modules/auth/authSlice";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { AuthLayout } from "../components/AuthLayout";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const result = await loginMutation.mutateAsync(values);
      dispatch(setAuth(result));
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="lg:hidden flex items-center gap-2 text-primary mb-2">
          <LogIn className="h-5 w-5" />
          <span className="text-lg font-bold tracking-tight">OUTVUE</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your growth intelligence dashboard.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={loginMutation.isPending || !form.formState.isValid}
            type="submit"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
