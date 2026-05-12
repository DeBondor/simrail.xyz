"use client";

import useSWR from "swr";

const ENDPOINT = "/api/steam/avatars";

interface AvatarsResponse {
  avatars: Record<string, string | null>;
}

async function postFetcher(
  key: [string, string]
): Promise<AvatarsResponse> {
  const [, idsCsv] = key;
  const steamIds = idsCsv ? idsCsv.split(",") : [];
  if (steamIds.length === 0) return { avatars: {} };
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ steamIds }),
  });
  if (!res.ok) throw new Error(`avatar fetch failed: ${res.status}`);
  return (await res.json()) as AvatarsResponse;
}

export function useSteamAvatars(steamIds: Array<string | null | undefined>): Record<string, string> {
  const unique = Array.from(
    new Set(steamIds.filter((s): s is string => typeof s === "string" && s.length > 0))
  ).sort();
  const idsCsv = unique.join(",");
  const key = idsCsv ? (["steam-avatars", idsCsv] as [string, string]) : null;

  const { data } = useSWR<AvatarsResponse>(key, postFetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  if (!data) return {};
  const out: Record<string, string> = {};
  for (const [id, url] of Object.entries(data.avatars)) {
    if (url) out[id] = url;
  }
  return out;
}
