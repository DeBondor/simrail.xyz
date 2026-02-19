"use client";

import { Heart } from "lucide-react";
import { useRouteState } from "@/hooks/useRouteState";
import { RoutePanel } from "@/components/route/RoutePanel";
import { StationsPanel } from "@/components/route/StationsPanel";
import { AdvancedPanel } from "@/components/route/AdvancedPanel";
import { CanvasPreview } from "@/components/route/CanvasPreview";
import { ActionBar } from "@/components/route/ActionBar";

export default function RoutePage() {
  const { state, dispatch } = useRouteState();

  return (
    <div className="flex flex-col md:flex-row gap-5 p-6 h-[calc(100vh-57px)] box-border">
      <div className="w-full md:w-105 shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0">
        <div className="bg-card border border-border rounded-lg shrink-0">
          <RoutePanel state={state} dispatch={dispatch} />
        </div>

        <div className="bg-card border border-border rounded-lg shrink-0">
          <StationsPanel state={state} dispatch={dispatch} />
        </div>

        <div className="bg-card border border-border rounded-lg shrink-0">
          <AdvancedPanel state={state} dispatch={dispatch} />
        </div>

        <ActionBar state={state} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <CanvasPreview state={state} />
        <div className="text-right text-[0.65rem] text-muted-foreground tracking-wider shrink-0 px-1">
          Made with{" "}
          <Heart
            className="inline h-2.5 w-2.5 text-primary align-[-1px]"
            fill="currentColor"
          />{" "}
          <strong>by DeBondor</strong>
        </div>
      </div>
    </div>
  );
}


