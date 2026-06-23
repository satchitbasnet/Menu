"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { ExploreChef } from "@/lib/explore-chefs";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type ChefMapMarkersProps = {
  chefs: ExploreChef[];
  hoveredChefId: string | null;
  onHover: (chefId: string | null) => void;
};

type ChefPricePinProps = {
  chef: ExploreChef;
  isActive: boolean;
  onHover: (chefId: string | null) => void;
};

function ChefPricePin({ chef, isActive, onHover }: ChefPricePinProps) {
  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col items-center border-none bg-transparent p-0 transition-transform duration-200"
      onMouseEnter={() => onHover(chef.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(chef.id)}
      onBlur={() => onHover(null)}
      aria-label={`${chef.name}, ${formatCurrency(chef.pricePerPerson)} per person`}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums shadow-md ring-2 transition-colors",
          isActive
            ? "bg-foreground text-primary-foreground ring-foreground"
            : "bg-white text-foreground ring-white/80"
        )}
      >
        {formatCurrency(chef.pricePerPerson)}
      </span>
      <span
        className={cn(
          "-mt-1.5 h-2.5 w-2.5 rotate-45",
          isActive ? "bg-foreground" : "bg-white"
        )}
      />
    </button>
  );
}

export function ChefMapMarkers({
  chefs,
  hoveredChefId,
  onHover,
}: ChefMapMarkersProps) {
  return (
    <>
      {chefs.map((chef) => {
        if (!chef.coordinates) {
          return null;
        }

        const isActive = hoveredChefId === chef.id;

        return (
          <AdvancedMarker
            key={chef.id}
            position={chef.coordinates}
            zIndex={isActive ? 1000 : 1}
            anchorTop="100%"
            anchorLeft="50%"
            onMouseEnter={() => onHover(chef.id)}
            onMouseLeave={() => onHover(null)}
          >
            <ChefPricePin chef={chef} isActive={isActive} onHover={onHover} />
          </AdvancedMarker>
        );
      })}
    </>
  );
}
