import type { ServiceType } from "@prisma/client";
import type {
  ChefProfile,
  DashboardEvent,
  EventWithRelations,
  IntakeFormPayload,
  ProposalFormPayload,
} from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? "Something went wrong",
      response.status
    );
  }

  return data as T;
}

export async function submitIntake(payload: IntakeFormPayload) {
  const response = await fetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<{ eventId: string; clientId: string }>(response);
}

export async function createProposal(payload: ProposalFormPayload) {
  const response = await fetch("/api/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<{ proposalId: string; eventId: string }>(response);
}

export async function selectProposalTier(proposalId: string, tierId: string) {
  const response = await fetch(`/api/proposals/${proposalId}/select-tier`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tierId }),
  });

  return handleResponse<{
    proposalId: string;
    tierId: string;
    totalCost: number;
    eventId: string;
  }>(response);
}

export async function fetchEvent(eventId: string) {
  const response = await fetch(`/api/events/${eventId}`);
  return handleResponse<EventWithRelations>(response);
}

export async function fetchChefEvents(
  chefId: string,
  serviceType?: ServiceType
) {
  const params = new URLSearchParams({ chefId });
  if (serviceType) params.set("serviceType", serviceType);

  const response = await fetch(`/api/events?${params}`);
  return handleResponse<{
    events: DashboardEvent[];
    totalEarnings: number;
  }>(response);
}

export async function fetchChef(chefId: string) {
  const response = await fetch(`/api/chef/${chefId}`);
  return handleResponse<ChefProfile>(response);
}

export async function updateChefServices(
  chefId: string,
  activeServices: ServiceType[]
) {
  const response = await fetch(`/api/chef/${chefId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activeServices }),
  });

  return handleResponse<ChefProfile>(response);
}

export async function markEventPaid(eventId: string) {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "PAID" }),
  });

  return handleResponse<EventWithRelations>(response);
}
