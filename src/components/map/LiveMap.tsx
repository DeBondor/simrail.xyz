"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import Map, {
  Layer,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, FeatureCollection, Point } from "geojson";

import type { StationDTO, TrainDTO } from "@/lib/simrail/dto";
import { colorSchemes } from "@/lib/colorSchemes";
import { useSteamAvatars } from "@/hooks/sim/useSteamAvatars";
import { useTrainHeadings } from "@/hooks/sim/useTrainHeadings";
import {
  DARK_STYLE_URL,
  DEFAULT_ZOOM,
  LIGHT_STYLE_URL,
  POLAND_CENTER,
} from "./styles";
import {
  ARROW_IMAGE_ID,
  AVATAR_IMAGE_PREFIX,
  BOT_AVATAR_IMAGE_ID,
  TRAINS_ARROW_LAYER_ID,
  TRAINS_AVATAR_LAYER_ID,
  TRAINS_HALO_LAYER_ID,
  TRAINS_LABEL_LAYER_ID,
  TRAINS_SOURCE_ID,
  trainsArrowLayer,
  trainsAvatarLayer,
  trainsHaloLayer,
  trainsLabelLayer,
} from "./layers/trainsLayer";
import {
  loadArrowImage,
  makeBotAvatarImage,
  makeRoundAvatarImage,
} from "./layers/avatarImage";
import {
  STATIONS_DOT_LAYER_ID,
  STATIONS_HALO_LAYER_ID,
  STATIONS_LABEL_LAYER_ID,
  STATIONS_SOURCE_ID,
  stationsDotLayer,
  stationsHaloLayer,
  stationsLabelLayer,
} from "./layers/stationsLayer";

const FALLBACK_TRAIN_COLOR = "#9898b0";

function categoryColor(category: string): string {
  return colorSchemes[category]?.secondary ?? FALLBACK_TRAIN_COLOR;
}

function avatarImageId(steamId: string): string {
  return `${AVATAR_IMAGE_PREFIX}${steamId}`;
}

function buildTrainsFC(
  trains: TrainDTO[],
  avatars: Record<string, string>,
  loadedAvatarIds: Set<string>,
  headings: Record<string, number | null>
): FeatureCollection<Point> {
  const features: Feature<Point>[] = trains
    .filter((t) => Number.isFinite(t.lat) && Number.isFinite(t.lon))
    .map((t) => {
      const sid = t.driverSteamId;
      const hasAvatar =
        sid != null && avatars[sid] && loadedAvatarIds.has(sid);
      const iconImage = hasAvatar
        ? avatarImageId(sid)
        : BOT_AVATAR_IMAGE_ID;
      const heading = headings[t.id];
      const props: Record<string, unknown> = {
        trainNo: t.trainNo,
        trainName: t.trainName,
        label: `${t.trainName} ${t.trainNo}`,
        category: t.category,
        color: categoryColor(t.category),
        type: t.type,
        velocity: t.velocity,
        iconImage,
      };
      if (heading != null) props.heading = heading;
      return {
        type: "Feature",
        id: t.id,
        geometry: { type: "Point", coordinates: [t.lon, t.lat] },
        properties: props,
      };
    });
  return { type: "FeatureCollection", features };
}

function buildStationsFC(stations: StationDTO[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = stations
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon))
    .map((s) => ({
      type: "Feature",
      id: s.id,
      geometry: { type: "Point", coordinates: [s.lon, s.lat] },
      properties: {
        code: s.code,
        prefix: s.prefix,
        name: s.name,
        manned: s.dispatchers.length > 0,
        difficulty: s.difficulty,
      },
    }));
  return { type: "FeatureCollection", features };
}

export interface LiveMapHandle {
  flyTo: (lon: number, lat: number, zoom?: number) => void;
}

interface LiveMapProps {
  trains: TrainDTO[];
  stations: StationDTO[];
  onSelectTrain: (trainNo: string) => void;
  onSelectStation: (stationCode: string) => void;
}

const INTERACTIVE_LAYERS = [
  TRAINS_HALO_LAYER_ID,
  TRAINS_AVATAR_LAYER_ID,
  TRAINS_LABEL_LAYER_ID,
  STATIONS_HALO_LAYER_ID,
  STATIONS_DOT_LAYER_ID,
  STATIONS_LABEL_LAYER_ID,
];

