"use client";

import { useReducer, useEffect } from "react";
import type { SegmentStyle, AdvancedSettings } from "@/lib/canvasRenderer";
import { DEFAULT_ADVANCED } from "@/lib/constants";

export interface IntermediateStation {
  name: string;
  bold: boolean;
}

export interface RouteState {
  category: string;
  trainNumber: string;
  startStation: string;
  endStation: string;
  stations: IntermediateStation[];
  segmentStyles: SegmentStyle[];
  advanced: AdvancedSettings;
  customCatName: string;
  customPrimary: string;
  customSecondary: string;
}

type RouteAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_TRAIN_NUMBER"; payload: string }
  | { type: "SET_START"; payload: string }
  | { type: "SET_END"; payload: string }
  | { type: "ADD_STATION"; payload: string }
  | { type: "REMOVE_STATION"; payload: number }
  | { type: "UPDATE_STATION"; payload: { index: number; name: string } }
  | { type: "TOGGLE_BOLD"; payload: number }
  | { type: "REORDER_STATIONS"; payload: IntermediateStation[] }
  | { type: "SET_SEGMENT_STYLE"; payload: { index: number; style: SegmentStyle } }
  | { type: "SET_ADVANCED"; payload: Partial<AdvancedSettings> }
  | { type: "RESET_ADVANCED" }
  | { type: "CLEAR_STATIONS" }
  | { type: "SET_CUSTOM_CAT_NAME"; payload: string }
  | { type: "SET_CUSTOM_PRIMARY"; payload: string }
  | { type: "SET_CUSTOM_SECONDARY"; payload: string }
  | { type: "IMPORT"; payload: { category: string; trainNumber: string; startStation: string; endStation: string; stations: IntermediateStation[]; customCatName?: string } }
  | { type: "HYDRATE"; payload: RouteState };

const initialState: RouteState = {
  category: "EIP",
  trainNumber: "3510",
  startStation: "Kraków Główny",
  endStation: "Gdynia Główna",
  stations: [
    { name: "Warszawa Zachodnia", bold: false },
    { name: "Warszawa Centralna", bold: false },
    { name: "Warszawa Wschodnia", bold: false },
  ],
  segmentStyles: ["solid", "solid", "solid", "solid"],
  advanced: { ...DEFAULT_ADVANCED },
  customCatName: "MY",
  customPrimary: "#1a1a2e",
  customSecondary: "#e040fb",
};

function ensureSegments(stations: IntermediateStation[], styles: SegmentStyle[]): SegmentStyle[] {
  const needed = stations.length + 1;
  const result = [...styles];
  while (result.length < needed) result.push("solid");
  return result.slice(0, needed);
}

function reducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_TRAIN_NUMBER":
      return { ...state, trainNumber: action.payload };
    case "SET_START":
      return { ...state, startStation: action.payload };
    case "SET_END":
      return { ...state, endStation: action.payload };
    case "ADD_STATION": {
      const stations = [...state.stations, { name: action.payload, bold: false }];
      return { ...state, stations, segmentStyles: ensureSegments(stations, state.segmentStyles) };
    }
    case "REMOVE_STATION": {
      const stations = state.stations.filter((_, i) => i !== action.payload);
      const styles = [...state.segmentStyles];
      styles.splice(action.payload + 1, 1);
      return { ...state, stations, segmentStyles: ensureSegments(stations, styles) };
    }
    case "UPDATE_STATION": {
      const stations = state.stations.map((s, i) =>
        i === action.payload.index ? { ...s, name: action.payload.name } : s
      );
      return { ...state, stations };
    }
    case "TOGGLE_BOLD": {
      const stations = state.stations.map((s, i) =>
        i === action.payload ? { ...s, bold: !s.bold } : s
      );
      return { ...state, stations };
    }
    case "REORDER_STATIONS":
      return { ...state, stations: action.payload, segmentStyles: ensureSegments(action.payload, state.segmentStyles) };
    case "SET_SEGMENT_STYLE": {
      const styles = [...state.segmentStyles];
      styles[action.payload.index] = action.payload.style;
      return { ...state, segmentStyles: styles };
    }
    case "SET_ADVANCED":
      return { ...state, advanced: { ...state.advanced, ...action.payload } };
    case "RESET_ADVANCED":
      return { ...state, advanced: { ...DEFAULT_ADVANCED } };
    case "CLEAR_STATIONS":
      return { ...state, stations: [], segmentStyles: ["solid"] };
    case "SET_CUSTOM_CAT_NAME":
      return { ...state, customCatName: action.payload };
    case "SET_CUSTOM_PRIMARY":
      return { ...state, customPrimary: action.payload };
    case "SET_CUSTOM_SECONDARY":
      return { ...state, customSecondary: action.payload };
    case "IMPORT": {
      const { category, trainNumber, startStation, endStation, stations, customCatName } = action.payload;
      return {
        ...state,
        category,
        trainNumber,
        startStation,
        endStation,
        stations,
        segmentStyles: ensureSegments(stations, []),
        ...(customCatName ? { customCatName } : {}),
      };
    }
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = "simrailxyz-route-state";

export function useRouteState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const hydrated: RouteState = {
          ...initialState,
          ...parsed,
          advanced: { ...DEFAULT_ADVANCED, ...parsed.advanced },
        };
        dispatch({ type: "HYDRATE", payload: hydrated });
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }, [state]);

  return { state, dispatch };
}

