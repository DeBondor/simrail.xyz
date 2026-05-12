import type {
  CircleLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

export const TRAINS_SOURCE_ID = "sim-trains";
export const TRAINS_ARROW_LAYER_ID = "sim-trains-arrow";
export const TRAINS_HALO_LAYER_ID = "sim-trains-halo";
export const TRAINS_AVATAR_LAYER_ID = "sim-trains-avatar";
export const TRAINS_LABEL_LAYER_ID = "sim-trains-label";

export const BOT_AVATAR_IMAGE_ID = "sim-bot-avatar";
export const ARROW_IMAGE_ID = "sim-dir-arrow";
export const AVATAR_IMAGE_PREFIX = "sim-avatar-";

export const trainsArrowLayer: SymbolLayerSpecification = {
  id: TRAINS_ARROW_LAYER_ID,
  type: "symbol",
  source: TRAINS_SOURCE_ID,
  filter: ["all", ["has", "heading"], [">=", ["get", "velocity"], 1]],
  layout: {
    "icon-image": ARROW_IMAGE_ID,
    "icon-rotate": ["get", "heading"],
    "icon-rotation-alignment": "map",
    "icon-pitch-alignment": "map",
    "icon-anchor": "top",
    "icon-offset": [0, 14],
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
    "icon-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      6,
      0.35,
      10,
      0.55,
      14,
      0.85,
    ],
  },
  paint: {
    "icon-opacity": 0.9,
  },
};

export const trainsHaloLayer: CircleLayerSpecification = {
  id: TRAINS_HALO_LAYER_ID,
  type: "circle",
  source: TRAINS_SOURCE_ID,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      6,
      10,
      12,
      14,
      20,
    ],
    "circle-color": ["get", "color"],
    "circle-opacity": 0.9,
    "circle-stroke-width": 2,
    "circle-stroke-color": [
      "case",
      ["==", ["get", "type"], "user"],
      "#ffffff",
      "#0b0b0e",
    ],
    "circle-stroke-opacity": 0.85,
  },
};

export const trainsAvatarLayer: SymbolLayerSpecification = {
  id: TRAINS_AVATAR_LAYER_ID,
  type: "symbol",
  source: TRAINS_SOURCE_ID,
  layout: {
    "icon-image": ["get", "iconImage"],
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
    "icon-anchor": "center",
    "icon-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      5,
      0.22,
      10,
      0.36,
      14,
      0.55,
    ],
  },
};

export const trainsLabelLayer: SymbolLayerSpecification = {
  id: TRAINS_LABEL_LAYER_ID,
  type: "symbol",
  source: TRAINS_SOURCE_ID,
  minzoom: 9,
  layout: {
    "text-field": ["get", "label"],
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      9,
      10,
      14,
      13,
    ],
    "text-anchor": "left",
    "text-offset": [1.4, 0],
    "text-allow-overlap": false,
    "text-optional": true,
  },
  paint: {
    "text-color": "#e8e8f0",
    "text-halo-color": "#0b0b0e",
    "text-halo-width": 1.4,
  },
};
