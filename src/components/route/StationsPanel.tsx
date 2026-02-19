"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useLang } from "@/providers/LangProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  Plus,
  GripVertical,
  X,
  FileDown,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchStations } from "@/lib/api";
import { parseSimRailXML } from "@/lib/xmlImporter";
import { categoryOptions } from "@/lib/colorSchemes";
import type { RouteState, IntermediateStation } from "@/hooks/useRouteState";
import type { SegmentStyle } from "@/lib/canvasRenderer";

const stationsData = fetchStations();

interface StationsPanelProps {
  state: RouteState;
  dispatch: React.Dispatch<any>;
}

function SortableStationItem({
  station,
  index,
  dispatch,
  dragTitle,
  removeTitle,
}: {
  station: IntermediateStation;
  index: number;
  dispatch: React.Dispatch<any>;
  dragTitle: string;
  removeTitle: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `station-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-secondary border border-border rounded-md px-2.5 py-2 hover:border-muted-foreground/40 hover:bg-secondary/80 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 p-0.5"
        title={dragTitle}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className="text-[0.65rem] font-bold text-muted-foreground w-4.5 text-center shrink-0">
        {index + 1}
      </span>
      <Input
        value={station.name}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_STATION",
            payload: { index, name: e.target.value },
          })
        }
        className="flex-1 border-none bg-transparent px-1 py-0 h-auto text-sm shadow-none focus-visible:ring-0 focus-visible:border-b focus-visible:border-primary focus-visible:rounded-none"
      />
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 shrink-0 text-xs font-bold ${
          station.bold
            ? "bg-primary/15 border-primary text-primary border"
            : "text-muted-foreground border border-border"
        }`}
        onClick={() => dispatch({ type: "TOGGLE_BOLD", payload: index })}
      >
        B
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
        onClick={() => dispatch({ type: "REMOVE_STATION", payload: index })}
        title={removeTitle}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function SegmentRow({
  index,
  style,
  dispatch,
  segStyleNames,
  segmentLabel,
}: {
  index: number;
  style: SegmentStyle;
  dispatch: React.Dispatch<any>;
  segStyleNames: [string, string, string];
  segmentLabel: (i: number) => string;
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        {segmentLabel(index)}
      </span>
      <Select
        value={style}
        onValueChange={(v) =>
          dispatch({
            type: "SET_SEGMENT_STYLE",
            payload: { index, style: v as SegmentStyle },
          })
        }
      >
        <SelectTrigger className="h-6 w-auto px-2 text-xs border-border bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solid">{segStyleNames[0]}</SelectItem>
          <SelectItem value="dashed">{segStyleNames[1]}</SelectItem>
          <SelectItem value="mixed">{segStyleNames[2]}</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function StationsPanel({ state, dispatch }: StationsPanelProps) {
  const { t } = useLang();
  const [customInput, setCustomInput] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = parseInt(String(active.id).replace("station-", ""));
      const newIndex = parseInt(String(over.id).replace("station-", ""));
      const reordered = arrayMove([...state.stations], oldIndex, newIndex);
      dispatch({ type: "REORDER_STATIONS", payload: reordered });
    },
    [state.stations, dispatch]
  );

  const addStation = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      dispatch({ type: "ADD_STATION", payload: name.trim() });
      setCustomInput("");
      setComboOpen(false);
    },
    [dispatch]
  );

  const handleXMLImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const result = parseSimRailXML(ev.target?.result as string);
          const catExists = categoryOptions.some(
            (o) => o.value === result.trainName
          );
          dispatch({
            type: "IMPORT",
            payload: {
              category: catExists ? result.trainName : "CUSTOM",
              trainNumber: result.trainNumber,
              startStation: result.startStation,
              endStation: result.endStation,
              stations: result.intermediateStations,
              customCatName: catExists ? undefined : result.trainName,
            },
          });
        } catch (ex: any) {
          alert(ex.message);
        }
      };
      reader.readAsText(file, "UTF-8");
    },
    [dispatch]
  );

  return (
    <Collapsible defaultOpen>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-secondary">
        <CollapsibleTrigger className="flex items-center gap-2.5 flex-1 cursor-pointer hover:opacity-80 transition-opacity group">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground flex-1 text-left">
            {t.panelStations}
          </span>
          <Badge
            variant="outline"
            className="border-primary text-primary bg-primary/10 text-[0.65rem] font-bold tracking-wider uppercase"
          >
            {t.badgeIntermediate(state.stations.length)}
          </Badge>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => xmlInputRef.current?.click()}
            >
              <FileDown className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.importXmlTitle}</TooltipContent>
        </Tooltip>
        <input
          ref={xmlInputRef}
          type="file"
          accept=".xml"
          className="hidden"
          onChange={handleXMLImport}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => dispatch({ type: "CLEAR_STATIONS" })}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.clearStationsTitle}</TooltipContent>
        </Tooltip>
      </div>
      <CollapsibleContent>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.labelStart}
              </Label>
              <Input
                value={state.startStation}
                onChange={(e) =>
                  dispatch({ type: "SET_START", payload: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
                {t.labelEnd}
              </Label>
              <Input
                value={state.endStation}
                onChange={(e) =>
                  dispatch({ type: "SET_END", payload: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wider">
              {t.labelIntermediate}
            </Label>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              <SegmentRow
                index={0}
                style={state.segmentStyles[0] || "solid"}
                dispatch={dispatch}
                segStyleNames={t.segStyleNames}
                segmentLabel={t.segmentLabel}
              />

              {mounted ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={state.stations.map((_, i) => `station-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {state.stations.map((station, i) => (
                      <div key={`item-${i}`} className="space-y-1.5">
                        <SortableStationItem
                          station={station}
                          index={i}
                          dispatch={dispatch}
                          dragTitle={t.dragTitle}
                          removeTitle={t.removeTitle}
                        />
                        <SegmentRow
                          index={i + 1}
                          style={state.segmentStyles[i + 1] || "solid"}
                          dispatch={dispatch}
                          segStyleNames={t.segStyleNames}
                          segmentLabel={t.segmentLabel}
                        />
                      </div>
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                state.stations.map((station, i) => (
                  <div key={`item-${i}`} className="space-y-1.5">
                    <div className="flex items-center gap-2 bg-secondary border border-border rounded-md px-2.5 py-2">
                      <span className="text-muted-foreground shrink-0 p-0.5">
                        <GripVertical className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[0.65rem] font-bold text-muted-foreground w-4.5 text-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm">{station.name}</span>
                    </div>
                    <SegmentRow
                      index={i + 1}
                      style={state.segmentStyles[i + 1] || "solid"}
                      dispatch={dispatch}
                      segStyleNames={t.segStyleNames}
                      segmentLabel={t.segmentLabel}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="flex-1 justify-start text-sm font-normal text-muted-foreground"
                  >
                    {t.presetPlaceholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-75 p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t.searchPlaceholder} />
                    <CommandList>
                      <CommandEmpty>No stations found.</CommandEmpty>
                      {stationsData.groups.map((group) => (
                        <CommandGroup key={group.label} heading={group.label}>
                          {group.stations.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={() => addStation(name)}
                            >
                              {name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addStation(customInput);
                }}
                placeholder={t.customPlaceholder}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => addStation(customInput)}
              >
                <Plus className="h-3 w-3" />
                {t.btnAdd}
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}


