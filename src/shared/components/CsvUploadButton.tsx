import { useRef, useState, type ChangeEvent } from "react";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CsvUploadButtonProps = {
  onUpload: (rows: Record<string, unknown>[]) => void;
  isPending?: boolean;
  label?: string;
};

function parseCsvText(text: string) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) return { rows: [], headers: [] };

  const headers = parseLine(lines[0]).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_"),
  );

  const rows: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.every((v) => v.trim() === "")) continue;
    const row: Record<string, unknown> = {};
    for (let j = 0; j < headers.length; j++) {
      const raw = (vals[j] || "").trim();
      row[headers[j]] = coerce(raw);
    }
    rows.push(row);
  }
  return { rows, headers };
}

function parseLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function coerce(raw: string): unknown {
  if (raw === "") return raw;
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw;
  const num = Number(raw);
  if (!Number.isNaN(num) && raw !== "") return num;
  return raw;
}

export function CsvUploadButton({
  onUpload,
  isPending,
  label = "Upload CSV",
}: CsvUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{
    rows: Record<string, unknown>[];
    headers: string[];
  } | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseCsvText(reader.result as string);
      setPreview(result);
    };
    reader.readAsText(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleConfirm() {
    if (!preview) return;
    onUpload(preview.rows);
    setPreview(null);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        <Upload className="mr-2 h-4 w-4" />
        {label}
      </Button>

      {preview && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setPreview(null)}
          />
          <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-xl border bg-background p-6 shadow-2xl sm:inset-x-auto sm:w-[480px]">
            <div className="flex items-start gap-3 mb-4">
              <FileSpreadsheet className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">CSV Preview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {preview.rows.length} row{preview.rows.length !== 1 && "s"}{" "}
                  found with {preview.headers.length} columns
                </p>
              </div>
            </div>

            {preview.headers.length > 0 && (
              <div className="rounded-md border bg-muted/30 p-3 mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Detected columns:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {preview.headers.map((h) => (
                    <span
                      key={h}
                      className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex items-center gap-2 rounded-md p-3 text-sm mb-4",
                preview.rows.length > 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
              )}
            >
              {preview.rows.length > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  Ready to upload {preview.rows.length} records
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  No valid data rows found in CSV
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPreview(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={preview.rows.length === 0 || isPending}
              >
                {isPending
                  ? "Uploading…"
                  : `Upload ${preview.rows.length} rows`}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
