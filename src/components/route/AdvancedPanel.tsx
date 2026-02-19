"use client";

import { useLang } from "@/providers/LangProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { RouteState } from "@/hooks/useRouteState";

interface AdvancedPanelProps {
  state: RouteState;
  dispatch: React.Dispatch<any>;
}

export function AdvancedPanel({ state, dispatch }: AdvancedPanelProps) {
  const { t } = useLang();
  const adv = state.advanced;

  const setAdv = (key: string, value: number) =>
    dispatch({ type: "SET_ADVANCED", payload: { [key]: value } });

  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-secondary hover:bg-secondary/80 cursor-pointer w-full transition-colors group">
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex-1 text-left">
          {t.panelAdv}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-5 space-y-4">
          {/* End position slider */}
          <div className="space-y-2">
            <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
              {t.labelEndX}{" "}
              <span className="text-primary text-[0.85em] ml-1">
                {adv.endXPct}%
              </span>
            </Label>
            <Slider
              value={[adv.endXPct]}
              onValueChange={([v]) => setAdv("endXPct", v)}
              min={10}
              max={100}
              step={1}
              className="py-1.5"
            />
          </div>

          {/* Grid 3 - shapes */}
          <div className="grid grid-cols-3 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advSqSize}
              </Label>
              <Input
                type="number"
                value={adv.sqSize}
                min={20}
                max={200}
                onChange={(e) => setAdv("sqSize", +e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advTriW}
              </Label>
              <Input
                type="number"
                value={adv.triW}
                min={20}
                max={200}
                onChange={(e) => setAdv("triW", +e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advTriH}
              </Label>
              <Input
                type="number"
                value={adv.triH}
                min={20}
                max={200}
                onChange={(e) => setAdv("triH", +e.target.value)}
              />
            </div>
          </div>

          {/* Grid 3 - track */}
          <div className="grid grid-cols-3 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advTrackY}
              </Label>
              <Input
                type="number"
                value={adv.trackY}
                min={100}
                max={1000}
                onChange={(e) => setAdv("trackY", +e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advLineH}
              </Label>
              <Input
                type="number"
                value={adv.lineH}
                min={1}
                max={20}
                onChange={(e) => setAdv("lineH", +e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advFixedGap}
              </Label>
              <Input
                type="number"
                value={adv.fixedGap}
                min={10}
                max={500}
                onChange={(e) => setAdv("fixedGap", +e.target.value)}
              />
            </div>
          </div>

          {/* Grid 2 - sidebar + reset */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.advSidebarW}
              </Label>
              <Input
                type="number"
                value={adv.sidebarW}
                min={40}
                max={300}
                onChange={(e) => setAdv("sidebarW", +e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="invisible text-[0.68rem]">-</Label>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => dispatch({ type: "RESET_ADVANCED" })}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.advReset}
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

