"use client";

import { useLang } from "@/providers/LangProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { categoryOptions } from "@/lib/colorSchemes";
import type { RouteState } from "@/hooks/useRouteState";

interface RoutePanelProps {
  state: RouteState;
  dispatch: React.Dispatch<any>;
}

export function RoutePanel({ state, dispatch }: RoutePanelProps) {
  const { t } = useLang();

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-secondary hover:bg-secondary/80 cursor-pointer w-full transition-colors group">
        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex-1 text-left">
          {t.panelRoute}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.labelCat}
              </Label>
              <Select
                value={state.category}
                onValueChange={(v) => dispatch({ type: "SET_CATEGORY", payload: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.labelRouteNum}
              </Label>
              <Input
                value={state.trainNumber}
                onChange={(e) =>
                  dispatch({ type: "SET_TRAIN_NUMBER", payload: e.target.value })
                }
              />
            </div>
          </div>
          {state.category === "CUSTOM" && (
            <div className="grid grid-cols-3 gap-3.5 p-3.5 bg-primary/10 border border-primary/30 rounded-md">
              <div className="space-y-1.5">
                <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.labelCatName}
                </Label>
                <Input
                  value={state.customCatName}
                  maxLength={8}
                  onChange={(e) =>
                    dispatch({ type: "SET_CUSTOM_CAT_NAME", payload: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.labelPrimary}
                </Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={state.customPrimary}
                    onChange={(e) =>
                      dispatch({ type: "SET_CUSTOM_PRIMARY", payload: e.target.value })
                    }
                    className="w-9.5 h-9.5 p-0.5 border border-border rounded-sm bg-secondary cursor-pointer shrink-0"
                  />
                  <Input
                    value={state.customPrimary}
                    maxLength={7}
                    onChange={(e) =>
                      dispatch({ type: "SET_CUSTOM_PRIMARY", payload: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.labelSecondary}
                </Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={state.customSecondary}
                    onChange={(e) =>
                      dispatch({ type: "SET_CUSTOM_SECONDARY", payload: e.target.value })
                    }
                    className="w-9.5 h-9.5 p-0.5 border border-border rounded-sm bg-secondary cursor-pointer shrink-0"
                  />
                  <Input
                    value={state.customSecondary}
                    maxLength={7}
                    onChange={(e) =>
                      dispatch({ type: "SET_CUSTOM_SECONDARY", payload: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}


