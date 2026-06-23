"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { ExploreChef } from "@/lib/explore-chefs";
import { formatCurrency, SERVICE_STYLES } from "@/lib/format";
import { cn } from "@/lib/utils";

type ChefBrowseCardProps = {
  chef: ExploreChef;
  isHighlighted: boolean;
  onHover: (chefId: string | null) => void;
};

export function ChefBrowseCard({
  chef,
  isHighlighted,
  onHover,
}: ChefBrowseCardProps) {
  return (
    <Link
      href={`/intake/${chef.id}`}
      className={cn(
        "group block border-b border-border px-4 py-5 transition-colors",
        isHighlighted ? "bg-secondary/80" : "hover:bg-secondary/50"
      )}
      onMouseEnter={() => onHover(chef.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(chef.id)}
      onBlur={() => onHover(null)}
    >
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-transparent transition-all group-hover:ring-accent/30">
          {chef.profileImage ? (
            <Image
              src={chef.profileImage}
              alt={chef.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-xl text-muted-foreground/40">
              {chef.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-serif text-lg font-normal leading-tight text-foreground">
                  {chef.name}
                </h2>
                {chef.badge && (
                  <span className="shrink-0 rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                    {chef.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {chef.tagline}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-lg font-medium tabular-nums text-foreground">
                {formatCurrency(chef.pricePerPerson)}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                per person
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-foreground">
              <Star size={12} className="fill-foreground text-foreground" />
              <span className="font-medium">{chef.rating.toFixed(2)}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{chef.reviewCount} reviews</span>
            <span aria-hidden="true">·</span>
            <span>{chef.repeatClients} repeat clients</span>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{chef.location}</span>
          </div>

          {chef.bio && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {chef.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {chef.activeServices.map((service) => {
              const style = SERVICE_STYLES[service];
              return (
                <span
                  key={service}
                  className="rounded-sm px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: style.bg,
                    color: style.text,
                  }}
                >
                  {style.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
