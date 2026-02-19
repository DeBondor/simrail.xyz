"use client";

import { useHydrated } from "@/hooks/useHydrated";

export function RefreshLoadingOverlay() {
  const hydrated = useHydrated();
  if (hydrated) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
    </div>
  );
}
