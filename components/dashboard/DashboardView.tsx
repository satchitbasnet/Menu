"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServiceType } from "@prisma/client";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { EarningsCard } from "@/components/dashboard/EarningsCard";
import { CreateProposalModal } from "@/components/dashboard/CreateProposalModal";
import { ServiceToggle } from "@/components/dashboard/ServiceToggle";
import { Button } from "@/components/ui/Button";
import {
  fetchChef,
  fetchChefEvents,
  updateChefServices,
} from "@/lib/api";
import {
  mockDashboardEvents,
  mockTotalEarnings,
  MOCK_CHEF_ID,
} from "@/lib/mock-data";
import { SERVICE_LABELS } from "@/lib/types";
import type { ChefProfile, DashboardEvent } from "@/lib/types";

export function DashboardView() {
  const [chef, setChef] = useState<ChefProfile | null>(null);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [filter, setFilter] = useState<ServiceType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [chefId, setChefId] = useState(MOCK_CHEF_ID);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const meRes = await fetch("/api/me");
      const me = await meRes.json();
      const resolvedChefId = me.chefId ?? MOCK_CHEF_ID;
      setChefId(resolvedChefId);

      const [chefData, eventsData] = await Promise.all([
        fetchChef(resolvedChefId),
        fetchChefEvents(
          resolvedChefId,
          filter === "ALL" ? undefined : filter
        ),
      ]);
      setChef(chefData);
      setEvents(eventsData.events);
      setTotalEarnings(eventsData.totalEarnings);
      setUseMock(false);
    } catch {
      setChef({
        id: MOCK_CHEF_ID,
        name: "Chef Elena Martinez",
        bio: null,
        email: "chef@menutotable.com",
        profileImage: null,
        activeServices: ["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"],
      });
      setEvents(
        filter === "ALL"
          ? mockDashboardEvents
          : mockDashboardEvents.filter((e) => e.serviceType === filter)
      );
      setTotalEarnings(mockTotalEarnings);
      setUseMock(true);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleServiceToggle(services: ServiceType[]) {
    if (!chef || useMock) {
      setChef((c) => (c ? { ...c, activeServices: services } : c));
      return;
    }
    setIsSavingServices(true);
    try {
      const updated = await updateChefServices(chef.id, services);
      setChef(updated);
    } catch {
      /* keep previous state */
    } finally {
      setIsSavingServices(false);
    }
  }

  const upcoming = events.filter(
    (e) => new Date(e.eventDate) >= new Date() || e.status !== "PAID"
  );

  const filters: (ServiceType | "ALL")[] = [
    "ALL",
    "PRIVATE_DINNER",
    "MEAL_PREP",
    "COOKING_CLASS",
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Chef CRM
          </p>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
            Good morning, {chef?.name?.replace("Chef ", "") ?? "Chef"}.
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Manage your offerings, review bookings, and craft tiered menu proposals.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} size="lg">
          Create Proposal
        </Button>
      </header>

      {useMock && (
        <p className="text-sm text-muted-foreground">
          Showing demo data — connect your database and run{" "}
          <code className="rounded-sm bg-secondary px-1">npm run db:seed</code> for live data.
        </p>
      )}

      {chef && (
        <ServiceToggle
          activeServices={chef.activeServices}
          onToggle={handleServiceToggle}
          isSaving={isSavingServices}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-3">
            <EarningsCard
              totalEarnings={totalEarnings}
              upcomingCount={upcoming.length}
            />
            <div className="space-y-4 rounded-sm border border-border bg-card p-6 lg:col-span-2 lg:p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Client Intake Link
              </p>
              <p className="break-all font-mono text-sm text-foreground">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/intake/${chefId}`
                  : `/intake/${chefId}`}
              </p>
            </div>
          </div>

          <section className="space-y-8">
            <div className="flex flex-wrap gap-3">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-sm px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                    filter === f
                      ? "bg-foreground text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "ALL" ? "All Services" : SERVICE_LABELS[f]}
                </button>
              ))}
            </div>

            <h2 className="font-serif text-xl font-normal text-foreground md:text-2xl">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.length === 0 ? (
                <p className="col-span-full py-12 text-center text-muted-foreground">
                  No bookings for this service yet.
                </p>
              ) : (
                upcoming.map((event) => (
                  <BookingCard key={event.id} event={event} />
                ))
              )}
            </div>
          </section>
        </>
      )}

      {showModal && (
        <CreateProposalModal
          events={events}
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
