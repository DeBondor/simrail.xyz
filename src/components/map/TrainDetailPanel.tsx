"use client";

import { useMemo, useState } from "react";
import {
  X,
  Bot,
  User,
  Gauge,
  Signpost,
  Route,
  CircleDot,
  Circle,
  Minus,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/providers/LangProvider";
import { useTrainDetail } from "@/hooks/sim/useTrainDetail";
import { colorSchemes } from "@/lib/colorSchemes";
import { SteamLink } from "./SteamLink";
import { cn } from "@/lib/utils";
import type { TimetableEntryDTO } from "@/lib/simrail/dto";

interface Props {
  serverCode: string | null;
  trainNo: string | null;
  onClose: () => void;
}

export function TrainDetailPanel({ serverCode, trainNo, onClose }: Props) {
  const { t } = useLang();
  const { train, timetable, isLoading, error } = useTrainDetail(
    serverCode,
    trainNo
  );

  if (!trainNo) return null;

  const color = train ? colorSchemes[train.category]?.secondary : undefined;

  return (
    <div className="absolute right-3 top-3 bottom-3 w-[22rem] max-w-[calc(100%-1.5rem)] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden z-10">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <span
          className={cn(
            "font-mono text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded",
            "text-white"
          )}
          style={{ background: color ?? "#515151" }}
        >
          {train?.category ?? "—"}
        </span>
        <span className="font-mono text-sm font-bold tabular-nums">
          {trainNo}
        </span>
        {train && (
          <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {train.type === "user" ? (
              <>
                <User className="h-3 w-3" />
                {t.mapPlayerDriven}
              </>
            ) : (
              <>
                <Bot className="h-3 w-3" />
                {t.mapBotDriven}
              </>
            )}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 ml-auto"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-3">
        {isLoading && !train && (
          <div className="text-muted-foreground text-xs">…</div>
        )}
        {error && !train && (
          <div className="text-destructive text-xs">{t.mapLoadError}</div>
        )}
        {train && (
          <>
            <div>
              <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-0.5">
                {train.trainName}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <span className="text-xs">{train.startStation}</span>
                <Route className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{train.endStation}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Stat
                icon={<Gauge className="h-3 w-3" />}
                label={t.mapTrainDetailSpeed}
                value={`${Math.round(train.velocity)} km/h`}
              />
              <Stat
                icon={<Signpost className="h-3 w-3" />}
                label={t.mapTrainDetailNextSignal}
                value={train.signalAhead?.name ?? "—"}
              />
              {train.signalAhead?.distance !== undefined &&
                train.signalAhead?.distance !== null && (
                  <Stat
                    label={t.mapTrainDetailDistance}
                    value={`${Math.round(train.signalAhead.distance)} m`}
                  />
                )}
              {train.signalAhead?.speed !== undefined &&
                train.signalAhead?.speed !== null && (
                  <Stat
                    label={t.mapTrainDetailSignalSpeed}
                    value={`${train.signalAhead.speed} km/h`}
                  />
                )}
            </div>

            <div>
              <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
                {t.mapTrainDetailDriver}
              </div>
              {train.driverSteamId ? (
                <SteamLink steamId={train.driverSteamId} />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>

            {timetable && timetable.entries.length > 0 && (
              <Timetable
                entries={timetable.entries}
                accentColor={color}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function isPassThrough(stopType: string): boolean {
  return /nostopover/i.test(stopType);
}

function isCommercial(stopType: string): boolean {
  return /^commercial/i.test(stopType);
}

function fmtTime(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.slice(0, 5);
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function findCurrentIndex(entries: TimetableEntryDTO[]): number {
  const now = nowHHMM();
  let candidate = -1;
  for (let i = 0; i < entries.length; i++) {
    const dep = fmtTime(entries[i].departureTime);
    if (dep && dep <= now) candidate = i;
  }
  return candidate;
}

function Timetable({
  entries,
  accentColor,
}: {
  entries: TimetableEntryDTO[];
  accentColor: string | undefined;
}) {
  const { t } = useLang();
  const [showPassThroughs, setShowPassThroughs] = useState(false);

  const visible = useMemo(
    () =>
      showPassThroughs
        ? entries
        : entries.filter((e) => !isPassThrough(e.stopType)),
    [entries, showPassThroughs]
  );

  const currentIdx = useMemo(() => findCurrentIndex(visible), [visible]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          {t.mapTimetableHeader}
        </div>
        <button
          type="button"
          onClick={() => setShowPassThroughs((v) => !v)}
          className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassThroughs ? (
            <>
              <EyeOff className="h-3 w-3" />
              {t.mapTimetableHidePassThroughs}
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              {t.mapTimetableShowPassThroughs}
            </>
          )}
        </button>
      </div>

      <ol className="border border-border rounded divide-y divide-border max-h-80 overflow-y-auto">
        {visible.map((entry, i) => {
          const arr = fmtTime(entry.arrivalTime);
          const dep = fmtTime(entry.departureTime);
          const passing = isPassThrough(entry.stopType);
          const commercial = isCommercial(entry.stopType);
          const isNow = i === currentIdx;
          const prev = i > 0 ? visible[i - 1] : null;
          const showSpeed =
            !prev || prev.maxSpeed !== entry.maxSpeed;

          const stopLabel = passing
            ? t.mapTimetableStopPassing
            : commercial
              ? t.mapTimetableStopCommercial
              : t.mapTimetableStopTechnical;

          return (
            <li
              key={`${entry.pointId}-${i}`}
              className={cn(
                "px-2 py-1.5 text-xs",
                isNow && "bg-primary/10 border-l-2",
                passing && "opacity-60"
              )}
              style={isNow ? { borderLeftColor: accentColor } : undefined}
            >
              <div className="flex items-start gap-2">
                <span
                  className="shrink-0 mt-0.5 text-muted-foreground"
                  title={stopLabel}
                  aria-label={stopLabel}
                >
                  {passing ? (
                    <Minus className="h-3 w-3" />
                  ) : commercial ? (
                    <CircleDot
                      className="h-3 w-3"
                      style={{ color: accentColor }}
                    />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </span>

                <div className="font-mono text-[0.7rem] tabular-nums shrink-0 leading-tight w-[4.5rem]">
                  {arr && dep && arr !== dep ? (
                    <div className="flex items-center gap-0.5">
                      <span>{arr}</span>
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                      <span>{dep}</span>
                    </div>
                  ) : (
                    <span>{dep ?? arr ?? "—"}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{entry.pointName}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[0.6rem] text-muted-foreground font-mono tabular-nums">
                    <span>
                      {entry.kilometrage.toFixed(1)} {t.mapTimetableKm}
                    </span>
                    {showSpeed && entry.maxSpeed > 0 && (
                      <span className="px-1 rounded bg-secondary/60 border border-border">
                        {entry.maxSpeed} {t.mapTimetableMaxSpeed}
                      </span>
                    )}
                    {isNow && (
                      <span
                        className="px-1 rounded text-white"
                        style={{ background: accentColor ?? "#515151" }}
                      >
                        {t.mapTimetableNow}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right text-[0.65rem] text-muted-foreground font-mono leading-tight">
                  {entry.platform && (
                    <div title={t.mapTimetablePlatform}>
                      {t.mapTimetablePlatform.charAt(0)}.{entry.platform}
                    </div>
                  )}
                  {entry.track != null && (
                    <div title={t.mapTimetableTrack}>
                      {t.mapTimetableTrack.charAt(0).toLowerCase()}.{entry.track}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/40 border border-border rounded px-2 py-1.5">
      <div className="flex items-center gap-1 text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-xs font-mono tabular-nums">{value}</div>
    </div>
  );
}
