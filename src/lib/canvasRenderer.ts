import type { ColorScheme } from "./colorSchemes";
import { BASE_W, H, TRACK_LEFT, RIGHT_MARGIN } from "./constants";

export type SegmentStyle = "solid" | "dashed" | "mixed";

export interface Station {
  name: string;
  type: "start" | "mid" | "end";
  bold: boolean;
  shape?: "circle" | "hexagon";
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
  fontSizeStart: number;
  fontSizeMid: number;
  fontSizeEnd: number;
  dualGap: number;
}

export interface RouteBoardParams {
  cat: string;
  num: string;
  allStations: Station[];
  segmentStyles: SegmentStyle[];
  segmentDots: boolean[];
  colors: ColorScheme;
}

export interface DrawParams extends RouteBoardParams {
  secondRoute?: RouteBoardParams | null;
}

const CIRCLE_OUTER = 21;
const CIRCLE_INNER = 16;

function getBoardWidth(stationCount: number, fixedGap: number, triW: number): number {
  const minGap = Math.max(CIRCLE_OUTER * 2, CIRCLE_OUTER + Math.ceil(triW / 2));
  const gap = Math.max(minGap, fixedGap);
  return Math.max(BASE_W, TRACK_LEFT + gap * (stationCount - 1) + RIGHT_MARGIN);
}

function getTrackRight(boardWidth: number): number {
  return boardWidth - RIGHT_MARGIN;
}

function shapeHalfH(
  type: Station["type"],
  sqSize: number,
  triH: number
): number {
  if (type === "start") return sqSize / 2;
  if (type === "mid") return CIRCLE_OUTER;
  if (type === "end") return triH / 2;
  return 0;
}

function drawHexPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
): void {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function stationX(
  i: number,
  n: number,
  trackLeft: number,
  trackRight: number
): number {
  return n === 1
    ? (trackLeft + trackRight) / 2
    : trackLeft + (trackRight - trackLeft) * (i / (n - 1));
}

function drawSegmentDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  colors: ColorScheme
): void {
  const inner = Math.max(r - 5, Math.round(r * 0.75));
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, inner, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();
  ctx.restore();
}

