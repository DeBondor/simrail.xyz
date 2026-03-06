"use client";

import { Heart, Plus, Copy, X } from "lucide-react";
import { useRouteState } from "@/hooks/useRouteState";
import { useLang } from "@/providers/LangProvider";
import { RoutePanel } from "@/components/route/RoutePanel";
import { StationsPanel } from "@/components/route/StationsPanel";
import { AdvancedPanel } from "@/components/route/AdvancedPanel";
import { CanvasPreview } from "@/components/route/CanvasPreview";
import { ActionBar } from "@/components/route/ActionBar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function RouteClient() {
  const { state, dispatch } = useRouteState();
  const { t } = useLang();
  const activeRoute = state.routes[state.activeRoute];

  return (
    <div className="flex flex-col md:flex-row gap-5 p-6 h-[calc(100vh-57px)] box-border">
      <div className="w-full md:w-105 shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0">

        <div className="animate-fade-in-up bg-card border border-border rounded-lg p-1.5 flex items-center gap-1 shrink-0" style={{ "--delay": "0ms" }}>
          <span className="text-[0.6rem] font-bold tracking-widest uppercase text-muted-foreground px-2 shrink-0">
            {t.labelRoutes}
          </span>
          <div className="w-px h-5 bg-border shrink-0" />

          <button
            className={cn(
              "px-3 py-1.5 rounded-md text-[0.7rem] font-bold tracking-wider uppercase transition-colors",
              state.activeRoute === 0
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => dispatch({ type: "SET_ACTIVE_ROUTE", payload: 0 })}
          >
            {t.route1}
          </button>

          {state.secondRouteEnabled ? (
            <button
              className={cn(
                "px-3 py-1.5 rounded-md text-[0.7rem] font-bold tracking-wider uppercase transition-colors",
                state.activeRoute === 1
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => dispatch({ type: "SET_ACTIVE_ROUTE", payload: 1 })}
            >
              {t.route2}
            </button>
          ) : (
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[0.7rem] font-bold tracking-wider uppercase text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-dashed border-border/70"
              onClick={() =>
                dispatch({ type: "SET_SECOND_ROUTE_ENABLED", payload: true })
              }
            >
              <Plus className="h-3 w-3" />
              {t.addRoute}
            </button>
          )}

          {state.secondRouteEnabled && (
            <div className="ml-auto flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => dispatch({ type: "COPY_PRIMARY_TO_SECOND" })}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.copyRoute}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      dispatch({ type: "SET_SECOND_ROUTE_ENABLED", payload: false })
                    }
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.removeRoute2}</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="animate-fade-in-up bg-card border border-border rounded-lg shrink-0" style={{ "--delay": "60ms" }}>
          <RoutePanel route={activeRoute} dispatch={dispatch} />
        </div>

        <div className="animate-fade-in-up bg-card border border-border rounded-lg shrink-0" style={{ "--delay": "120ms" }}>
          <StationsPanel route={activeRoute} dispatch={dispatch} />
        </div>

        <div className="animate-fade-in-up bg-card border border-border rounded-lg shrink-0" style={{ "--delay": "180ms" }}>
          <AdvancedPanel state={state} dispatch={dispatch} />
        </div>

        <div className="animate-fade-in-up" style={{ "--delay": "240ms" }}>
          <ActionBar state={state} />
        </div>
      </div>

      <div className="animate-fade-in-up flex-1 min-w-0 flex flex-col gap-2" style={{ "--delay": "60ms" }}>
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
