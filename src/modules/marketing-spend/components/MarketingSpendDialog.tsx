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
import type { MarketingSpend } from "../types";
import { MARKETING_PLATFORMS } from "../types";

const schema = z.object({
  platform: z.string().min(1, "Platform is required"),
  campaignName: z.string().min(1, "Campaign name is required"),
  spend: z.coerce.number().min(0, "Spend must be 0 or more"),
  clicks: z.coerce.number().int().min(0, "Clicks must be 0 or more"),
  impressions: z.coerce.number().int().min(0, "Impressions must be 0 or more"),
  leads: z.coerce.number().int().min(0, "Leads must be 0 or more"),
  conversions: z.coerce.number().int().min(0, "Conversions must be 0 or more"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof schema>;

type MarketingSpendDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  defaultValues?: MarketingSpend | null;
  isPending?: boolean;
};

export function MarketingSpendDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isPending,
}: MarketingSpendDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: "",
      campaignName: "",
      spend: 0,
      clicks: 0,
      impressions: 0,
      leads: 0,
      conversions: 0,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? {
              platform: defaultValues.platform,
              campaignName: defaultValues.campaignName,
              spend: defaultValues.spend,
              clicks: defaultValues.clicks,
              impressions: defaultValues.impressions,
              leads: defaultValues.leads,
              conversions: defaultValues.conversions,
              startDate: defaultValues.startDate.slice(0, 10),
              endDate: defaultValues.endDate.slice(0, 10),
            }
          : {
              platform: "",
              campaignName: "",
              spend: 0,
              clicks: 0,
              impressions: 0,
              leads: 0,
              conversions: 0,
              startDate: "",
              endDate: "",
            },
      );
    }
  }, [open, defaultValues, reset]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            {defaultValues ? "Edit Campaign" : "Add Campaign"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select id="platform" {...register("platform")}>
                <option value="">Select platform…</option>
                {MARKETING_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              {errors.platform && (
                <p className="text-xs text-destructive">
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="e.g. Summer Sale 2026"
                {...register("campaignName")}
              />
              {errors.campaignName && (
                <p className="text-xs text-destructive">
                  {errors.campaignName.message}
                </p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spend">Spend (£)</Label>
                <Input
                  id="spend"
                  type="number"
                  step="0.01"
                  {...register("spend")}
                />
                {errors.spend && (
                  <p className="text-xs text-destructive">
                    {errors.spend.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clicks">Clicks</Label>
                <Input id="clicks" type="number" {...register("clicks")} />
                {errors.clicks && (
                  <p className="text-xs text-destructive">
                    {errors.clicks.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="impressions">Impressions</Label>
                <Input
                  id="impressions"
                  type="number"
                  {...register("impressions")}
                />
                {errors.impressions && (
                  <p className="text-xs text-destructive">
                    {errors.impressions.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="leads">Leads</Label>
                <Input id="leads" type="number" {...register("leads")} />
                {errors.leads && (
                  <p className="text-xs text-destructive">
                    {errors.leads.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="conversions">Conversions</Label>
                <Input
                  id="conversions"
                  type="number"
                  {...register("conversions")}
                />
                {errors.conversions && (
                  <p className="text-xs text-destructive">
                    {errors.conversions.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving…"
                : defaultValues
                  ? "Update Campaign"
                  : "Add Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