function drawStation(
  ctx: CanvasRenderingContext2D,
  x: number,
  type: Station["type"],
  colors: ColorScheme,
  adv: AdvancedSettings,
  shape?: "circle" | "hexagon"
): void {
  const y = adv.trackY;
  const outer = CIRCLE_OUTER;
  const inner = CIRCLE_INNER;

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
    if (shape === "hexagon") {
      const hexOuter = outer * 1.6;
      const hexInner = inner * 1.6;
      drawHexPath(ctx, x, y, hexOuter);
      ctx.fillStyle = colors.secondary;
      ctx.fill();
      drawHexPath(ctx, x, y, hexInner);
      ctx.fillStyle = colors.primary;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, outer, 0, Math.PI * 2);
      ctx.fillStyle = colors.secondary;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, inner, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary;
      ctx.fill();
    }
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
    const test = current ? `${current} ${word}` : word;
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
  bold: boolean,
  adv: AdvancedSettings,
  routeRight: number
): void {
  ctx.save();
  const shapeTop = adv.trackY - shapeHalfH(type, adv.sqSize, adv.triH);
  const isEndpoint = type === "start" || type === "end";
  const spacing = isEndpoint ? 5 : 10;
  const startOffsetX = type === "start" ? 18 : 0;
  const endOffsetX = type === "end" ? 30 : 0;
  const endOffsetY = type === "end" ? 20 : 0;

  ctx.translate(x + startOffsetX + endOffsetX, shapeTop - spacing + endOffsetY);
  ctx.rotate(-Math.PI / 3);
  if (!isEndpoint) ctx.translate(10, 18);

  const fs =
    type === "start"
      ? adv.fontSizeStart
      : type === "end"
        ? adv.fontSizeEnd
        : adv.fontSizeMid;
  const weight = isEndpoint ? "normal " : bold ? "bold " : "italic ";
  ctx.font = `${weight}${fs}px "AileronCanvas",sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ffffff";

  if (type === "end") {
    const originY = shapeTop - spacing + endOffsetY;
    const originX = x + endOffsetX;
    const cos60 = Math.cos(Math.PI / 3);
    const sin60 = Math.sin(Math.PI / 3);
    const maxByHeight = originY / sin60;
    const maxByRight = (routeRight - originX) / cos60;
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

function drawBoard(
  ctx: CanvasRenderingContext2D,
  board: RouteBoardParams,
  adv: AdvancedSettings,
  offsetX: number,
  boardWidth: number
): void {
  const { cat, num, allStations, segmentStyles: segs, segmentDots: dots, colors } = board;
  const stationCount = allStations.length;
  const trackLeft = offsetX + TRACK_LEFT;
  const trackRightFull = offsetX + getTrackRight(boardWidth);
  const trackRight = Math.round(
    trackLeft + (trackRightFull - trackLeft) * (adv.endXPct / 100)
  );

  ctx.fillStyle = colors.primary;
  ctx.fillRect(offsetX, 0, adv.sidebarW, H);
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 4;
  ctx.strokeRect(offsetX + 2, 2, adv.sidebarW - 4, H - 4);

  ctx.save();
  ctx.translate(offsetX + adv.sidebarW / 2 + 6, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '90px "AileronCanvas",sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = colors.secondary;
  ctx.fillText(`${cat} - ${num}`, 0, 0);
  ctx.restore();

  if (stationCount > 1) {
    ctx.save();
    ctx.lineWidth = adv.lineH;
    ctx.strokeStyle = colors.secondary;
    ctx.lineCap = "round";
    for (let seg = 0; seg < stationCount - 1; seg++) {
      const x0 = stationX(seg, stationCount, trackLeft, trackRight);
      const x1 = stationX(seg + 1, stationCount, trackLeft, trackRight);
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

  const dotR = CIRCLE_OUTER / 2;
  dots.forEach((hasDot, seg) => {
    if (!hasDot || seg >= stationCount - 1) return;
    const x0 = stationX(seg, stationCount, trackLeft, trackRight);
    const x1 = stationX(seg + 1, stationCount, trackLeft, trackRight);
    drawSegmentDot(ctx, (x0 + x1) / 2, adv.trackY, dotR, colors);
  });

  allStations.forEach((station, i) => {
    const x = stationX(i, stationCount, trackLeft, trackRight);
    drawStation(ctx, x, station.type, colors, adv, station.shape);
    drawLabel(
      ctx,
      x,
      station.name,
      station.type,
      station.bold,
      adv,
      offsetX + boardWidth
    );
  });
}


export function drawMap(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: DrawParams,
  adv: AdvancedSettings
): void {
  const baseWidth = getBoardWidth(params.allStations.length, adv.fixedGap, adv.triW);
  const hasSecond = Boolean(params.secondRoute);

  if (!hasSecond || !params.secondRoute) {
    canvas.width = baseWidth;
    canvas.height = H;
    ctx.clearRect(0, 0, baseWidth, H);
    drawBoard(ctx, params, adv, 0, baseWidth);
    return;
  }

  const secondNaturalWidth = getBoardWidth(params.secondRoute.allStations.length, adv.fixedGap, adv.triW);
  const gap = adv.dualGap;
  const totalNaturalWidth = baseWidth + gap + secondNaturalWidth;

  if (totalNaturalWidth <= BASE_W) {
    canvas.width = totalNaturalWidth;
    canvas.height = H;
    ctx.clearRect(0, 0, canvas.width, H);

    drawBoard(ctx, params, adv, 0, baseWidth);
    drawBoard(ctx, params.secondRoute, adv, baseWidth + gap, secondNaturalWidth);
  } else {
    canvas.width = BASE_W;
    canvas.height = H;
    ctx.clearRect(0, 0, BASE_W, H);

    const availableWidth = BASE_W - gap;
    const ratio = availableWidth / (baseWidth + secondNaturalWidth);
    const firstWidth = baseWidth * ratio;
    const secondWidth = secondNaturalWidth * ratio;

    const reducedEndXPct = Math.max(100, adv.endXPct * ratio);
    const modifiedAdv = { ...adv, endXPct: reducedEndXPct };

    drawBoard(ctx, params, modifiedAdv, 0, firstWidth);
    drawBoard(ctx, params.secondRoute, modifiedAdv, firstWidth + gap, secondWidth);
  }
}
