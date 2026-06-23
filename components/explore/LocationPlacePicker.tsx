"use client";

import type { CSSProperties } from "react";
import { PlacePicker } from "@googlemaps/extended-component-library/react";
import { useApiIsLoaded } from "@vis.gl/react-google-maps";
import type { ExploreMapViewport } from "@/lib/explore-map";
import { LA_MAP_CENTER } from "@/lib/explore-map";

type LocationPlacePickerProps = {
  onLocationChange: (location: string) => void;
  onPlaceSelect: (viewport: ExploreMapViewport | null) => void;
};

type PlacePickerElement = HTMLElement & {
  value?: google.maps.places.Place | null | undefined;
};

function toLatLngLiteral(
  location: google.maps.LatLng | google.maps.LatLngLiteral
): { lat: number; lng: number } {
  if (typeof (location as google.maps.LatLng).lat === "function") {
    const latLng = location as google.maps.LatLng;
    return { lat: latLng.lat(), lng: latLng.lng() };
  }

  return location as google.maps.LatLngLiteral;
}

function toBoundsLiteral(
  bounds: google.maps.LatLngBounds
): google.maps.LatLngBoundsLiteral {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng(),
  };
}

function placeLabel(place: google.maps.places.Place): string {
  if (place.formattedAddress) {
    return place.formattedAddress;
  }

  const name = place.displayName;
  if (typeof name === "string") {
    return name;
  }

  return name ?? "";
}

const pickerStyle = {
  "--gmpx-color-surface": "transparent",
  "--gmpx-color-on-surface": "#1a1a1a",
  "--gmpx-color-on-surface-variant": "#8c8c84",
  "--gmpx-color-primary": "#6b7a4a",
  "--gmpx-font-family-base": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  "--gmpx-font-size-base": "14px",
} as CSSProperties;

export function LocationPlacePicker({
  onLocationChange,
  onPlaceSelect,
}: LocationPlacePickerProps) {
  const apiLoaded = useApiIsLoaded();

  if (!apiLoaded) {
    return (
      <input
        type="text"
        placeholder="Location or address"
        className="w-full bg-transparent py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        onChange={(e) => onLocationChange(e.target.value)}
      />
    );
  }

  return (
    <div
      className="min-h-[46px] w-full py-1 [&_gmpx-place-picker]:block [&_gmpx-place-picker]:w-full"
      style={pickerStyle}
    >
      <PlacePicker
        placeholder="Location or address"
        country={["us"]}
        locationBias={LA_MAP_CENTER}
        radius={50000}
        onPlaceChange={(event) => {
          const picker = event.target as PlacePickerElement;
          const place = picker.value;

          if (!place) {
            onLocationChange("");
            onPlaceSelect(null);
            return;
          }

          const label = placeLabel(place);

          if (label) {
            onLocationChange(label);
          }

          if (place.location) {
            onPlaceSelect({
              center: toLatLngLiteral(place.location),
              zoom: place.viewport ? undefined : 14,
              bounds: place.viewport
                ? toBoundsLiteral(place.viewport)
                : undefined,
            });
          }
        }}
        onRequestError={(event) => {
          console.error("Place picker error:", event);
        }}
      />
    </div>
  );
}
