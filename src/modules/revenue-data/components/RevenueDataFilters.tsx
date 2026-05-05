import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { RevenueDataFilters as Filters } from "../types";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function RevenueDataFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by source…"
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Input
        className="w-[200px]"
        placeholder="Source filter"
        value={filters.source ?? ""}
        onChange={(e) =>
          onChange({ ...filters, source: e.target.value || undefined })
        }
      />
      <Input
        className="w-[160px]"
        placeholder="Period (e.g. 2026-01)"
        value={filters.period ?? ""}
        onChange={(e) =>
          onChange({ ...filters, period: e.target.value || undefined })
        }
      />
    </div>
  );
}
