import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MARKETING_PLATFORMS, type MarketingSpendFilters as Filters } from "../types";

type MarketingSpendFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function MarketingSpendFilters({
  filters,
  onChange,
}: MarketingSpendFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search campaigns…"
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select
        className="w-[200px]"
        value={filters.platform ?? ""}
        onChange={(e) =>
          onChange({ ...filters, platform: e.target.value || undefined })
        }
      >
        <option value="">All Platforms</option>
        {MARKETING_PLATFORMS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </Select>
      <Input
        type="date"
        className="w-[160px]"
        value={filters.startDate ?? ""}
        onChange={(e) =>
          onChange({ ...filters, startDate: e.target.value || undefined })
        }
        placeholder="From"
      />
      <Input
        type="date"
        className="w-[160px]"
        value={filters.endDate ?? ""}
        onChange={(e) =>
          onChange({ ...filters, endDate: e.target.value || undefined })
        }
        placeholder="To"
      />
    </div>
  );
}
