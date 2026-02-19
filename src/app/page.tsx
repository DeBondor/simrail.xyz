"use client";

import Link from "next/link";
import { MapPin, Heart, Map, ChevronRight, Layers, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useLang } from "@/providers/LangProvider";

export default function HomePage() {
  const { t } = useLang();

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 gap-4">
        <Badge variant="outline" className="gap-1.5 border-primary text-primary bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase">
          <Layers className="h-3 w-3" />
          {t.heroBadge}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {t.heroTitle} <span className="text-primary">SimRail XYZ</span>
        </h1>
        <p className="text-muted-foreground max-w-130 leading-relaxed">
          {t.heroDesc}
        </p>
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <Button asChild size="lg" className="gap-2">
            <Link href="/route">
              <MapPin className="h-4 w-4" />
              {t.heroRouteGen}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
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
      </section>

      <div className="flex items-center gap-4 px-10 mb-8">
        <Separator className="flex-1" />
        <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">
          {t.dividerTools}
        </span>
        <Separator className="flex-1" />
      </div>

      <section className="px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/route" className="group">
            <Card className="h-full transition-all hover:border-muted-foreground/40 hover:-translate-y-0.5 relative overflow-hidden py-0">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-0 pt-7 px-6">
                <div className="w-11 h-11 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 px-6 py-3.5">
                <div className="text-base font-bold tracking-tight">{t.toolRouteTitle}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{t.toolRouteDesc}</div>
              </CardContent>
              <CardFooter className="flex items-center justify-between px-6 pb-6">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/40 text-[0.62rem] font-bold tracking-widest uppercase">
                  {t.tagAvailable}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </CardFooter>
            </Card>
          </Link>

          <Card className="opacity-55 cursor-default py-0">
            <CardHeader className="pb-0 pt-7 px-6">
              <div className="w-11 h-11 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-center text-primary opacity-60">
                <Map className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 px-6 py-3.5">
              <div className="text-base font-bold tracking-tight">{t.toolLiveMapTitle}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{t.toolLiveMapDesc}</div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <Badge variant="outline" className="text-[0.62rem] font-bold tracking-widest uppercase">
                {t.tagSoon}
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      <footer className="mt-auto py-5 px-10 border-t border-border flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground tracking-wider">
          Made with{" "}
          <Heart className="inline h-3 w-3 text-primary align-[-1px]" fill="currentColor" />{" "}
          <strong className="text-accent-foreground">by DeBondor</strong>
        </p>
        <p className="text-xs text-muted-foreground tracking-wider">
          {t.footerDisclaimer}
        </p>
      </footer>
    </div>
  );
}
