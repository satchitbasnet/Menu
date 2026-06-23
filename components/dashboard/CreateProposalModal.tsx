"use client";

import { useState } from "react";
import { createProposal } from "@/lib/api";
import type { DashboardEvent, MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type CreateProposalModalProps = {
  events: DashboardEvent[];
  onClose: () => void;
  onSuccess: () => void;
};

const DEFAULT_TIERS = [
  { name: "Classic", price: "145" },
  { name: "Signature", price: "185" },
  { name: "Executive", price: "265" },
];

const DEFAULT_MENU: MenuItem[] = [
  { course: "Amuse-Bouche", name: "Seasonal bite", description: "Chef's selection" },
  { course: "First Course", name: "Garden course", description: "Fresh, local produce" },
  { course: "Main", name: "Protein of choice", description: "With seasonal accompaniments" },
  { course: "Dessert", name: "Sweet finish", description: "House-made" },
];

export function CreateProposalModal({
  events,
  onClose,
  onSuccess,
}: CreateProposalModalProps) {
  const eligible = events.filter((e) => e.status === "PENDING_PROPOSAL");

  const [eventId, setEventId] = useState(eligible[0]?.id ?? "");
  const [chefNotes, setChefNotes] = useState("");
  const [tierPrices, setTierPrices] = useState(
    DEFAULT_TIERS.map((t) => t.price)
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createProposal({
        eventId,
        chefNotes,
        tiers: DEFAULT_TIERS.map((tier, i) => ({
          name: tier.name,
          description: `The ${tier.name} experience — curated for your occasion.`,
          pricePerPerson: parseFloat(tierPrices[i]),
          menuItems: DEFAULT_MENU,
          imageUrl:
            i === 0
              ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
              : i === 1
                ? "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                : "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        })),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create proposal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-background p-8 shadow-soft-lg border border-border lg:p-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              New Proposal
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium text-foreground">
              Tiered Menu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-faint transition-colors hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {eligible.length === 0 ? (
          <p className="text-muted-foreground">
            No bookings awaiting proposals. Share your intake link with clients.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Booking
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full border-0 border-b border-border bg-transparent py-3 text-foreground focus:border-foreground focus:outline-none"
                required
              >
                {eligible.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.clientName} —{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Chef's Notes"
              value={chefNotes}
              onChange={(e) => setChefNotes(e.target.value)}
              placeholder="A personal message to your client..."
              rows={4}
              required
            />

            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Tier Pricing (per person)
              </p>
              {DEFAULT_TIERS.map((tier, i) => (
                <Input
                  key={tier.name}
                  label={tier.name}
                  type="number"
                  min="1"
                  step="1"
                  value={tierPrices[i]}
                  onChange={(e) => {
                    const next = [...tierPrices];
                    next[i] = e.target.value;
                    setTierPrices(next);
                  }}
                  required
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Send Proposal
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
