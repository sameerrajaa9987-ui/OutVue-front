import { useEffect } from "react";

/**
 * Sets the document title for the current page.
 * @param title - The page-specific title (e.g. "Dashboard")
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | OUTVUE`
      : "OUTVUE™ – Growth Intelligence Platform";
    return () => {
      document.title = "OUTVUE™ – Growth Intelligence Platform";
    };
  }, [title]);
}
