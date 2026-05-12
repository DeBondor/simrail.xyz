"use client";

import { ExternalLink } from "lucide-react";

function truncate(steamId: string): string {
  if (steamId.length <= 10) return steamId;
  return `${steamId.slice(0, 5)}…${steamId.slice(-4)}`;
}

export function SteamLink({ steamId }: { steamId: string }) {
  return (
    <a
      href={`https://steamcommunity.com/profiles/${encodeURIComponent(steamId)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:text-primary transition-colors"
    >
      {truncate(steamId)}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}
