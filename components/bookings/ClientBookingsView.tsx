"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatShortDate,
  serviceLabel,
  statusColor,
  statusLabel,
} from "@/lib/format";
import type { DashboardEvent } from "@/lib/types";

export function ClientBookingsView() {
  const [bookings, setBookings] = useState<DashboardEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings ?? []))
      .catch(() => setBookings([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Your Account
        </p>
        <h1 className="font-serif text-4xl font-medium text-foreground">My Bookings</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="space-y-6 py-16 text-center">
          <p className="text-muted-foreground">You don&apos;t have any bookings yet.</p>
          <Link
            href="/explore"
            className="text-xs font-medium uppercase tracking-widest text-foreground hover:text-muted-foreground"
          >
            Find a Chef →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="flex flex-col gap-4 rounded-sm border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {serviceLabel(booking.serviceType)}
                </p>
                <p className="font-serif text-xl text-foreground">
                  {formatShortDate(booking.eventDate)} · {booking.headcount}{" "}
                  guests
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-widest ${statusColor(booking.status)}`}
                >
                  {statusLabel(booking.status)}
                </span>
              </div>
              {booking.status === "CLIENT_REVIEW" && (
                <Link
                  href={`/proposal/${booking.id}`}
                  className="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Review Proposal →
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
