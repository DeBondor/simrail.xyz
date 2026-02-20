"use client";

import { useRef, useEffect, useCallback } from "react";
import { drawMap } from "@/lib/canvasRenderer";
import type { DrawParams, Station } from "@/lib/canvasRenderer";
import { colorSchemes } from "@/lib/colorSchemes";
import type { RouteState } from "@/hooks/useRouteState";

interface CanvasPreviewProps {
  state: RouteState;
}

function collectParams(state: RouteState): DrawParams {
  const { category, trainNumber, startStation, endStation, stations, segmentStyles } = state;
  let colors;
  if (category === "CUSTOM") {
    colors = {
      primary: state.customPrimary,
      secondary: state.customSecondary,
    };
  } else {
    colors = colorSchemes[category] || colorSchemes["TME"];
  }
  const catLabel =
    category === "CUSTOM"
      ? state.customCatName.trim() || "CUSTOM"
      : category;

  const allStations: Station[] = [
    { name: startStation || "Start", type: "start", bold: false },
    ...stations.map((s) => ({
      name: s.name,
      type: "mid" as const,
      bold: s.bold,
    })),
    { name: endStation || "End", type: "end", bold: false },
  ];

  return {
    cat: catLabel,
    num: trainNumber,
    allStations,
    segmentStyles: [...segmentStyles],
    colors,
  };
}

export function CanvasPreview({ state }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const params = collectParams(state);
    drawMap(ctx, canvas, params, state.advanced);
  }, [state]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(render, 80);
    return () => clearTimeout(timerRef.current);
  }, [render]);

  const fontsLoadedRef = useRef(false);

  useEffect(() => {
    if (fontsLoadedRef.current) return;
    fontsLoadedRef.current = true;
    Promise.all([
      document.fonts.ready,
      document.fonts.load('normal 48px "AileronCanvas"'),
      document.fonts.load('italic 48px "AileronCanvas"'),
    ]).then(render);
  }, []);

  return (
    <div className="flex-1 min-h-0 border border-border rounded-lg checkerboard-bg p-4 flex justify-center items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1699}
        height={720}
        className="block max-w-full h-auto"
      />
    </div>
  );
}

export { collectParams };


