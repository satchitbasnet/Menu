import type { ServiceType } from "@prisma/client";
import type { ChefProfile } from "@/lib/types";
import { percentToCoordinates } from "@/lib/explore-map";

export type ExploreChef = ChefProfile & {
  tagline: string;
  badge?: string;
  location: string;
  rating: number;
  reviewCount: number;
  repeatClients: number;
  pricePerPerson: number;
  mapPosition: { x: number; y: number };
  coordinates: { lat: number; lng: number };
};

export type ExploreFilters = {
  serviceType: ServiceType | "ALL";
  location: string;
  date: string;
  guestCount: number;
  priceRange: "ALL" | "UNDER_75" | "75_150" | "150_250" | "OVER_250";
};

export const DEFAULT_FILTERS: ExploreFilters = {
  serviceType: "ALL",
  location: "",
  date: "",
  guestCount: 2,
  priceRange: "ALL",
};

const CHEF_OVERRIDES: Record<string, Partial<ExploreChef>> = {
  "demo-chef-1": {
    tagline: "Mediterranean farm-to-table · 15 years experience",
    badge: "Star Chef",
    location: "Silver Lake, Los Angeles",
    rating: 4.98,
    reviewCount: 127,
    repeatClients: 48,
    pricePerPerson: 145,
    mapPosition: { x: 42, y: 38 },
    coordinates: { lat: 34.0869, lng: -118.2701 },
  },
};

const EXPLORE_CATALOG: ExploreChef[] = [
  {
    id: "demo-chef-1",
    name: "Chef Elena Martinez",
    bio: "Farm-to-table private chef specializing in Mediterranean cuisine. Fifteen years crafting unforgettable experiences for intimate dinners and celebrations.",
    email: "chef@menutotable.com",
    profileImage:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&auto=format",
    activeServices: ["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"],
    tagline: "Mediterranean farm-to-table · 15 years experience",
    badge: "Star Chef",
    location: "Silver Lake, Los Angeles",
    rating: 4.98,
    reviewCount: 127,
    repeatClients: 48,
    pricePerPerson: 145,
    mapPosition: { x: 42, y: 38 },
    coordinates: { lat: 34.0869, lng: -118.2701 },
  },
  {
    id: "explore-chef-2",
    name: "Chef Marcus Chen",
    bio: "Modern Japanese and French fusion in your home. Michelin-trained with a focus on seasonal tasting menus and omakase-style private dinners.",
    email: "marcus@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=200&h=200&fit=crop&auto=format&q=80",
    activeServices: ["PRIVATE_DINNER", "COOKING_CLASS"],
    tagline: "Japanese-French fusion · Omakase at home",
    badge: "Top Rated",
    location: "Beverly Hills, Los Angeles",
    rating: 4.95,
    reviewCount: 89,
    repeatClients: 31,
    pricePerPerson: 220,
    mapPosition: { x: 28, y: 52 },
    coordinates: { lat: 34.0736, lng: -118.4004 },
  },
  {
    id: "explore-chef-3",
    name: "Chef Amara Okafor",
    bio: "West African and Caribbean flavors reimagined for the modern table. Vibrant, soulful cooking for dinner parties and weekly meal prep.",
    email: "amara@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&q=80",
    activeServices: ["PRIVATE_DINNER", "MEAL_PREP"],
    tagline: "West African & Caribbean · Soulful gatherings",
    location: "Leimert Park, Los Angeles",
    rating: 4.92,
    reviewCount: 64,
    repeatClients: 22,
    pricePerPerson: 95,
    mapPosition: { x: 55, y: 62 },
    coordinates: { lat: 34.0104, lng: -118.3318 },
  },
  {
    id: "explore-chef-4",
    name: "Chef Sofia Reyes",
    bio: "Authentic Oaxacan and regional Mexican cuisine. From mole workshops to multi-course fiestas — every dish tells a story.",
    email: "sofia@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format",
    activeServices: ["PRIVATE_DINNER", "COOKING_CLASS"],
    tagline: "Oaxacan heritage · Hands-on classes",
    badge: "Rising Star",
    location: "Highland Park, Los Angeles",
    rating: 4.89,
    reviewCount: 41,
    repeatClients: 15,
    pricePerPerson: 110,
    mapPosition: { x: 48, y: 28 },
    coordinates: { lat: 34.1156, lng: -118.1927 },
  },
  {
    id: "explore-chef-5",
    name: "Chef David Park",
    bio: "Korean BBQ and banchan meal prep specialist. Perfect for busy families who want restaurant-quality food without the wait.",
    email: "david@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=200&h=200&fit=crop&auto=format",
    activeServices: ["MEAL_PREP", "PRIVATE_DINNER"],
    tagline: "Korean BBQ · Weekly meal prep",
    location: "Koreatown, Los Angeles",
    rating: 4.94,
    reviewCount: 112,
    repeatClients: 67,
    pricePerPerson: 55,
    mapPosition: { x: 38, y: 48 },
    coordinates: { lat: 34.0578, lng: -118.3006 },
  },
  {
    id: "explore-chef-6",
    name: "Chef Isabelle Laurent",
    bio: "Classic French technique with California produce. Elegant private dinners and pastry-forward dessert courses for special occasions.",
    email: "isabelle@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
    activeServices: ["PRIVATE_DINNER"],
    tagline: "French technique · Pastry-forward menus",
    badge: "Star Chef",
    location: "Santa Monica, Los Angeles",
    rating: 4.97,
    reviewCount: 78,
    repeatClients: 29,
    pricePerPerson: 185,
    mapPosition: { x: 18, y: 58 },
    coordinates: { lat: 34.0195, lng: -118.4912 },
  },
  {
    id: "explore-chef-7",
    name: "Chef James Okonkwo",
    bio: "Plant-forward fine dining without compromise. Creative vegan and vegetarian tasting menus that impress even the most devoted carnivores.",
    email: "james@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    activeServices: ["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"],
    tagline: "Plant-forward fine dining · Zero compromise",
    location: "Venice, Los Angeles",
    rating: 4.91,
    reviewCount: 53,
    repeatClients: 19,
    pricePerPerson: 130,
    mapPosition: { x: 12, y: 72 },
    coordinates: { lat: 33.985, lng: -118.4695 },
  },
  {
    id: "explore-chef-8",
    name: "Chef Nina Patel",
    bio: "Modern Indian tasting menus and spice-forward cooking classes. From butter chicken to regional thalis — tailored to your palate.",
    email: "nina@example.com",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    activeServices: ["PRIVATE_DINNER", "COOKING_CLASS"],
    tagline: "Modern Indian · Spice-forward classes",
    location: "Pasadena, Los Angeles",
    rating: 4.88,
    reviewCount: 36,
    repeatClients: 12,
    pricePerPerson: 125,
    mapPosition: { x: 72, y: 32 },
    coordinates: { lat: 34.1478, lng: -118.1445 },
  },
];

