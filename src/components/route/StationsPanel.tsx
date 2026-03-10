"use client";

import { useRef, useState, useCallback, useId } from "react";
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
  Hexagon,
  Circle,
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
import type {
  RouteConfig,
  IntermediateStation,
  RouteDispatch,
} from "@/hooks/useRouteState";
import type { SegmentStyle } from "@/lib/canvasRenderer";

const stationsData = fetchStations();

interface StationsPanelProps {
  route: RouteConfig;
  dispatch: RouteDispatch;
}

function SortableStationItem({
  station,
  index,
  dispatch,
  dragTitle,
  removeTitle,
  shapeToCircle,
  shapeToHexagon,
}: {
  station: IntermediateStation;
  index: number;
  dispatch: RouteDispatch;
  dragTitle: string;
  removeTitle: string;
  shapeToCircle: string;
  shapeToHexagon: string;
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
        className={`h-6 w-6 shrink-0 ${
          station.shape === "hexagon"
            ? "bg-primary/15 border-primary text-primary border"
            : "text-muted-foreground border border-border"
        }`}
        onClick={() => dispatch({ type: "TOGGLE_STATION_SHAPE", payload: index })}
        title={station.shape === "hexagon" ? shapeToCircle : shapeToHexagon}
      >
        {station.shape === "hexagon" ? (
          <Hexagon className="h-3 w-3" />
        ) : (
          <Circle className="h-3 w-3" />
        )}
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
  dot,
  dispatch,
  segStyleNames,
  segmentLabel,
  dotAdd,
  dotRemove,
}: {
  index: number;
  style: SegmentStyle;
  dot: boolean;
  dispatch: RouteDispatch;
  segStyleNames: [string, string, string];
  segmentLabel: (i: number) => string;
  dotAdd: string;
  dotRemove: string;
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
      <Button
        variant="ghost"
        size="icon"
        className={`h-5 w-5 shrink-0 rounded-full ${
          dot
            ? "text-primary bg-primary/15 border border-primary"
            : "text-muted-foreground/50 border border-dashed border-border/60 hover:border-muted-foreground/40 hover:text-muted-foreground"
        }`}
        title={dot ? dotRemove : dotAdd}
        onClick={() => dispatch({ type: "SET_SEGMENT_DOT", payload: { index, dot: !dot } })}
      >
        <Circle className="h-2 w-2" fill={dot ? "currentColor" : "none"} />
      </Button>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function StationsPanel({ route, dispatch }: StationsPanelProps) {
  const { t } = useLang();
  const [customInput, setCustomInput] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const xmlInputRef = useRef<HTMLInputElement>(null);
  const dndId = useId();

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
      dispatch({ type: "REORDER_STATIONS", payload: arrayMove([...route.stations], oldIndex, newIndex) });
    },
    [route.stations, dispatch]
  );

  const addStation = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      dispatch({ type: "ADD_STATION", payload: name.trim() });
      setCustomInput("");
      setComboOpen(false);
    },
    []
  );

  const handleXMLImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (!text || String(text).trim() === "") {
          alert("Selected file is empty or could not be read.");
          return;
        }
        try {
          const result = parseSimRailXML(String(text));
          const catExists = categoryOptions.some((o) => o.value === result.trainName);
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
        } catch (ex) {
          const message = ex instanceof Error ? ex.message : "Unknown error";
          console.error("Failed to import SimRail XML:", message);
          alert(message);
        }
      };
      reader.readAsText(file, "UTF-8");
    },
    []
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
            {t.badgeIntermediate(route.stations.length)}
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
                value={route.startStation}
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
                value={route.endStation}
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
                style={route.segmentStyles[0] || "solid"}
                dot={route.segmentDots?.[0] ?? false}
                dispatch={dispatch}
                segStyleNames={t.segStyleNames}
                segmentLabel={t.segmentLabel}
                dotAdd={t.dotAdd}
                dotRemove={t.dotRemove}
              />

              <DndContext
                id={dndId}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={route.stations.map((_, i) => `station-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {route.stations.map((station, i) => (
                    <div key={`item-${i}`} className="space-y-1.5">
                      <SortableStationItem
                        station={station}
                        index={i}
                        dispatch={dispatch}
                        dragTitle={t.dragTitle}
                        removeTitle={t.removeTitle}
                        shapeToCircle={t.shapeToCircle}
                        shapeToHexagon={t.shapeToHexagon}
                      />
                      <SegmentRow
                        index={i + 1}
                        style={route.segmentStyles[i + 1] || "solid"}
                        dot={route.segmentDots?.[i + 1] ?? false}
                        dispatch={dispatch}
                        segStyleNames={t.segStyleNames}
                        segmentLabel={t.segmentLabel}
                        dotAdd={t.dotAdd}
                        dotRemove={t.dotRemove}
                      />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
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
                      <CommandEmpty>{t.noStationsFound}</CommandEmpty>
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
