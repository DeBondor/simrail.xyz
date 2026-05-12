import type { Metadata } from "next";
import MapClient from "./MapClient";

export const metadata: Metadata = {
  title: "Live Map",
  description:
    "Track train positions in real time on an interactive map of SimRail servers.",
};

export default function MapPage() {
  return <MapClient />;
}
