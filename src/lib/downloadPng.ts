import { drawMap } from "./canvasRenderer";
import type { DrawParams, AdvancedSettings } from "./canvasRenderer";

export function downloadAsPng(
  params: DrawParams,
  adv: AdvancedSettings
): void {
  const offscreen = document.createElement("canvas");
  const ctx = offscreen.getContext("2d");
  if (!ctx) return;
  drawMap(ctx, offscreen, params, adv);
  const a = document.createElement("a");
  a.download = `route_${params.cat}_${params.num}.png`;
  a.href = offscreen.toDataURL("image/png");
  a.click();
}

