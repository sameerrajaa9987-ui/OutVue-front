import { useMutation } from "@tanstack/react-query";
import * as reportsApi from "../api/reportsApi";
import type { ReportParams } from "../api/reportsApi";

export function useDownloadCsv() {
  return useMutation({
    mutationFn: (params?: ReportParams) => reportsApi.downloadCsv(params),
  });
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: (params?: ReportParams) => reportsApi.downloadPdf(params),
  });
}
