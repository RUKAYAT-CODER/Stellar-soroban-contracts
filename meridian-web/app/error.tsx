"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
}

export default function GlobalErrorBoundary({ error }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log directly to internal monitoring systems/hooks
    console.error("Captured Boundary Fault Context:", error);
  }, [error]);

  const handleRetry = () => {
    // Perform a safe data-refresh via window reload per constraints
    window.location.reload();
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-xl border border-destructive/20 bg-destructive/5 p-8 shadow-sm">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          ⚠️
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          An unexpected error occurred while processing this section. Please try refreshing or clearing your cache.
        </p>
        {error.digest && (
          <code className="block mb-6 rounded bg-muted p-2 text-xs text-muted-foreground font-mono">
            Error digest: {error.digest}
          </code>
        )}
        <Button onClick={handleRetry} variant="default" className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
}