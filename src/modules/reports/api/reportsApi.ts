import { http } from "@/shared/api/http";

export type ReportParams = {
  startDate?: string;
  endDate?: string;
  platform?: string;
};

export async function downloadCsv(params?: ReportParams) {
  const res = await http.get("/reports/csv", {
    params,
    responseType: "blob",
  });
  triggerDownload(
    res.data as Blob,
    `outvue-report-${Date.now()}.csv`,
    "text/csv",
  );
}

export async function downloadPdf(params?: ReportParams) {
  const res = await http.get("/reports/pdf", {
    params,
    responseType: "blob",
  });
  triggerDownload(
    res.data as Blob,
    `outvue-report-${Date.now()}.pdf`,
    "application/pdf",
  );
}

function triggerDownload(blob: Blob, filename: string, type: string) {
  const url = window.URL.createObjectURL(new Blob([blob], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
