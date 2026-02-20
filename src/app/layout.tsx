import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LangProvider } from "@/providers/LangProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { RefreshLoadingOverlay } from "@/components/RefreshLoadingOverlay";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SimRail XYZ",
    template: "%s — SimRail XYZ",
  },
  description: "A set of free tools for the SimRail community.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SimRail XYZ",
    description: "A set of free tools for the SimRail community.",
    siteName: "SimRail XYZ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SimRail XYZ",
    description: "A set of free tools for the SimRail community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
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
