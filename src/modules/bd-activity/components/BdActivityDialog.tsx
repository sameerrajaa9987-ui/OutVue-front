import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { BdActivity } from "../types";
import { BD_TYPES } from "../types";

const schema = z.object({
  type: z.string().min(1, "Type is required"),
  name: z.string().min(1, "Name is required"),
  cost: z.coerce.number().min(0),
  date: z.string().min(1, "Date is required"),
  leadsGenerated: z.coerce.number().int().min(0),
  opportunitiesCreated: z.coerce.number().int().min(0),
  revenueConverted: z.coerce.number().min(0),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  defaultValues?: BdActivity | null;
  isPending?: boolean;
};

export function BdActivityDialog({ open, onClose, onSubmit, defaultValues, isPending }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "", name: "", cost: 0, date: "", leadsGenerated: 0, opportunitiesCreated: 0, revenueConverted: 0, notes: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? { type: defaultValues.type, name: defaultValues.name, cost: defaultValues.cost, date: defaultValues.date.slice(0, 10), leadsGenerated: defaultValues.leadsGenerated, opportunitiesCreated: defaultValues.opportunitiesCreated, revenueConverted: defaultValues.revenueConverted, notes: defaultValues.notes }
          : { type: "", name: "", cost: 0, date: "", leadsGenerated: 0, opportunitiesCreated: 0, revenueConverted: 0, notes: "" },
      );
    }
  }, [open, defaultValues, reset]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{defaultValues ? "Edit Activity" : "Add Activity"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select id="type" {...register("type")}>
                <option value="">Select type…</option>
                {BD_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </Select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input id="name" placeholder="e.g. Tech Conference 2026" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (£)</Label>
                <Input id="cost" type="number" step="0.01" {...register("cost")} />
                {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadsGenerated">Leads</Label>
                <Input id="leadsGenerated" type="number" {...register("leadsGenerated")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunitiesCreated">Opportunities</Label>
                <Input id="opportunitiesCreated" type="number" {...register("opportunitiesCreated")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueConverted">Revenue (£)</Label>
                <Input id="revenueConverted" type="number" step="0.01" {...register("revenueConverted")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                {...register("notes")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Optional notes…"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : defaultValues ? "Update Activity" : "Add Activity"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
