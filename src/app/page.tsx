"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Map,
  Layers,
  Github,
  Clock,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/providers/LangProvider";
import type { ReactNode } from "react";
import type { Translations } from "@/lib/i18n";

type Tool = {
  icon: ReactNode;
  title: string;
  desc: string;
  available: boolean;
  href?: string;
};

function getTools(t: Translations): Tool[] {
  return [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t.toolRouteTitle,
      desc: t.toolRouteDesc,
      available: true,
      href: "/route",
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: t.toolLiveMapTitle,
      desc: t.toolLiveMapDesc,
      available: true,
      href: "/map",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: t.toolTimetableTitle,
      desc: t.toolTimetableDesc,
      available: false,
    },
  ];
}

function ToolCard({ tool, t }: { tool: Tool; t: Translations }) {
  const card = (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card h-full transition-all duration-300 ${
        tool.available
          ? "hover:-translate-y-1 hover:shadow-2xl hover:border-primary/40"
          : "opacity-50"
      }`}
    >
      <div
        className={`h-32 ${
          tool.available
            ? "bg-linear-to-br from-primary/30 via-primary/10 to-transparent"
            : "bg-muted"
        }`}
      />
      <div className="p-7 -mt-10 relative">
        <div
          className={`size-14 rounded-xl border flex items-center justify-center bg-card ${
            tool.available
              ? "border-primary/40 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          {tool.icon}
        </div>
        <div className="mt-5 text-xl font-semibold tracking-tight">
          {tool.title}
        </div>
        <p className="mt-2 max-w-[56ch] text-sm text-pretty text-muted-foreground">
          {tool.desc}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-[0.62rem] font-bold tracking-widest uppercase ${
              tool.available
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                : "border-border text-muted-foreground"
            }`}
          >
            {tool.available ? t.tagAvailable : t.tagSoon}
          </Badge>
          {tool.available && (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>
    </div>
  );

  return tool.href ? (
    <Link href={tool.href} className="group block">
      {card}
    </Link>
  ) : (
    <div className="group">{card}</div>
  );
}

export default function HomePage() {
  const { t } = useLang();
  const tools = getTools(t);

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_55%_at_50%_-5%,oklch(from_var(--color-primary)_l_c_h/0.30),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(35%_30%_at_85%_20%,oklch(from_var(--color-primary)_l_c_h/0.18),transparent_70%)]"
        />
        <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-16 md:pt-32 md:pb-24 text-center">
          <Badge
            variant="outline"
            className="gap-1.5 border-primary/40 text-primary bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
          >
            <Layers className="h-3 w-3" />
            {t.heroBadge}
          </Badge>
          <h1 className="mt-8 mx-auto max-w-[20ch] text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-balance">
            {t.heroTitle} <span className="text-primary">SimRail XYZ</span>
          </h1>
          <p className="mt-6 mx-auto max-w-[48ch] text-lg md:text-xl text-pretty text-muted-foreground">
            {t.heroDesc}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/route">
                <MapPin className="h-4 w-4" />
                {t.heroRouteGen}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 backdrop-blur-sm"
            >
              <a
                href="https://github.com/DeBondor/simrail.xyz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.heroGithub} (opens in new tab)`}
              >
                <Github className="h-4 w-4" />
                {t.heroGithub}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <ToolCard key={i} tool={tool} t={t} />
          ))}
        </div>
      </section>

      <footer className="mt-auto relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.svg"
                width={26}
                height={26}
                alt=""
                className="rounded-md"
              />
              <span className="text-sm font-bold tracking-widest uppercase">
                <span className="text-primary">SimRail</span> XYZ
              </span>
              <span className="hidden sm:block w-px h-4 bg-border" />
              <span className="text-xs text-muted-foreground tracking-wider">
                Made with{" "}
                <Heart
                  className="inline h-3 w-3 text-primary align-[-1px]"
                  fill="currentColor"
                />{" "}
                <strong className="text-accent-foreground">by DeBondor</strong>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/DeBondor/simrail.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
              <span className="w-px h-3.5 bg-border" />
              <a
                href="https://github.com/DeBondor/simrail.xyz/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Scale className="h-3.5 w-3.5" />
                {t.footerLicense}
              </a>
            </div>
          </div>

          <div className="border-t border-border/50">
            <div className="max-w-5xl mx-auto px-10 py-4">
              <p className="text-[0.68rem] text-muted-foreground/70 text-center leading-relaxed">
                {t.footerDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
