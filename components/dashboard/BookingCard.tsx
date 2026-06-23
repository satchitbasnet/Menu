import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  formatCurrency,
  formatShortDate,
  SERVICE_STYLES,
  statusColor,
  statusLabel,
} from "@/lib/format";
import type { DashboardEvent } from "@/lib/types";

type BookingCardProps = {
  event: DashboardEvent;
};

export function BookingCard({ event }: BookingCardProps) {
  const svc = SERVICE_STYLES[event.serviceType];
  const eventDate = new Date(event.eventDate);

  return (
    <article className="group cursor-pointer rounded-sm border border-border bg-card p-5 transition-shadow hover:shadow-soft">
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-[40px] text-center">
          <p className="text-xs uppercase leading-none tracking-wider text-muted-foreground">
            {eventDate.toLocaleDateString("en-US", { weekday: "short" })}
          </p>
          <p className="mt-0.5 font-serif text-3xl leading-tight text-foreground">
            {eventDate.getDate()}
          </p>
          <p className="text-xs text-muted-foreground">
            {eventDate.toLocaleDateString("en-US", { month: "short" })}
          </p>
        </div>
        <Badge
          style={{ backgroundColor: svc.bg, color: svc.text }}
        >
          {svc.label}
        </Badge>
      </div>

      <div className="border-t border-border pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="text-sm text-foreground">{event.clientName}</h3>
          <Badge className={statusColor(event.status)}>
            {statusLabel(event.status)}
          </Badge>
        </div>
        {event.selectedTierName && (
          <p className="text-xs text-muted-foreground">
            {event.selectedTierName} ·{" "}
            {event.selectedTierTotal != null &&
              formatCurrency(event.selectedTierTotal)}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users size={11} />
              {event.headcount} guests
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              {formatShortDate(event.eventDate)}
            </span>
          </div>
          {event.status === "CLIENT_REVIEW" && (
            <Link
              href={`/proposal/${event.id}`}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
