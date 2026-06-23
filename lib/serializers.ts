import type {
  Chef,
  Client,
  Event,
  MenuProposal,
  ProposalTier,
} from "@prisma/client";
import type {
  EventWithRelations,
  MenuItem,
  MenuProposalData,
  ProposalTierData,
  ChefProfile,
  DashboardEvent,
} from "./types";

type EventWithIncludes = Event & {
  chef: Chef;
  client: Client;
  menuProposals: (MenuProposal & { tiers: ProposalTier[] })[];
};

function decimalToNumber(value: { toNumber(): number }): number {
  return value.toNumber();
}

function parseMenuItems(value: unknown): MenuItem[] {
  if (!Array.isArray(value)) return [];
  return value as MenuItem[];
}

export function serializeTier(tier: ProposalTier): ProposalTierData {
  return {
    id: tier.id,
    name: tier.name,
    description: tier.description,
    pricePerPerson: decimalToNumber(tier.pricePerPerson),
    totalCost: decimalToNumber(tier.totalCost),
    menuItems: parseMenuItems(tier.menuItems),
    imageUrl: tier.imageUrl,
    isSelected: tier.isSelected,
  };
}

export function serializeProposal(
  proposal: MenuProposal & { tiers: ProposalTier[] }
): MenuProposalData {
  return {
    id: proposal.id,
    chefNotes: proposal.chefNotes,
    status: proposal.status,
    createdAt: proposal.createdAt.toISOString(),
    tiers: proposal.tiers.map(serializeTier),
  };
}

export function serializeEvent(event: EventWithIncludes): EventWithRelations {
  return {
    id: event.id,
    chefId: event.chefId,
    clientId: event.clientId,
    eventDate: event.eventDate.toISOString(),
    headcount: event.headcount,
    serviceType: event.serviceType,
    status: event.status,
    intakeData: (event.intakeData as Record<string, unknown>) ?? {},
    createdAt: event.createdAt.toISOString(),
    chef: {
      id: event.chef.id,
      name: event.chef.name,
      email: event.chef.email,
      bio: event.chef.bio,
      profileImage: event.chef.profileImage,
    },
    client: {
      id: event.client.id,
      name: event.client.name,
      email: event.client.email,
      phone: event.client.phone,
    },
    menuProposals: event.menuProposals.map(serializeProposal),
  };
}

export function serializeChef(chef: Chef): ChefProfile {
  return {
    id: chef.id,
    name: chef.name,
    bio: chef.bio,
    email: chef.email,
    profileImage: chef.profileImage,
    activeServices: chef.activeServices,
  };
}

export function serializeDashboardEvent(
  event: Event & {
    client: Client;
    menuProposals: (MenuProposal & { tiers: ProposalTier[] })[];
  }
): DashboardEvent {
  const proposal = event.menuProposals[0];
  const selectedTier = proposal?.tiers.find((t) => t.isSelected);

  return {
    id: event.id,
    eventDate: event.eventDate.toISOString(),
    headcount: event.headcount,
    serviceType: event.serviceType,
    status: event.status,
    clientName: event.client.name,
    proposalStatus: proposal?.status ?? null,
    selectedTierName: selectedTier?.name ?? null,
    selectedTierTotal: selectedTier
      ? decimalToNumber(selectedTier.totalCost)
      : null,
  };
}
