"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { ExploreMapViewport } from "@/lib/explore-map";

type MapViewportControllerProps = {
  viewport: ExploreMapViewport | null;
};

export function MapViewportController({ viewport }: MapViewportControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !viewport) {
      return;
    }

    if (viewport.bounds) {
      map.fitBounds(viewport.bounds);
      return;
    }

    if (viewport.center) {
      map.setCenter(viewport.center);
      map.setZoom(viewport.zoom ?? 14);
    }
  }, [map, viewport]);

  return null;
}
