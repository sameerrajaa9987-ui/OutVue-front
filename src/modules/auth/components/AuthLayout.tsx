import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full">
      {/* Left panel – brand */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-sidebar p-10 text-sidebar-foreground">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/25 backdrop-blur">
              <TrendingUp className="h-6 w-6 text-sidebar-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              OUTVUE
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-sidebar-foreground/80">
            Growth Intelligence Platform
          </p>
        </div>

        <div className="space-y-6">
          <blockquote className="border-l-2 border-sidebar-foreground/35 pl-4 text-lg leading-relaxed italic text-sidebar-foreground/95">
            "Understand your true growth cost, marketing ROI, and budget
            allocation — all in one place."
          </blockquote>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "360\u00b0", label: "Growth Visibility" },
              { value: "AI", label: "Driven Insights" },
              { value: "ROI", label: "Tracking" },
              { value: "BD", label: "Analytics" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-sidebar-border bg-sidebar-accent/60 p-3 backdrop-blur"
              >
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-sidebar-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/65">
          &copy; {new Date().getFullYear()} OUTVUE&trade;. All rights reserved.
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
