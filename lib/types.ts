import type { EventStatus, ProposalStatus, ServiceType } from "@prisma/client";

export type MenuItem = {
  course: string;
  name: string;
  description?: string;
};

export type PrivateDinnerIntake = {
  allergies?: string;
  dietaryPreferences?: string;
  kitchenEquipment?: string;
  occasion?: string;
};

export type MealPrepIntake = {
  deliveryDays?: string[];
  containerPreference?: string;
  fridgeSpace?: string;
  servingsPerWeek?: number;
  dietaryRestrictions?: string;
};

export type CookingClassIntake = {
  skillLevel?: string;
  cuisineInterest?: string;
  equipmentAvailable?: string;
  groupType?: string;
};

export type IntakeData =
  | PrivateDinnerIntake
  | MealPrepIntake
  | CookingClassIntake;

export type ProposalTierData = {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  totalCost: number;
  menuItems: MenuItem[];
  imageUrl: string | null;
  isSelected: boolean;
};

export type MenuProposalData = {
  id: string;
  chefNotes: string;
  status: ProposalStatus;
  createdAt: string;
  tiers: ProposalTierData[];
};

export type EventWithRelations = {
  id: string;
  chefId: string;
  clientId: string;
  eventDate: string;
  headcount: number;
  serviceType: ServiceType;
  status: EventStatus;
  intakeData: IntakeData;
  createdAt: string;
  chef: {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    profileImage: string | null;
  };
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  menuProposals: MenuProposalData[];
};

export type DashboardEvent = {
  id: string;
  eventDate: string;
  headcount: number;
  serviceType: ServiceType;
  status: EventStatus;
  clientName: string;
  proposalStatus: ProposalStatus | null;
  selectedTierName: string | null;
  selectedTierTotal: number | null;
};

export type ChefProfile = {
  id: string;
  name: string;
  bio: string | null;
  email: string;
  profileImage: string | null;
  activeServices: ServiceType[];
};

export type IntakeFormPayload = {
  chefId: string;
  serviceType: ServiceType;
  name: string;
  email: string;
  phone?: string;
  eventDate: string;
  headcount: number;
  intakeData: IntakeData;
};

export type ProposalFormPayload = {
  eventId: string;
  chefNotes: string;
  tiers: {
    name: string;
    description: string;
    pricePerPerson: number;
    menuItems: MenuItem[];
    imageUrl?: string;
  }[];
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  PRIVATE_DINNER: "Private Dinner",
  MEAL_PREP: "Weekly Meal Prep",
  COOKING_CLASS: "Cooking Class",
};

export const SERVICE_DESCRIPTIONS: Record<ServiceType, string> = {
  PRIVATE_DINNER:
    "An intimate, multi-course dining experience crafted in your home.",
  MEAL_PREP:
    "Chef-prepared meals delivered weekly, tailored to your routine.",
  COOKING_CLASS:
    "Hands-on culinary instruction for you and your guests.",
};
