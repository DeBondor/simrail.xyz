import type { Metadata } from "next";
import RouteClient from "./RouteClient";

export const metadata: Metadata = {
  title: "Route Generator — SimRail XYZ",
  description:
    "Generate aesthetic route boards for SimRail trains with category selection, intermediate stations and color palette.",
};

export default function RoutePage() {
  return <RouteClient />;
}
