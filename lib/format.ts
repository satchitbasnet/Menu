import type { EventStatus, ServiceType } from "@prisma/client";
import { SERVICE_LABELS } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function serviceLabel(type: ServiceType): string {
  return SERVICE_LABELS[type];
}

export const SERVICE_STYLES: Record<
  ServiceType,
  { bg: string; text: string; label: string }
> = {
  PRIVATE_DINNER: {
    bg: "#F5F0E8",
    text: "#6B5B3E",
    label: "Private Dinner",
  },
  MEAL_PREP: { bg: "#EDF0E8", text: "#4A5C3B", label: "Meal Prep" },
  COOKING_CLASS: { bg: "#EAE8F0", text: "#3B3A6B", label: "Cooking Class" },
};

export function statusLabel(status: EventStatus): string {
  const labels: Record<EventStatus, string> = {
    PENDING_PROPOSAL: "Awaiting Proposal",
    CLIENT_REVIEW: "Client Review",
    APPROVED: "Tier Selected",
    PAID: "Deposit Paid",
  };
  return labels[status];
}

export function statusColor(status: EventStatus): string {
  const colors: Record<EventStatus, string> = {
    PENDING_PROPOSAL: "bg-secondary text-muted-foreground",
    CLIENT_REVIEW: "bg-[#F5F0E8] text-[#6B5B3E]",
    APPROVED: "bg-[#EDF4ED] text-[#3A7A47]",
    PAID: "bg-foreground text-primary-foreground",
  };
  return colors[status];
}
