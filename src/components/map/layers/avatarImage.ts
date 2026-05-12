const AVATAR_PX = 96;

function loadHTMLImage(url: string, crossOrigin: string | null = "anonymous"): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export async function makeRoundAvatarImage(url: string): Promise<ImageData> {
  const img = await loadHTMLImage(url);
  const size = AVATAR_PX;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d ctx unavailable");

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, size, size);
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

export async function makeBotAvatarImage(svgUrl: string): Promise<ImageData> {
  const img = await loadHTMLImage(svgUrl, null);
  const size = AVATAR_PX;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d ctx unavailable");

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, size, size);
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

export async function loadArrowImage(svgUrl: string): Promise<ImageData> {
  const img = await loadHTMLImage(svgUrl, null);
  const w = 32;
  const h = 48;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d ctx unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}
