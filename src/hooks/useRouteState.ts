"use client";

import { useReducer, useEffect } from "react";
import type { Dispatch } from "react";
import type { SegmentStyle, AdvancedSettings } from "@/lib/canvasRenderer";
import { DEFAULT_ADVANCED } from "@/lib/constants";

export interface IntermediateStation {
  name: string;
  bold: boolean;
  shape?: "circle" | "hexagon";
}

export interface RouteConfig {
  category: string;
  trainNumber: string;
  startStation: string;
  endStation: string;
  stations: IntermediateStation[];
  segmentStyles: SegmentStyle[];
  segmentDots: boolean[];
  customCatName: string;
  customPrimary: string;
  customSecondary: string;
}

export interface RouteState {
  routes: [RouteConfig, RouteConfig];
  activeRoute: 0 | 1;
  secondRouteEnabled: boolean;
  advanced: AdvancedSettings;
}

export type RouteAction =
  | { type: "SET_ACTIVE_ROUTE"; payload: 0 | 1 }
  | { type: "SET_SECOND_ROUTE_ENABLED"; payload: boolean }
  | { type: "COPY_PRIMARY_TO_SECOND" }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_TRAIN_NUMBER"; payload: string }
  | { type: "SET_START"; payload: string }
  | { type: "SET_END"; payload: string }
  | { type: "ADD_STATION"; payload: string }
  | { type: "REMOVE_STATION"; payload: number }
  | { type: "UPDATE_STATION"; payload: { index: number; name: string } }
  | { type: "TOGGLE_BOLD"; payload: number }
  | { type: "TOGGLE_STATION_SHAPE"; payload: number }
  | { type: "REORDER_STATIONS"; payload: IntermediateStation[] }
  | { type: "SET_SEGMENT_STYLE"; payload: { index: number; style: SegmentStyle } }
  | { type: "SET_SEGMENT_DOT"; payload: { index: number; dot: boolean } }
  | { type: "SET_ADVANCED"; payload: Partial<AdvancedSettings> }
  | { type: "RESET_ADVANCED" }
  | { type: "CLEAR_STATIONS" }
  | { type: "SET_CUSTOM_CAT_NAME"; payload: string }
  | { type: "SET_CUSTOM_PRIMARY"; payload: string }
  | { type: "SET_CUSTOM_SECONDARY"; payload: string }
  | {
      type: "IMPORT";
      payload: {
        category: string;
        trainNumber: string;
        startStation: string;
        endStation: string;
        stations: IntermediateStation[];
        customCatName?: string;
        segmentDots?: boolean[];
      };
    };

const STORAGE_KEY = "simrailxyz-route-state";
const SEGMENT_STYLES: SegmentStyle[] = ["solid", "dashed", "mixed"];

const DEFAULT_ROUTE: RouteConfig = {
  category: "EIP",
  trainNumber: "3510",
  startStation: "Kraków Główny",
  endStation: "Gdynia Główna",
  stations: [
    { name: "Warszawa Zachodnia", bold: false, shape: "circle" },
    { name: "Warszawa Centralna", bold: false, shape: "circle" },
    { name: "Warszawa Wschodnia", bold: false, shape: "circle" },
  ],
  segmentStyles: ["solid", "solid", "solid", "solid"],
  segmentDots: [false, false, false, false],
  customCatName: "MY",
  customPrimary: "#1a1a2e",
  customSecondary: "#e040fb",
};

