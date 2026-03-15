"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Heart,
  Map,
  ChevronRight,
  Layers,
  Github,
  Clock,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/providers/LangProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ReactNode } from "react";


function ToolCard({
  icon,
  title,
  desc,
  tag,
  updateBadge,
  href,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  tag: { label: string; variant: "available" | "soon" };
  updateBadge?: string;
  href?: string;
}) {
  const isAvailable = tag.variant === "available";

  const card = (
    <div
      className={`glass-card h-full rounded-xl py-0 relative overflow-hidden ${
        isAvailable
          ? "transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
          : "cursor-default opacity-45"
      }`}
    >
      {isAvailable && (
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="pt-7 px-6 pb-0 relative">
        <div
          className={`w-11 h-11 bg-gradient-to-br border rounded-lg flex items-center justify-center text-primary ${
            isAvailable
              ? "from-primary/20 to-primary/5 border-primary/30"
              : "from-primary/[8%] to-primary/[2%] border-primary/20"
          }`}
        >
          {icon}
        </div>
      </div>
      <div className="space-y-1.5 px-6 py-4 relative">
        <div
          className={`text-base font-bold tracking-tight ${
            isAvailable ? "" : "text-muted-foreground"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-sm leading-relaxed ${
            isAvailable
              ? "text-muted-foreground"
              : "text-muted-foreground/70"
          }`}
        >
          {desc}
        </div>
      </div>
      <div className="flex items-center justify-between px-6 pb-6 relative">
        <div className="flex items-center gap-2">
          {isAvailable ? (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/40 text-[0.62rem] font-bold tracking-widest uppercase"
            >
              {tag.label}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[0.62rem] font-bold tracking-widest uppercase border-primary/40 text-primary/80"
            >
              {tag.label}
            </Badge>
          )}
          {updateBadge && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/40 text-[0.6rem] font-bold tracking-widest uppercase"
            >
              {updateBadge}
            </Badge>
          )}
        </div>
        {isAvailable && (
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="group block">
      {card}
    </Link>
  ) : (
    <div className="group">{card}</div>
  );
}


export default function HomePage() {
  const { t } = useLang();
  useScrollReveal();

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 gap-5 overflow-hidden">
        <div
          className="animate-pulse-glow pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
          style={{ top: "30%", left: "30%", "--delay": "0ms" }}
        />
        <div
          className="animate-pulse-glow pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[120px]"
          style={{ top: "20%", left: "65%", "--delay": "2600ms" }}
        />
        <div
          className="animate-float pointer-events-none absolute w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px]"
          style={{ top: "60%", left: "50%", "--delay": "1200ms" }}
        />

        <div className="hero-grid pointer-events-none absolute inset-0" />

        <div className="animate-fade-in-up relative" style={{ "--delay": "0ms" }}>
          <Badge
            variant="outline"
            className="gap-1.5 border-primary/60 text-primary bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
          >
            <Layers className="h-3 w-3" />
            {t.heroBadge}
          </Badge>
        </div>

        <h1
          className="animate-fade-in-up relative text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          style={{ "--delay": "100ms" }}
        >
          {t.heroTitle}{" "}
          <span className="bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] inline-block animate-gradient-shift">
            SimRail XYZ
          </span>
        </h1>

        <p
          className="animate-fade-in-up relative text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed"
          style={{ "--delay": "200ms" }}
        >
          {t.heroDesc}
        </p>

        <div
          className="animate-fade-in-up relative flex gap-3 flex-wrap justify-center mt-3"
          style={{ "--delay": "300ms" }}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/route">
              <MapPin className="h-4 w-4" />
              {t.heroRouteGen}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 backdrop-blur-sm">
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

        {/* Browser-framed screenshot */}
        <div
          className="animate-fade-in-up [perspective:1400px] relative w-full max-w-[920px] mx-auto mt-4"
          style={{ "--delay": "400ms" }}
        >
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out [transform:rotateX(6deg)] hover:[transform:rotateX(2deg)]">
            {/* Traffic-light bar */}
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-card border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-app-green" />
              <div className="flex-1 mx-2.5 h-5 rounded bg-background text-[10px] flex items-center justify-center text-muted-foreground/40 tracking-wide">
                simrail.xyz/route
              </div>
            </div>
            {/* Screenshot — replace placeholder with <Image> once route-screenshot.png exists */}
            <div className="h-[380px] bg-card flex items-center justify-center text-muted-foreground/20 text-xs tracking-widest uppercase">
              Screenshot coming soon
            </div>
          </div>
          {/* Fade into tool cards */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        </div>
      </section>

      <div className="reveal flex items-center gap-4 px-10 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground/40 whitespace-nowrap">
          {t.dividerTools}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section className="reveal px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <ToolCard
            icon={<MapPin className="h-5 w-5" />}
            title={t.toolRouteTitle}
            desc={t.toolRouteDesc}
            tag={{ label: t.tagAvailable, variant: "available" }}
            updateBadge={t.tagUpdated}
            href="/route"
          />
          <ToolCard
            icon={<Map className="h-5 w-5" />}
            title={t.toolLiveMapTitle}
            desc={t.toolLiveMapDesc}
            tag={{ label: t.tagSoon, variant: "soon" }}
          />
          <ToolCard
            icon={<Clock className="h-5 w-5" />}
            title={t.toolTimetableTitle}
            desc={t.toolTimetableDesc}
            tag={{ label: t.tagSoon, variant: "soon" }}
          />
        </div>
      </section>

      <footer className="reveal mt-auto relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/simrailxyz.svg" width={26} height={26} alt="" className="rounded-md" />
              <span className="text-sm font-bold tracking-widest uppercase">
                <span className="text-primary">SimRail</span> XYZ
              </span>
              <span className="hidden sm:block w-px h-4 bg-border" />
              <span className="text-xs text-muted-foreground tracking-wider">
                Made with{" "}
                <Heart className="inline h-3 w-3 text-primary align-[-1px]" fill="currentColor" />{" "}
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
