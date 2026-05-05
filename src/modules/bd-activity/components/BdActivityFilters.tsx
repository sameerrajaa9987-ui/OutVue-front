import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BD_TYPES, type BdActivityFilters as Filters } from "../types";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function BdActivityFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search activities…"
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select
        className="w-[180px]"
        value={filters.type ?? ""}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      >
        <option value="">All Types</option>
        {BD_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>
      <Input
        type="date"
        className="w-[160px]"
        value={filters.startDate ?? ""}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
      />
      <Input
        type="date"
        className="w-[160px]"
        value={filters.endDate ?? ""}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
      />
    </div>
  );
}
