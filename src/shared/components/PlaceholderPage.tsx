import { Construction } from "lucide-react";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Construction className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This module is coming soon.
        </p>
      </div>
    </div>
  );
}
