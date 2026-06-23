"use client";

import { Map } from "@vis.gl/react-google-maps";
import type { ExploreChef } from "@/lib/explore-chefs";
import { getGoogleMapsConfig } from "@/lib/google-maps-config";
import { ChefMapMarkers } from "@/components/explore/ChefMapMarkers";
import { ExploreMapErrorBoundary } from "@/components/explore/ExploreMapErrorBoundary";
import { ExploreMapTooltip } from "@/components/explore/ExploreMapTooltip";
import { MapViewportController } from "@/components/explore/MapViewportController";
import { StaticExploreMap } from "@/components/explore/StaticExploreMap";
import {
  LA_MAP_CENTER,
  LA_MAP_DEFAULT_ZOOM,
  type ExploreMapViewport,
} from "@/lib/explore-map";

const GOOGLE_MAPS_CONFIG = getGoogleMapsConfig();

type ExploreMapPanelProps = {
  chefs: ExploreChef[];
  hoveredChefId: string | null;
  onHover: (chefId: string | null) => void;
  mapViewport?: ExploreMapViewport | null;
  mapsEnabled?: boolean;
  setupMessage?: string | null;
};

function GoogleExploreMap({
  chefs,
  hoveredChefId,
  onHover,
  mapViewport,
}: Omit<ExploreMapPanelProps, "mapsEnabled" | "setupMessage">) {
  return (
    <Map
      defaultCenter={LA_MAP_CENTER}
      defaultZoom={LA_MAP_DEFAULT_ZOOM}
      mapId={GOOGLE_MAPS_CONFIG.mapId}
      gestureHandling="greedy"
      disableDefaultUI
      clickableIcons={false}
      className="h-full w-full"
    >
      <MapViewportController viewport={mapViewport ?? null} />
      <ChefMapMarkers
        chefs={chefs}
        hoveredChefId={hoveredChefId}
        onHover={onHover}
      />
    </Map>
  );
}

export function ExploreMapPanel({
  chefs,
  hoveredChefId,
  onHover,
  mapViewport = null,
  mapsEnabled = false,
  setupMessage = null,
}: ExploreMapPanelProps) {
  const hoveredChef = chefs.find((c) => c.id === hoveredChefId) ?? null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#dce4dc]">
      {mapsEnabled ? (
        <ExploreMapErrorBoundary
          chefs={chefs}
          hoveredChefId={hoveredChefId}
          onHover={onHover}
        >
          <GoogleExploreMap
            chefs={chefs}
            hoveredChefId={hoveredChefId}
            onHover={onHover}
            mapViewport={mapViewport}
          />
        </ExploreMapErrorBoundary>
      ) : (
        <StaticExploreMap
          chefs={chefs}
          hoveredChefId={hoveredChefId}
          onHover={onHover}
        />
      )}

      {setupMessage && (
        <div className="absolute top-4 left-4 z-20 max-w-sm rounded-sm border border-border/80 bg-card/95 px-3 py-2 text-xs leading-relaxed text-muted-foreground shadow-soft backdrop-blur-sm">
          {setupMessage}
        </div>
      )}

      <ExploreMapTooltip chef={hoveredChef} />
    </div>
  );
}