const initialState: RouteState = {
  routes: [structuredClone(DEFAULT_ROUTE), structuredClone(DEFAULT_ROUTE)],
  activeRoute: 0,
  secondRouteEnabled: false,
  advanced: { ...DEFAULT_ADVANCED },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSegmentStyle(value: unknown): value is SegmentStyle {
  return typeof value === "string" && SEGMENT_STYLES.includes(value as SegmentStyle);
}

function ensureSegments(
  stations: IntermediateStation[],
  styles: SegmentStyle[]
): SegmentStyle[] {
  const needed = stations.length + 1;
  const result = [...styles];
  while (result.length < needed) result.push("solid");
  return result.slice(0, needed);
}

function ensureSegmentDots(
  stations: IntermediateStation[],
  dots: boolean[]
): boolean[] {
  const needed = stations.length + 1;
  const result = [...dots];
  while (result.length < needed) result.push(false);
  return result.slice(0, needed);
}

function cloneRouteConfig(route: RouteConfig): RouteConfig {
  return {
    ...route,
    stations: route.stations.map((station) => ({ ...station })),
    segmentStyles: [...route.segmentStyles],
    segmentDots: [...route.segmentDots],
  };
}

function normalizeStations(
  value: unknown,
  fallback: IntermediateStation[]
): IntermediateStation[] {
  if (!Array.isArray(value)) {
    return fallback.map((station) => ({ ...station }));
  }

  return value
    .filter(
      (station): station is IntermediateStation =>
        !!station &&
        typeof station === "object" &&
        "name" in station &&
        typeof station.name === "string"
    )
    .map((station) => ({
      name: station.name,
      bold: Boolean(station.bold),
      shape: station.shape === "hexagon" ? "hexagon" : "circle",
    }));
}

function normalizeRouteConfig(raw: unknown, fallback: RouteConfig): RouteConfig {
  if (!isRecord(raw)) return cloneRouteConfig(fallback);

  const stations = normalizeStations(raw.stations, fallback.stations);
  const parsedStyles = Array.isArray(raw.segmentStyles)
    ? raw.segmentStyles.filter(isSegmentStyle)
    : fallback.segmentStyles;

  const parsedDots = Array.isArray(raw.segmentDots)
    ? raw.segmentDots.map((d) => Boolean(d))
    : fallback.segmentDots;

  return {
    category: typeof raw.category === "string" ? raw.category : fallback.category,
    trainNumber:
      typeof raw.trainNumber === "string"
        ? raw.trainNumber
        : fallback.trainNumber,
    startStation:
      typeof raw.startStation === "string"
        ? raw.startStation
        : fallback.startStation,
    endStation:
      typeof raw.endStation === "string" ? raw.endStation : fallback.endStation,
    stations,
    segmentStyles: ensureSegments(stations, parsedStyles),
    segmentDots: ensureSegmentDots(stations, parsedDots),
    customCatName:
      typeof raw.customCatName === "string"
        ? raw.customCatName
        : fallback.customCatName,
    customPrimary:
      typeof raw.customPrimary === "string"
        ? raw.customPrimary
        : fallback.customPrimary,
    customSecondary:
      typeof raw.customSecondary === "string"
        ? raw.customSecondary
        : fallback.customSecondary,
  };
}

function buildHydratedState(parsed: unknown): RouteState {
  if (!isRecord(parsed)) return initialState;

  const rawRoutes = Array.isArray(parsed.routes) ? parsed.routes : null;
  const firstRoute = rawRoutes
    ? normalizeRouteConfig(rawRoutes[0], initialState.routes[0])
    : normalizeRouteConfig(parsed, initialState.routes[0]);

  const secondRoute = rawRoutes
    ? normalizeRouteConfig(rawRoutes[1], firstRoute)
    : isRecord(parsed.secondRoute)
      ? normalizeRouteConfig(parsed.secondRoute, firstRoute)
      : cloneRouteConfig(firstRoute);

  const advanced = isRecord(parsed.advanced)
    ? { ...DEFAULT_ADVANCED, ...parsed.advanced }
    : { ...DEFAULT_ADVANCED };

  const secondRouteEnabled =
    typeof parsed.secondRouteEnabled === "boolean"
      ? parsed.secondRouteEnabled
      : false;

  const activeRoute =
    secondRouteEnabled && parsed.activeRoute === 1 ? 1 : 0;

  return {
    routes: [firstRoute, secondRoute],
    activeRoute,
    secondRouteEnabled,
    advanced,
  };
}

function updateActiveRoute(
  state: RouteState,
  updater: (route: RouteConfig) => RouteConfig
): RouteState {
  const nextRoutes: [RouteConfig, RouteConfig] = [
    cloneRouteConfig(state.routes[0]),
    cloneRouteConfig(state.routes[1]),
  ];
  nextRoutes[state.activeRoute] = updater(nextRoutes[state.activeRoute]);
  return { ...state, routes: nextRoutes };
}

function reducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case "SET_ACTIVE_ROUTE":
      if (action.payload === 1 && !state.secondRouteEnabled) return state;
      return { ...state, activeRoute: action.payload };
    case "SET_SECOND_ROUTE_ENABLED":
      if (action.payload) return { ...state, secondRouteEnabled: true };
      return { ...state, secondRouteEnabled: false, activeRoute: 0 };
    case "COPY_PRIMARY_TO_SECOND":
      return {
        ...state,
        routes: [
          cloneRouteConfig(state.routes[0]),
          cloneRouteConfig(state.routes[0]),
        ],
      };
    case "SET_CATEGORY":
      return updateActiveRoute(state, (route) => ({
        ...route,
        category: action.payload,
      }));
    case "SET_TRAIN_NUMBER":
      return updateActiveRoute(state, (route) => ({
        ...route,
        trainNumber: action.payload,
      }));
    case "SET_START":
      return updateActiveRoute(state, (route) => ({
        ...route,
        startStation: action.payload,
      }));
    case "SET_END":
      return updateActiveRoute(state, (route) => ({
        ...route,
        endStation: action.payload,
      }));
    case "ADD_STATION":
      return updateActiveRoute(state, (route) => {
        const stations = [...route.stations, { name: action.payload, bold: false, shape: "circle" as const }];
        return {
          ...route,
          stations,
          segmentStyles: ensureSegments(stations, route.segmentStyles),
          segmentDots: ensureSegmentDots(stations, route.segmentDots),
        };
      });
    case "REMOVE_STATION":
      return updateActiveRoute(state, (route) => {
        const stations = route.stations.filter((_, i) => i !== action.payload);
        const styles = [...route.segmentStyles];
        styles.splice(action.payload + 1, 1);
        const dots = [...route.segmentDots];
        dots.splice(action.payload + 1, 1);
        return {
          ...route,
          stations,
          segmentStyles: ensureSegments(stations, styles),
          segmentDots: ensureSegmentDots(stations, dots),
        };
      });
    case "UPDATE_STATION":
      return updateActiveRoute(state, (route) => ({
        ...route,
        stations: route.stations.map((station, i) =>
          i === action.payload.index
            ? { ...station, name: action.payload.name }
            : station
        ),
      }));
    case "TOGGLE_BOLD":
      return updateActiveRoute(state, (route) => ({
        ...route,
        stations: route.stations.map((station, i) =>
          i === action.payload ? { ...station, bold: !station.bold } : station
        ),
      }));
    case "TOGGLE_STATION_SHAPE":
      return updateActiveRoute(state, (route) => ({
        ...route,
        stations: route.stations.map((station, i) =>
          i === action.payload
            ? { ...station, shape: station.shape === "hexagon" ? "circle" : "hexagon" }
            : station
        ),
      }));
    case "REORDER_STATIONS":
      return updateActiveRoute(state, (route) => ({
        ...route,
        stations: action.payload,
        segmentStyles: ensureSegments(action.payload, route.segmentStyles),
        segmentDots: ensureSegmentDots(action.payload, route.segmentDots),
      }));
    case "SET_SEGMENT_STYLE":
      return updateActiveRoute(state, (route) => {
        const styles = [...route.segmentStyles];
        styles[action.payload.index] = action.payload.style;
        return { ...route, segmentStyles: styles };
      });
    case "SET_SEGMENT_DOT":
      return updateActiveRoute(state, (route) => {
        const dots = [...route.segmentDots];
        dots[action.payload.index] = action.payload.dot;
        return { ...route, segmentDots: dots };
      });
    case "SET_ADVANCED":
      return { ...state, advanced: { ...state.advanced, ...action.payload } };
    case "RESET_ADVANCED":
      return { ...state, advanced: { ...DEFAULT_ADVANCED } };
    case "CLEAR_STATIONS":
      return updateActiveRoute(state, (route) => ({
        ...route,
        stations: [],
        segmentStyles: ["solid"],
        segmentDots: [false],
      }));
    case "SET_CUSTOM_CAT_NAME":
      return updateActiveRoute(state, (route) => ({
        ...route,
        customCatName: action.payload,
      }));
    case "SET_CUSTOM_PRIMARY":
      return updateActiveRoute(state, (route) => ({
        ...route,
        customPrimary: action.payload,
      }));
    case "SET_CUSTOM_SECONDARY":
      return updateActiveRoute(state, (route) => ({
        ...route,
        customSecondary: action.payload,
      }));
    case "IMPORT": {
      const {
        category,
        trainNumber,
        startStation,
        endStation,
        stations,
        customCatName,
        segmentDots,
      } = action.payload;
      return updateActiveRoute(state, (route) => ({
        ...route,
        category,
        trainNumber,
        startStation,
        endStation,
        stations,
        segmentStyles: ensureSegments(stations, []),
        segmentDots: ensureSegmentDots(stations, segmentDots ?? []),
        ...(customCatName ? { customCatName } : {}),
      }));
    }
    default:
      return state;
  }
}

