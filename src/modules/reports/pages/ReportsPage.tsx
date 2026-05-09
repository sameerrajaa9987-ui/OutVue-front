import { useState } from "react";
import { usePageTitle } from "@/shared/lib/usePageTitle";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Loader2,
  Filter,
  CalendarDays,
  BarChart3,
  Users,
  Shield,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDownloadCsv, useDownloadPdf } from "../hooks";

const PLATFORMS = [
  { value: "", label: "All Platforms" },
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "seo", label: "SEO" },
  { value: "content", label: "Content" },
  { value: "social", label: "Social" },
];

const PDF_SECTIONS = [
  {
    icon: BarChart3,
    title: "Monthly Growth Performance Summary",
    desc: "Total spend, leads, conversions, CPL, CTR across all campaigns.",
  },
  {
    icon: Filter,
    title: "Budget Efficiency Report",
    desc: "Growth spend breakdown by marketing, BD, and operational costs with blended CPL.",
  },
  {
    icon: CalendarDays,
    title: "Channel Performance Overview",
    desc: "Side-by-side platform comparison table with spend, leads, CPL, CTR, and conversions.",
  },
  {
    icon: Users,
    title: "BD Contribution Report",
    desc: "Business development costs, leads generated, revenue converted, and BD ROI.",
  },
  {
    icon: Lightbulb,
    title: "Recommended Actions",
    desc: "AI-generated high and medium priority recommendations for budget optimisation.",
  },
  {
    icon: AlertTriangle,
    title: "Risk / Inefficiency Alerts",
    desc: "Underperforming campaigns, poor creatives, overfunded channels, and agency concerns.",
  },
];

export function ReportsPage() {
  usePageTitle("Reports");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [platform, setPlatform] = useState("");

  const csvMut = useDownloadCsv();
  const pdfMut = useDownloadPdf();

  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(platform && { platform }),
  };

  const handleCsv = () => {
    csvMut.mutate(params, {
      onSuccess: () => toast.success("CSV report downloaded"),
      onError: () => toast.error("Failed to generate CSV"),
    });
  };

  const handlePdf = () => {
    pdfMut.mutate(params, {
      onSuccess: () => toast.success("PDF report downloaded"),
      onError: () => toast.error("Failed to generate PDF"),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Export your growth data as CSV or generate comprehensive PDF reports.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Input
                type="date"
                className="w-[160px]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Date</Label>
              <Input
                type="date"
                className="w-[160px]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Platform</Label>
              <select
                className="flex h-9 w-[160px] rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {(startDate || endDate || platform) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setPlatform("");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CSV */}
        <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">CSV Export</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Download raw marketing campaign data as a spreadsheet.
                  Includes campaign name, platform, spend, clicks, impressions,
                  leads, conversions, CPL, CTR, and date range.
                </p>
                <Button
                  className="mt-4 gap-2"
                  variant="outline"
                  onClick={handleCsv}
                  disabled={csvMut.isPending}
                >
                  {csvMut.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDF */}
        <Card className="border-red-500/20 hover:border-red-500/40 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">PDF Report</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a comprehensive growth intelligence report with
                  performance summaries, channel breakdowns, BD analysis, and AI
                  recommendations.
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={handlePdf}
                  disabled={pdfMut.isPending}
                >
                  {pdfMut.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Generate PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF Sections Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            PDF Report Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PDF_SECTIONS.map((section, i) => {
              const SectionIcon = section.icon;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border border-border bg-muted/20 p-4 space-y-2",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <SectionIcon className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold">
                      {i + 1}. {section.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {section.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
