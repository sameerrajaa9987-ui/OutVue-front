import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">
          Grospective™
        </span>
      </div>

      <p className="text-8xl font-bold text-primary/20 leading-none select-none">
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button asChild className="mt-8" variant="default">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
