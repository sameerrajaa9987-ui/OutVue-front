import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { RevenueData } from "../types";

const schema = z.object({
  source: z.string().min(1, "Source is required"),
  leads: z.coerce.number().int().min(0),
  conversions: z.coerce.number().int().min(0),
  dealValue: z.coerce.number().min(0),
  recurringRevenue: z.coerce.number().min(0),
  period: z.string().min(1, "Period is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  defaultValues?: RevenueData | null;
  isPending?: boolean;
};

export function RevenueDataDialog({ open, onClose, onSubmit, defaultValues, isPending }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { source: "", leads: 0, conversions: 0, dealValue: 0, recurringRevenue: 0, period: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? { source: defaultValues.source, leads: defaultValues.leads, conversions: defaultValues.conversions, dealValue: defaultValues.dealValue, recurringRevenue: defaultValues.recurringRevenue, period: defaultValues.period }
          : { source: "", leads: 0, conversions: 0, dealValue: 0, recurringRevenue: 0, period: "" },
      );
    }
  }, [open, defaultValues, reset]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{defaultValues ? "Edit Revenue Entry" : "Add Revenue Entry"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" placeholder="e.g. Google Ads, Referral, Organic" {...register("source")} />
              {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leads">Leads</Label>
                <Input id="leads" type="number" {...register("leads")} />
                {errors.leads && <p className="text-xs text-destructive">{errors.leads.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversions">Conversions</Label>
                <Input id="conversions" type="number" {...register("conversions")} />
                {errors.conversions && <p className="text-xs text-destructive">{errors.conversions.message}</p>}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dealValue">Deal Value (£)</Label>
                <Input id="dealValue" type="number" step="0.01" {...register("dealValue")} />
                {errors.dealValue && <p className="text-xs text-destructive">{errors.dealValue.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recurringRevenue">Recurring Revenue (£)</Label>
                <Input id="recurringRevenue" type="number" step="0.01" {...register("recurringRevenue")} />
                {errors.recurringRevenue && <p className="text-xs text-destructive">{errors.recurringRevenue.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Input id="period" placeholder="e.g. 2026-01 or 2026-Q1" {...register("period")} />
              {errors.period && <p className="text-xs text-destructive">{errors.period.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : defaultValues ? "Update Entry" : "Add Entry"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