export function useRouteState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = buildHydratedState(JSON.parse(raw));
        dispatch({ type: "SET_SECOND_ROUTE_ENABLED", payload: parsed.secondRouteEnabled });
        dispatch({ type: "SET_ACTIVE_ROUTE", payload: parsed.activeRoute });
        dispatch({ type: "SET_ADVANCED", payload: parsed.advanced });
        // Restore both routes
        const route0 = parsed.routes[0];
        const route1 = parsed.routes[1];
        dispatch({ type: "SET_ACTIVE_ROUTE", payload: 0 });
        dispatch({ type: "IMPORT", payload: route0 });
        dispatch({ type: "SET_CUSTOM_PRIMARY", payload: route0.customPrimary });
        dispatch({ type: "SET_CUSTOM_SECONDARY", payload: route0.customSecondary });
        dispatch({ type: "SET_ACTIVE_ROUTE", payload: 1 });
        dispatch({ type: "IMPORT", payload: route1 });
        dispatch({ type: "SET_CUSTOM_PRIMARY", payload: route1.customPrimary });
        dispatch({ type: "SET_CUSTOM_SECONDARY", payload: route1.customSecondary });
        dispatch({ type: "SET_ACTIVE_ROUTE", payload: parsed.activeRoute });
      }
    } catch (e) {
      console.warn("Failed to read route state from localStorage:", e);
    }
    setHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save route state to localStorage:", e);
    }
  }, [state, hydrated]);

  return { state, dispatch };
}

export type RouteDispatch = Dispatch<RouteAction>;
