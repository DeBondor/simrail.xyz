import type { ColorScheme } from "./colorSchemes";
import { BASE_W, H, TRACK_LEFT, RIGHT_MARGIN } from "./constants";

// ── Types ──────────────────────────────────────────────
export type SegmentStyle = "solid" | "dashed" | "mixed";

export interface Station {
  name: string;
  type: "start" | "mid" | "end";
  bold: boolean;
}

export interface AdvancedSettings {
  sqSize: number;
  triW: number;
  triH: number;
  trackY: number;
  lineH: number;
  fixedGap: number;
  sidebarW: number;
  endXPct: number;
}

export interface DrawParams {
  cat: string;
  num: string;
  allStations: Station[];
  segmentStyles: SegmentStyle[];
  colors: ColorScheme;
}

// ── Helpers ────────────────────────────────────────────
function getCanvasWidth(N: number, fixedGap: number): number {
  return Math.max(BASE_W, TRACK_LEFT + fixedGap * (N - 1) + RIGHT_MARGIN);
}

function getTrackRight(W: number): number {
  return W - RIGHT_MARGIN;
}

function getCircleOuter(n: number): number {
  return Math.max(10, Math.min(21, Math.round(21 - (n - 5) * 0.8)));
}

function getCircleInner(n: number): number {
  const o = getCircleOuter(n);
  return Math.max(o - 5, Math.round(o * 0.75));
}

function shapeHalfH(
  type: Station["type"],
  n: number,
  sqSize: number,
  triH: number
): number {
  if (type === "start") return sqSize / 2;
  if (type === "mid") return getCircleOuter(n > 0 ? n : 1);
  if (type === "end") return triH / 2;
  return 0;
}

function stationX(
  i: number,
  n: number,
  trackRight: number
): number {
  return n === 1
    ? (TRACK_LEFT + trackRight) / 2
    : TRACK_LEFT + (trackRight - TRACK_LEFT) * (i / (n - 1));
}

// ── Drawing functions ──────────────────────────────────
function drawStation(
  ctx: CanvasRenderingContext2D,
  x: number,
  type: Station["type"],
  colors: ColorScheme,
  N: number,
  adv: AdvancedSettings
): void {
  const y = adv.trackY;
  const cOuter = getCircleOuter(N);
  const cInner = getCircleInner(N);
  ctx.save();
  if (type === "start") {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 4;
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.rect(x - adv.sqSize / 2, y - adv.sqSize / 2, adv.sqSize, adv.sqSize);
    ctx.fill();
    ctx.stroke();
  } else if (type === "mid") {
    ctx.beginPath();
    ctx.arc(x, y, cOuter, 0, Math.PI * 2);
    ctx.fillStyle = colors.secondary;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, cInner, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();
  } else if (type === "end") {
    ctx.beginPath();
    ctx.moveTo(x - adv.triW / 2, y - adv.triH / 2);
    ctx.lineTo(x + adv.triW / 2, y);
    ctx.lineTo(x - adv.triW / 2, y + adv.triH / 2);
    ctx.closePath();
    ctx.fillStyle = colors.primary;
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  name: string,
  type: Station["type"],
  N: number,
  trackRight: number,
  bold: boolean,
  adv: AdvancedSettings
): void {
  ctx.save();
  const shapeTop = adv.trackY - shapeHalfH(type, N, adv.sqSize, adv.triH);
  const isEndpoint = type === "start" || type === "end";
  const spacing = isEndpoint ? 5 : 10;
  const startOffsetX = type === "start" ? 18 : 0;
  const endOffsetX = type === "end" ? 30 : 0;
  const endOffsetY = type === "end" ? 20 : 0;
  ctx.translate(x + startOffsetX + endOffsetX, shapeTop - spacing + endOffsetY);
  ctx.rotate(-Math.PI / 3);
  if (!isEndpoint) ctx.translate(10, 18);
  const endpointFs = 48;
  const fs = isEndpoint ? endpointFs : endpointFs / 1.2;
  const weight = isEndpoint ? "normal " : bold ? "bold " : "italic ";
  ctx.font = weight + fs + 'px "AileronCanvas",sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ffffff";
  if (type === "end") {
    const originY = shapeTop - spacing + endOffsetY;
    const originX = x + endOffsetX;
    const canvasWidth = trackRight + RIGHT_MARGIN;
    const maxByHeight = originY / Math.sin(Math.PI / 3);
    const maxByRight = (canvasWidth - originX) / Math.cos(Math.PI / 3);
    const maxWidth = Math.max(60, Math.min(maxByHeight, maxByRight) - fs * 0.5);
    const lines = wrapText(ctx, name, maxWidth);
    const lineHeight = fs * 1.3;
    const extraLines = lines.length - 1;
    const wrapShiftX = -extraLines * lineHeight * -0.1;
    const wrapShiftY = -extraLines * lineHeight * 0.6;
    lines.forEach((line, i) => {
      ctx.fillText(line, wrapShiftX, wrapShiftY + i * lineHeight);
    });
  } else {
    ctx.fillText(name, 0, 0);
  }
  ctx.restore();
}

export function drawMap(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: DrawParams,
  adv: AdvancedSettings
): void {
  const { cat, num, allStations, segmentStyles: segs, colors } = params;
  const N = allStations.length;
  const W = getCanvasWidth(N, adv.fixedGap);
  const trackRightFull = getTrackRight(W);
  const trackRight = Math.round(
    TRACK_LEFT + (trackRightFull - TRACK_LEFT) * (adv.endXPct / 100)
  );

  canvas.width = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = colors.primary;
  ctx.fillRect(0, 0, adv.sidebarW, H);
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, adv.sidebarW - 4, H - 4);

  ctx.save();
  ctx.translate(adv.sidebarW / 2 + 6, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '90px "AileronCanvas",sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = colors.secondary;
  ctx.fillText(cat + " - " + num, 0, 0);
  ctx.restore();

  if (N > 1) {
    ctx.save();
    ctx.lineWidth = adv.lineH;
    ctx.strokeStyle = colors.secondary;
    ctx.lineCap = "round";
    for (let seg = 0; seg < N - 1; seg++) {
      const x0 = stationX(seg, N, trackRight);
      const x1 = stationX(seg + 1, N, trackRight);
      const style = segs[seg] || "solid";
      ctx.beginPath();
      if (style === "solid") {
        ctx.setLineDash([]);
        ctx.moveTo(x0, adv.trackY);
        ctx.lineTo(x1, adv.trackY);
      } else if (style === "dashed") {
        ctx.setLineDash([18, 14]);
        ctx.moveTo(x0, adv.trackY);
        ctx.lineTo(x1, adv.trackY);
      } else {
        const mx = (x0 + x1) / 2;
        ctx.setLineDash([]);
        ctx.moveTo(x0, adv.trackY);
        ctx.lineTo(mx, adv.trackY);
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([18, 14]);
        ctx.moveTo(mx, adv.trackY);
        ctx.lineTo(x1, adv.trackY);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  allStations.forEach((st, i) => {
    const x = stationX(i, N, trackRight);
    drawStation(ctx, x, st.type, colors, N, adv);
    drawLabel(ctx, x, st.name, st.type, N, trackRight, st.bold, adv);
  });
}

