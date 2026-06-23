"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ExploreChef } from "@/lib/explore-chefs";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type ExploreMapTooltipProps = {
  chef: ExploreChef | null;
};

export function ExploreMapTooltip({ chef }: ExploreMapTooltipProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-4 bottom-4 z-30 transition-all duration-300",
        chef ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {chef && (
        <Link
          href={`/intake/${chef.id}`}
          className="pointer-events-auto flex items-center gap-4 rounded-sm border border-border/80 bg-card/95 p-3 shadow-soft-lg backdrop-blur-sm transition-shadow hover:shadow-lg"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-secondary">
            {chef.profileImage ? (
              <Image
                src={chef.profileImage}
                alt={chef.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-lg text-muted-foreground/40">
                {chef.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-base text-foreground">
              {chef.name}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Star size={11} className="fill-foreground text-foreground" />
              <span className="font-medium text-foreground">
                {chef.rating.toFixed(2)}
              </span>
              <span>({chef.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-medium tabular-nums text-foreground">
              {formatCurrency(chef.pricePerPerson)}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              per person
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