function hashPosition(id: string): { x: number; y: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return {
    x: 15 + (Math.abs(hash) % 70),
    y: 18 + (Math.abs(hash >> 8) % 65),
  };
}

export function enrichChef(chef: ChefProfile, index: number): ExploreChef {
  const override = CHEF_OVERRIDES[chef.id];
  const catalogMatch = EXPLORE_CATALOG.find((c) => c.id === chef.id);

  if (catalogMatch) {
    return {
      ...catalogMatch,
      ...chef,
      ...override,
      activeServices: chef.activeServices,
    };
  }

  const pos = override?.mapPosition ?? hashPosition(chef.id);

  return {
    ...chef,
    tagline: override?.tagline ?? "Private chef · Custom menus",
    badge: override?.badge,
    location: override?.location ?? "Los Angeles, CA",
    rating: override?.rating ?? 4.85 + (index % 10) * 0.01,
    reviewCount: override?.reviewCount ?? 20 + index * 7,
    repeatClients: override?.repeatClients ?? 5 + index * 3,
    pricePerPerson: override?.pricePerPerson ?? 100 + index * 15,
    mapPosition: pos,
    coordinates:
      override?.coordinates ?? percentToCoordinates(pos),
    bio:
      chef.bio ??
      "Experienced private chef offering tailored dining experiences.",
  };
}

export function mergeExploreChefs(apiChefs: ChefProfile[]): ExploreChef[] {
  const byId = new Map<string, ExploreChef>();

  for (const chef of EXPLORE_CATALOG) {
    byId.set(chef.id, chef);
  }

  apiChefs.forEach((chef, index) => {
    byId.set(chef.id, enrichChef(chef, index));
  });

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function filterExploreChefs(
  chefs: ExploreChef[],
  filters: ExploreFilters
): ExploreChef[] {
  return chefs.filter((chef) => {
    if (
      filters.serviceType !== "ALL" &&
      !chef.activeServices.includes(filters.serviceType)
    ) {
      return false;
    }

    if (filters.location.trim()) {
      const q = filters.location.toLowerCase();
      if (!chef.location.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (filters.priceRange === "UNDER_75" && chef.pricePerPerson >= 75) {
      return false;
    }
    if (
      filters.priceRange === "75_150" &&
      (chef.pricePerPerson < 75 || chef.pricePerPerson > 150)
    ) {
      return false;
    }
    if (
      filters.priceRange === "150_250" &&
      (chef.pricePerPerson < 150 || chef.pricePerPerson > 250)
    ) {
      return false;
    }
    if (filters.priceRange === "OVER_250" && chef.pricePerPerson <= 250) {
      return false;
    }

    return true;
  });
}

export const PRICE_FILTER_OPTIONS = [
  { value: "ALL", label: "Any price" },
  { value: "UNDER_75", label: "Under $75" },
  { value: "75_150", label: "$75 – $150" },
  { value: "150_250", label: "$150 – $250" },
  { value: "OVER_250", label: "$250+" },
] as const;
