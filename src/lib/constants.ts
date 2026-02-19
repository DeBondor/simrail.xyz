import type { AdvancedSettings } from "./canvasRenderer";

export const BASE_W = 1699;
export const H = 720;
export const TRACK_LEFT = 161;
export const BASE_TRACK_RIGHT = 1540;
export const RIGHT_MARGIN = BASE_W - BASE_TRACK_RIGHT;

export const DEFAULT_ADVANCED: AdvancedSettings = {
  sqSize: 83,
  triW: 84,
  triH: 84,
  trackY: 677,
  lineH: 4,
  fixedGap: 36,
  sidebarW: 96,
  endXPct: 100,
  fontSizeStart: 48,
  fontSizeMid: 40,
  fontSizeEnd: 48,
};

