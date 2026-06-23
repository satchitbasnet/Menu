"use client";

import type { ServiceType } from "@prisma/client";
import { SERVICE_LABELS } from "@/lib/types";

const ALL_SERVICES: ServiceType[] = [
  "PRIVATE_DINNER",
  "MEAL_PREP",
  "COOKING_CLASS",
];

type ServiceToggleProps = {
  activeServices: ServiceType[];
  onToggle: (services: ServiceType[]) => void;
  isSaving?: boolean;
};

export function ServiceToggle({
  activeServices,
  onToggle,
  isSaving,
}: ServiceToggleProps) {
  function toggleService(service: ServiceType) {
    const isActive = activeServices.includes(service);
    const next = isActive
      ? activeServices.filter((s) => s !== service)
      : [...activeServices, service];

    if (next.length > 0) onToggle(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Active Offerings
      </p>
      <div className="flex flex-wrap gap-3">
        {ALL_SERVICES.map((service) => {
          const isActive = activeServices.includes(service);
          return (
            <button
              key={service}
              type="button"
              disabled={isSaving}
              onClick={() => toggleService(service)}
                className={`rounded-sm px-5 py-3 text-xs uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
            >
              {SERVICE_LABELS[service]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
