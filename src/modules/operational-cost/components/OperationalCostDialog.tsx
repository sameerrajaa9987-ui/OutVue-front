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
import type { OperationalCost } from "../types";
import { OPERATIONAL_TYPES } from "../types";

const schema = z.object({
  type: z.string().min(1, "Type is required"),
  name: z.string().min(1, "Name is required"),
  monthlyCost: z.coerce.number().min(0, "Cost must be 0 or more"),
  allocation: z.coerce.number().min(0).max(100),
  period: z.string().min(1, "Period is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  defaultValues?: OperationalCost | null;
  isPending?: boolean;
};

export function OperationalCostDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isPending,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      name: "",
      monthlyCost: "" as unknown as number,
      allocation: 100,
      period: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? {
              type: defaultValues.type,
              name: defaultValues.name,
              monthlyCost: defaultValues.monthlyCost,
              allocation: defaultValues.allocation,
              period: defaultValues.period,
            }
          : { type: "", name: "", monthlyCost: "" as unknown as number, allocation: 100, period: "" },
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
            {defaultValues ? "Edit Cost" : "Add Cost"}
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
              <Label htmlFor="type">Type</Label>
              <Select id="type" {...register("type")}>
                <option value="">Select type…</option>
                {OPERATIONAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Marketing Manager"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyCost">Monthly Cost (£)</Label>
                <Input
                  id="monthlyCost"
                  type="number"
                  step="0.01"
                  {...register("monthlyCost")}
                />
                {errors.monthlyCost && (
                  <p className="text-xs text-destructive">
                    {errors.monthlyCost.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocation">Allocation (%)</Label>
                <Input
                  id="allocation"
                  type="number"
                  min="0"
                  max="100"
                  {...register("allocation")}
                />
                {errors.allocation && (
                  <p className="text-xs text-destructive">
                    {errors.allocation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                placeholder="e.g. 2026-01 or 2026-Q1"
                {...register("period")}
              />
              {errors.period && (
                <p className="text-xs text-destructive">
                  {errors.period.message}
                </p>
              )}
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
                  ? "Update Cost"
                  : "Add Cost"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
