"use client";

import dynamic from "next/dynamic";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { ServiceType } from "@prisma/client";
import { SERVICE_LABELS } from "@/lib/types";
import {
  DEFAULT_FILTERS,
  PRICE_FILTER_OPTIONS,
  type ExploreFilters,
} from "@/lib/explore-chefs";
import type { ExploreMapViewport } from "@/lib/explore-map";
import { cn } from "@/lib/utils";

const LocationPlacePicker = dynamic(
  () =>
    import("@/components/explore/LocationPlacePicker").then(
      (mod) => mod.LocationPlacePicker
    ),
  {
    ssr: false,
    loading: () => (
      <input
        type="text"
        placeholder="Location or address"
        readOnly
        className="w-full bg-transparent py-3 px-4 text-sm text-muted-foreground/70 focus:outline-none"
      />
    ),
  }
);

type ExploreSearchBarProps = {
  filters: ExploreFilters;
  onChange: (filters: ExploreFilters) => void;
  resultCount: number;
  mapsEnabled?: boolean;
  onPlaceSelect?: (viewport: ExploreMapViewport | null) => void;
};

const SERVICE_OPTIONS: { value: ExploreFilters["serviceType"]; label: string }[] =
  [
    { value: "ALL", label: "All services" },
    { value: "PRIVATE_DINNER", label: SERVICE_LABELS.PRIVATE_DINNER },
    { value: "MEAL_PREP", label: SERVICE_LABELS.MEAL_PREP },
    { value: "COOKING_CLASS", label: SERVICE_LABELS.COOKING_CLASS },
  ];

function FieldDivider() {
  return <div className="hidden w-px shrink-0 self-stretch bg-border sm:block" />;
}

function SelectChevron() {
  return (
    <ChevronDown
      size={14}
      className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
    />
  );
}

export function ExploreSearchBar({
  filters,
  onChange,
  resultCount,
  mapsEnabled = false,
  onPlaceSelect,
}: ExploreSearchBarProps) {
  function update<K extends keyof ExploreFilters>(
    key: K,
    value: ExploreFilters[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="shrink-0 border-b border-border bg-background px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-normal text-foreground">
          Browse Chefs
        </h1>
        <p className="text-xs text-muted-foreground">
          {resultCount} chef{resultCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-hidden rounded-full border border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <label className="relative min-w-0 flex-1 border-b border-border sm:border-b-0">
            <span className="sr-only">Service type</span>
            <select
              value={filters.serviceType}
              onChange={(e) =>
                update(
                  "serviceType",
                  e.target.value as ServiceType | "ALL"
                )
              }
              className="w-full appearance-none bg-transparent py-3 pr-8 pl-4 text-sm text-foreground focus:outline-none"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </label>

          <FieldDivider />

          <div className="relative min-w-0 flex-[1.2] border-b border-border sm:border-b-0">
            <span className="sr-only">Location</span>
            {mapsEnabled && onPlaceSelect ? (
              <LocationPlacePicker
                onLocationChange={(location) => update("location", location)}
                onPlaceSelect={onPlaceSelect}
              />
            ) : (
              <input
                type="text"
                value={filters.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Location or address"
                className="w-full bg-transparent py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
            )}
          </div>

          <FieldDivider />

          <label className="relative min-w-0 flex-1 border-b border-border sm:border-b-0">
            <span className="sr-only">Date</span>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
              className={cn(
                "w-full bg-transparent py-3 px-4 text-sm text-foreground focus:outline-none",
                !filters.date && "text-muted-foreground/70"
              )}
            />
          </label>

          <FieldDivider />

          <label className="relative flex min-w-0 flex-[0.7] items-center border-b border-border sm:border-b-0">
            <span className="sr-only">Guest count</span>
            <input
              type="number"
              min={1}
              max={100}
              value={filters.guestCount}
              onChange={(e) =>
                update("guestCount", Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full bg-transparent py-3 pr-4 pl-4 text-sm text-foreground focus:outline-none"
              aria-label="Guest count"
            />
            <span className="pointer-events-none absolute right-4 text-xs text-muted-foreground">
              guests
            </span>
          </label>

          <button
            type="button"
            className="flex shrink-0 items-center justify-center gap-2 bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/90 sm:rounded-r-full"
            onClick={() => onChange({ ...filters })}
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <SlidersHorizontal size={14} className="text-muted-foreground" />
        <label className="relative">
          <span className="sr-only">Price filter</span>
          <select
            value={filters.priceRange}
            onChange={(e) =>
              update(
                "priceRange",
                e.target.value as ExploreFilters["priceRange"]
              )
            }
            className="appearance-none rounded-full border border-border bg-card py-1.5 pr-8 pl-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {PRICE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
          />
        </label>
        {(filters.serviceType !== DEFAULT_FILTERS.serviceType ||
          filters.location ||
          filters.date ||
          filters.priceRange !== DEFAULT_FILTERS.priceRange) && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
