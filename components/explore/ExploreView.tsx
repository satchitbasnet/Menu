"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ChefProfile } from "@/lib/types";
import {
  DEFAULT_FILTERS,
  filterExploreChefs,
  mergeExploreChefs,
  type ExploreChef,
  type ExploreFilters,
} from "@/lib/explore-chefs";
import {
  getGoogleMapsConfig,
  googleMapsSetupMessage,
  GOOGLE_MAPS_RUNTIME_FAILURE_MESSAGE,
} from "@/lib/google-maps-config";
import { ChefBrowseCard } from "@/components/explore/ChefBrowseCard";
import { ExploreSearchBar } from "@/components/explore/ExploreSearchBar";
import {
  GoogleMapsProvider,
  GoogleMapsErrorDetector,
  useGoogleMapsRuntimeFailure,
} from "@/components/explore/GoogleMapsProvider";
import type { ExploreMapViewport } from "@/lib/explore-map";

const GOOGLE_MAPS_CONFIG = getGoogleMapsConfig();

const ExploreMapPanel = dynamic(
  () =>
    import("@/components/explore/ExploreMapPanel").then(
      (mod) => mod.ExploreMapPanel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-secondary/60" />
    ),
  }
);

function ExploreContent({
  mapsEnabled,
  setupMessage,
}: {
  mapsEnabled: boolean;
  setupMessage: string | null;
}) {
  const [chefs, setChefs] = useState<ExploreChef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);
  const [hoveredChefId, setHoveredChefId] = useState<string | null>(null);
  const [mapViewport, setMapViewport] = useState<ExploreMapViewport | null>(
    null
  );

  useEffect(() => {
    fetch("/api/chefs")
      .then((r) => r.json())
      .then((data: { chefs?: ChefProfile[] }) =>
        setChefs(mergeExploreChefs(data.chefs ?? []))
      )
      .catch(() => setChefs(mergeExploreChefs([])))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterExploreChefs(chefs, filters),
    [chefs, filters]
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
      <aside className="flex w-full max-w-[580px] shrink-0 flex-col border-r border-border bg-background lg:w-[580px]">
        <ExploreSearchBar
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          mapsEnabled={mapsEnabled}
          onPlaceSelect={setMapViewport}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-16 text-center text-sm text-muted-foreground">
              No chefs match your search. Try adjusting your filters.
            </p>
          ) : (
            filtered.map((chef) => (
              <ChefBrowseCard
                key={chef.id}
                chef={chef}
                isHighlighted={hoveredChefId === chef.id}
                onHover={setHoveredChefId}
              />
            ))
          )}
        </div>
      </aside>

      <section className="hidden min-w-0 flex-1 lg:block">
        <ExploreMapPanel
          chefs={filtered}
          hoveredChefId={hoveredChefId}
          onHover={setHoveredChefId}
          mapViewport={mapViewport}
          mapsEnabled={mapsEnabled}
          setupMessage={setupMessage}
        />
      </section>
    </div>
  );
}

export function ExploreView() {
  const { failed, markFailed } = useGoogleMapsRuntimeFailure();
  const mapsEnabled = GOOGLE_MAPS_CONFIG.enabled && !failed;
  const setupMessage = GOOGLE_MAPS_CONFIG.enabled
    ? failed
      ? GOOGLE_MAPS_RUNTIME_FAILURE_MESSAGE
      : null
    : googleMapsSetupMessage(GOOGLE_MAPS_CONFIG.issue);

  const content = (
    <ExploreContent mapsEnabled={mapsEnabled} setupMessage={setupMessage} />
  );

  if (GOOGLE_MAPS_CONFIG.enabled && !failed) {
    return (
      <GoogleMapsProvider config={GOOGLE_MAPS_CONFIG} onAuthFailure={markFailed}>
        <GoogleMapsErrorDetector onError={markFailed} />
        {content}
      </GoogleMapsProvider>
    );
  }

  return content;
}
