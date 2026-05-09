import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

/**
 * A lightweight error boundary for wrapping individual page sections.
 * If a section fails, only that section shows an error – the rest of the page continues working.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SectionErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive/60" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Unable to load {this.props.fallbackTitle || "this section"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Something went wrong. Please try again.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
