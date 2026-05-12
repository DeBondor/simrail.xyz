import { NextResponse } from "next/server";

interface CacheEntry {
  url: string | null;
  fetchedAt: number;
}

const CACHE = new Map<string, CacheEntry>();
const HIT_TTL_MS = 60 * 60 * 1000;
const MISS_TTL_MS = 5 * 60 * 1000;
const FETCH_CONCURRENCY = 6;

const AVATAR_RE =
  /<avatarMedium>\s*<!\[CDATA\[([^\]]+)\]\]>\s*<\/avatarMedium>/i;

async function fetchOne(steamId: string): Promise<string | null> {
  const url = `https://steamcommunity.com/profiles/${encodeURIComponent(
    steamId
  )}/?xml=1`;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "simrail.xyz-avatar-bot/1.0" },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const m = xml.match(AVATAR_RE);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

async function runWithLimit<T>(
  items: string[],
  limit: number,
  worker: (id: string) => Promise<T>
): Promise<Record<string, T>> {
  const out: Record<string, T> = {};
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      const id = items[idx];
      out[id] = await worker(id);
    }
  });
  await Promise.all(runners);
  return out;
}

function isValidSteamId(s: unknown): s is string {
  return typeof s === "string" && /^\d{17}$/.test(s);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ avatars: {} }, { status: 400 });
  }

  const ids = Array.isArray((body as { steamIds?: unknown })?.steamIds)
    ? ((body as { steamIds: unknown[] }).steamIds.filter(isValidSteamId) as string[])
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ avatars: {} });
  }

  const now = Date.now();
  const result: Record<string, string | null> = {};
  const toFetch: string[] = [];

  for (const id of ids) {
    const cached = CACHE.get(id);
    if (cached) {
      const ttl = cached.url ? HIT_TTL_MS : MISS_TTL_MS;
      if (now - cached.fetchedAt < ttl) {
        result[id] = cached.url;
        continue;
      }
    }
    toFetch.push(id);
  }

  if (toFetch.length > 0) {
    const fetched = await runWithLimit(toFetch, FETCH_CONCURRENCY, fetchOne);
    for (const id of toFetch) {
      const url = fetched[id] ?? null;
      CACHE.set(id, { url, fetchedAt: now });
      result[id] = url;
    }
  }

  return NextResponse.json(
    { avatars: result },
    {
      headers: {
        "cache-control": "private, max-age=60",
      },
    }
  );
}
