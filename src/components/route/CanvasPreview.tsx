"use client";

import { useRef, useEffect, useCallback } from "react";
import { drawMap } from "@/lib/canvasRenderer";
import type { DrawParams, RouteBoardParams, Station } from "@/lib/canvasRenderer";
import { colorSchemes } from "@/lib/colorSchemes";
import type { RouteConfig, RouteState } from "@/hooks/useRouteState";

interface CanvasPreviewProps {
  state: RouteState;
}

function toRouteParams(route: RouteConfig): RouteBoardParams {
  const {
    category,
    trainNumber,
    startStation,
    endStation,
    stations,
    segmentStyles,
    segmentDots,
  } = route;

  let colors;
  if (category === "CUSTOM") {
    colors = {
      primary: route.customPrimary,
      secondary: route.customSecondary,
    };
  } else {
    colors = colorSchemes[category] || colorSchemes["TME"];
  }

  const catLabel = category === "CUSTOM" ? route.customCatName.trim() || "CUSTOM" : category;

  const allStations: Station[] = [
    { name: startStation || "Start", type: "start", bold: false },
    ...stations.map((s) => ({
      name: s.name,
      type: "mid" as const,
      bold: s.bold,
      shape: s.shape,
    })),
    { name: endStation || "End", type: "end", bold: false },
  ];

  return {
    cat: catLabel,
    num: trainNumber,
    allStations,
    segmentStyles: [...segmentStyles],
    segmentDots: [...segmentDots],
    colors,
  };
}

function collectParams(state: RouteState): DrawParams {
  const primary = toRouteParams(state.routes[0]);
  if (!state.secondRouteEnabled) return primary;
  return {
    ...primary,
    secondRoute: toRouteParams(state.routes[1]),
  };
}

export function CanvasPreview({ state }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const params = collectParams(state);
    drawMap(ctx, canvas, params, state.advanced);
  }, [state]);

  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      render();
    });
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [render]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.ready,
      document.fonts.load('normal 48px "AileronCanvas"'),
      document.fonts.load('italic 48px "AileronCanvas"'),
    ]).then(() => {
      if (!cancelled) renderRef.current();
    });
    return () => {
      cancelled = true;
    };
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