const LiveMap = forwardRef<LiveMapHandle, LiveMapProps>(function LiveMap(
  { trains, stations, onSelectTrain, onSelectStation },
  ref
) {
  const mapRef = useRef<MapRef | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const driverIds = useMemo(
    () => trains.map((t) => t.driverSteamId).filter((s): s is string => !!s),
    [trains]
  );
  const avatars = useSteamAvatars(driverIds);
  const headings = useTrainHeadings(trains);

  const [loadedAvatarIds, setLoadedAvatarIds] = useState<Set<string>>(
    () => new Set()
  );
  const [mapReady, setMapReady] = useState(false);
  const inFlightRef = useRef<Set<string>>(new Set());

  const handleMapLoad = useCallback(() => {
    setMapReady(true);
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (!map.hasImage(BOT_AVATAR_IMAGE_ID)) {
      makeBotAvatarImage("/bot-avatar.svg")
        .then((img) => {
          if (!map.hasImage(BOT_AVATAR_IMAGE_ID)) {
            map.addImage(BOT_AVATAR_IMAGE_ID, img, { pixelRatio: 2 });
          }
        })
        .catch(() => {});
    }
    if (!map.hasImage(ARROW_IMAGE_ID)) {
      loadArrowImage("/arrow.svg")
        .then((img) => {
          if (!map.hasImage(ARROW_IMAGE_ID)) {
            map.addImage(ARROW_IMAGE_ID, img, { pixelRatio: 2 });
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    for (const [steamId, url] of Object.entries(avatars)) {
      if (!url) continue;
      const id = avatarImageId(steamId);
      if (map.hasImage(id) || inFlightRef.current.has(steamId)) continue;
      inFlightRef.current.add(steamId);
      makeRoundAvatarImage(url)
        .then((img) => {
          if (!map.hasImage(id)) {
            map.addImage(id, img, { pixelRatio: 2 });
          }
          setLoadedAvatarIds((prev) => {
            if (prev.has(steamId)) return prev;
            const next = new Set(prev);
            next.add(steamId);
            return next;
          });
        })
        .catch(() => {})
        .finally(() => {
          inFlightRef.current.delete(steamId);
        });
    }
  }, [avatars, mapReady]);

  useImperativeHandle(
    ref,
    () => ({
      flyTo(lon, lat, zoom) {
        const map = mapRef.current;
        if (!map) return;
        map.flyTo({
          center: [lon, lat],
          zoom: zoom ?? Math.max(map.getZoom(), 11),
          speed: 1.4,
          essential: true,
        });
      },
    }),
    []
  );

  const trainsFC = useMemo(
    () => buildTrainsFC(trains, avatars, loadedAvatarIds, headings),
    [trains, avatars, loadedAvatarIds, headings]
  );
  const stationsFC = useMemo(() => buildStationsFC(stations), [stations]);

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const layerId = feature.layer?.id;
      const props = feature.properties ?? {};
      if (
        layerId === TRAINS_HALO_LAYER_ID ||
        layerId === TRAINS_AVATAR_LAYER_ID ||
        layerId === TRAINS_LABEL_LAYER_ID
      ) {
        if (typeof props.trainNo === "string") onSelectTrain(props.trainNo);
        return;
      }
      if (
        layerId === STATIONS_HALO_LAYER_ID ||
        layerId === STATIONS_DOT_LAYER_ID ||
        layerId === STATIONS_LABEL_LAYER_ID
      ) {
        if (typeof props.code === "string") onSelectStation(props.code);
      }
    },
    [onSelectStation, onSelectTrain]
  );

  const handleMouseEnter = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "pointer";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "";
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: POLAND_CENTER[0],
        latitude: POLAND_CENTER[1],
        zoom: DEFAULT_ZOOM,
      }}
      mapStyle={isDark ? DARK_STYLE_URL : LIGHT_STYLE_URL}
      attributionControl={false}
      style={{ position: "absolute", inset: 0 }}
      interactiveLayerIds={INTERACTIVE_LAYERS}
      onLoad={handleMapLoad}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Source id={STATIONS_SOURCE_ID} type="geojson" data={stationsFC}>
        <Layer {...stationsHaloLayer} />
        <Layer {...stationsDotLayer} />
        <Layer {...stationsLabelLayer} />
      </Source>
      <Source id={TRAINS_SOURCE_ID} type="geojson" data={trainsFC}>
        <Layer {...trainsArrowLayer} />
        <Layer {...trainsHaloLayer} />
        <Layer {...trainsAvatarLayer} />
        <Layer {...trainsLabelLayer} />
      </Source>
    </Map>
  );
});

export default LiveMap;
