"use client";

import { useLang } from "@/providers/LangProvider";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { downloadAsPng } from "@/lib/downloadPng";
import { collectParams } from "@/components/route/CanvasPreview";
import type { RouteState } from "@/hooks/useRouteState";

interface ActionBarProps {
  state: RouteState;
}

export function ActionBar({ state }: ActionBarProps) {
  const { t } = useLang();

  const handleDownload = () => {
    const params = collectParams(state);
    downloadAsPng(params, state.advanced);
  };

  return (
    <div className="flex gap-2.5 w-full shrink-0 pt-1">
      <Button className="flex-1 py-3 text-[0.95rem] gap-2 font-bold">
        <RefreshCw className="h-4 w-4" />
        {t.btnGenerate}
      </Button>
      <Button
        className="flex-1 py-3 text-[0.95rem] gap-2 font-bold bg-app-green hover:bg-app-green-hover text-white"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        {t.btnDownload}
      </Button>
    </div>
  );
}

