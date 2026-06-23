"use client";

import Image from "next/image";
import type { ExploreChef } from "@/lib/explore-chefs";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAP_IMAGE =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&h=1200&fit=crop&auto=format";

type StaticExploreMapProps = {
  chefs: ExploreChef[];
  hoveredChefId: string | null;
  onHover: (chefId: string | null) => void;
};

export function StaticExploreMap({
  chefs,
  hoveredChefId,
  onHover,
}: StaticExploreMapProps) {
  return (
    <>
      <Image
        src={MAP_IMAGE}
        alt="Aerial map of Los Angeles"
        fill
        className="object-cover opacity-90 saturate-[0.85]"
        sizes="60vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

      {chefs.map((chef) => {
        const isActive = hoveredChefId === chef.id;

        return (
          <button
            key={chef.id}
            type="button"
            className={cn(
              "absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive ? "z-20 scale-110" : "hover:z-20 hover:scale-105"
            )}
            style={{
              left: `${chef.mapPosition.x}%`,
              top: `${chef.mapPosition.y}%`,
            }}
            onMouseEnter={() => onHover(chef.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(chef.id)}
            onBlur={() => onHover(null)}
            aria-label={`${chef.name}, ${formatCurrency(chef.pricePerPerson)} per person`}
          >
            <span
              className={cn(
                "relative flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums shadow-md ring-2 transition-colors",
                isActive
                  ? "bg-foreground text-primary-foreground ring-foreground"
                  : "bg-white text-foreground ring-white/80 hover:ring-accent/60"
              )}
            >
              {formatCurrency(chef.pricePerPerson)}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45",
                  isActive ? "bg-foreground" : "bg-white"
                )}
              />
            </span>
          </button>
        );
      })}
    </>
  );
}
