import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LangProvider } from "@/providers/LangProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { RefreshLoadingOverlay } from "@/components/RefreshLoadingOverlay";

export const metadata: Metadata = {
  title: "SimRail XYZ",
  description: "A set of free tools for the SimRail community.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23cf5d54'/%3E%3Ctext x='16' y='22' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle' fill='white'%3ESR%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LangProvider>
            <TooltipProvider>
              <RefreshLoadingOverlay />
              <Navbar />
              {children}
            </TooltipProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
