import type {
  CircleLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

export const STATIONS_SOURCE_ID = "sim-stations";
export const STATIONS_HALO_LAYER_ID = "sim-stations-halo";
export const STATIONS_DOT_LAYER_ID = "sim-stations-dot";
export const STATIONS_LABEL_LAYER_ID = "sim-stations-label";

export const stationsHaloLayer: CircleLayerSpecification = {
  id: STATIONS_HALO_LAYER_ID,
  type: "circle",
  source: STATIONS_SOURCE_ID,
  filter: ["==", ["get", "manned"], true],
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      6,
      6,
      12,
      14,
    ],
    "circle-color": "#cf5d54",
    "circle-opacity": 0.25,
    "circle-stroke-color": "#cf5d54",
    "circle-stroke-width": 1.5,
    "circle-stroke-opacity": 0.85,
  },
};

export const stationsDotLayer: CircleLayerSpecification = {
  id: STATIONS_DOT_LAYER_ID,
  type: "circle",
  source: STATIONS_SOURCE_ID,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      2,
      10,
      3.5,
      14,
      6,
    ],
    "circle-color": [
      "case",
      ["==", ["get", "manned"], true],
      "#cf5d54",
      "#9898b0",
    ],
    "circle-stroke-width": 1,
    "circle-stroke-color": "#0b0b0e",
  },
};

export const stationsLabelLayer: SymbolLayerSpecification = {
  id: STATIONS_LABEL_LAYER_ID,
  type: "symbol",
  source: STATIONS_SOURCE_ID,
  minzoom: 8,
  layout: {
    "text-field": ["get", "name"],
    "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
    "text-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      8,
      10,
      14,
      13,
    ],
    "text-anchor": "top",
    "text-offset": [0, 0.6],
    "text-optional": true,
  },
  paint: {
    "text-color": "#9898b0",
    "text-halo-color": "#0b0b0e",
    "text-halo-width": 1.2,
  },
};
