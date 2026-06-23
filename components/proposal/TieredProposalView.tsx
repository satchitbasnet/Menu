"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  fetchEvent,
  markEventPaid,
  selectProposalTier,
} from "@/lib/api";
import { formatCurrency, formatDate, serviceLabel } from "@/lib/format";
import { mockEvent } from "@/lib/mock-data";
import type { EventWithRelations, ProposalTierData } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type TieredProposalViewProps = {
  eventId: string;
};

type PaymentState = "idle" | "processing" | "success";

export function TieredProposalView({ eventId }: TieredProposalViewProps) {
  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const loadEvent = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchEvent(eventId);
      setEvent(data);
      setUseMock(false);
      const proposal = data.menuProposals[0];
      const preselected = proposal?.tiers.find((t) => t.isSelected);
      if (preselected) setSelectedTierId(preselected.id);
    } catch {
      if (eventId.startsWith("seed-") || eventId.startsWith("demo-")) {
        setEvent({ ...mockEvent, id: eventId });
        setUseMock(true);
      } else {
        setError("Event not found");
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const proposal = event?.menuProposals[0];
  const tiers = proposal?.tiers ?? [];
  const selectedTier: ProposalTierData | undefined = tiers.find(
    (t) => t.id === selectedTierId
  );
  const depositAmount = selectedTier
    ? Math.round(selectedTier.totalCost * 0.3)
    : 0;
  const isPaid = event?.status === "PAID";

  async function handleSelectAndPay() {
    if (!proposal || !selectedTierId) return;
    setPaymentState("processing");
    setError("");

    try {
      if (!useMock) {
        await selectProposalTier(proposal.id, selectedTierId);
        await new Promise((r) => setTimeout(r, 1500));
        await markEventPaid(eventId);
        await loadEvent();
      } else {
        await new Promise((r) => setTimeout(r, 2000));
        setEvent((prev) =>
          prev
            ? {
                ...prev,
                status: "PAID",
                menuProposals: prev.menuProposals.map((p) => ({
                  ...p,
                  tiers: p.tiers.map((t) => ({
                    ...t,
                    isSelected: t.id === selectedTierId,
                  })),
                })),
              }
            : prev
        );
      }
      setPaymentState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaymentState("idle");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      </div>
    );
  }

  if (error && !event) {
    return <p className="py-20 text-center text-red-600">{error}</p>;
  }

  if (!event) return null;

  if (!proposal || tiers.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl font-medium text-foreground">
          Proposal In Progress
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your chef is crafting a tiered menu proposal. You&apos;ll be notified
          when it&apos;s ready for review.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-36">
      <header className="space-y-6 py-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {serviceLabel(event.serviceType)}
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Your Menu Proposal
        </h1>
        <p className="text-muted-foreground">
          {event.chef.name} · {formatDate(event.eventDate)} · {event.headcount}{" "}
          guests
        </p>
      </header>

      {event.chef.profileImage && (
        <div className="mx-auto mb-12 flex max-w-2xl items-center gap-6">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={event.chef.profileImage}
              alt={event.chef.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <p className="whitespace-pre-line text-left text-sm leading-relaxed text-muted-foreground">
            {proposal.chefNotes}
          </p>
        </div>
      )}

      {!event.chef.profileImage && (
        <div className="mx-auto mb-12 max-w-2xl">
          <p className="whitespace-pre-line text-center text-sm leading-relaxed text-muted-foreground">
            {proposal.chefNotes}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {tiers.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTierId(tier.id)}
              className={`group text-left transition-all duration-300 ${
                isSelected
                  ? "shadow-soft-lg ring-1 ring-accent"
                  : "border border-border hover:shadow-soft-lg"
              }`}
            >
              {tier.imageUrl && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tier.imageUrl}
                    alt={tier.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="space-y-4 bg-white p-8">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl font-medium text-foreground">
                    {tier.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(tier.pricePerPerson)}
                    <span className="text-muted-foreground"> / person</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
                {isSelected && (
                  <div className="space-y-6 border-t border-ink/5 pt-6">
                    {tier.menuItems.map((item) => (
                      <div key={`${item.course}-${item.name}`}>
                        <p className="text-xs font-medium uppercase tracking-widest text-accent">
                          {item.course}
                        </p>
                        <p className="mt-1 font-serif text-lg text-foreground">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {paymentState === "success" || isPaid ? (
        <div className="mx-auto mt-16 max-w-lg space-y-4 py-12 text-center">
          <p className="font-serif text-3xl font-medium text-foreground">
            You&apos;re All Set
          </p>
          <p className="text-muted-foreground">
            Your deposit of {formatCurrency(depositAmount)} has been processed.
            {event.chef.name} will finalize the details with you shortly.
          </p>
        </div>
      ) : (
        <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-12">
            <div>
              {selectedTier ? (
                <>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {selectedTier.name} · {event.headcount} guests
                  </p>
                  <p className="font-serif text-2xl font-medium text-foreground">
                    {formatCurrency(selectedTier.totalCost)}
                    <span className="ml-3 text-sm font-sans text-muted-foreground">
                      Deposit: {formatCurrency(depositAmount)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Select a tier to continue</p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600 sm:order-first sm:w-full">
                {error}
              </p>
            )}
            <Button
              onClick={handleSelectAndPay}
              disabled={!selectedTierId}
              isLoading={paymentState === "processing"}
              size="lg"
            >
              {paymentState === "processing"
                ? "Processing..."
                : "Select Tier & Pay Deposit"}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
