import type { DashboardEvent, EventWithRelations } from "./types";

export const MOCK_CHEF_ID = "demo-chef-1";

export const mockDashboardEvents: DashboardEvent[] = [
  {
    id: "seed-event-1",
    eventDate: "2026-07-15T18:00:00Z",
    headcount: 12,
    serviceType: "PRIVATE_DINNER",
    status: "CLIENT_REVIEW",
    clientName: "Sarah & James Chen",
    proposalStatus: "SENT",
    selectedTierName: null,
    selectedTierTotal: null,
  },
  {
    id: "seed-event-2",
    eventDate: "2026-08-02T12:00:00Z",
    headcount: 4,
    serviceType: "MEAL_PREP",
    status: "APPROVED",
    clientName: "Michael Torres",
    proposalStatus: "TIER_SELECTED",
    selectedTierName: "Signature",
    selectedTierTotal: 720,
  },
  {
    id: "seed-event-3",
    eventDate: "2026-09-10T17:00:00Z",
    headcount: 8,
    serviceType: "COOKING_CLASS",
    status: "PENDING_PROPOSAL",
    clientName: "Apex Labs Team",
    proposalStatus: null,
    selectedTierName: null,
    selectedTierTotal: null,
  },
];

export const mockTotalEarnings = 720;

const classicMenuItems = [
  { course: "Amuse-Bouche", name: "Heirloom Tomato Crostini", description: "Basil oil, flaky sea salt" },
  { course: "First Course", name: "Garden Greens", description: "Shaved fennel, lemon vinaigrette" },
  { course: "Main", name: "Herb-Roasted Chicken", description: "Seasonal vegetables, pan jus" },
  { course: "Dessert", name: "Seasonal Fruit Tart", description: "Vanilla bean crème" },
];

const signatureMenuItems = [
  { course: "Amuse-Bouche", name: "Tuna Crudo", description: "Citrus, capers, olive oil" },
  { course: "First Course", name: "Burrata & Stone Fruit", description: "Aged balsamic, micro basil" },
  { course: "Main", name: "Pan-Seared Sea Bass", description: "Saffron risotto, fennel pollen" },
  { course: "Dessert", name: "Olive Oil Cake", description: "Macerated berries, mascarpone" },
];

const executiveMenuItems = [
  { course: "Amuse-Bouche", name: "Wagyu Tartare", description: "Quail egg, truffle, brioche" },
  { course: "First Course", name: "Lobster Bisque", description: "Cognac cream, chive oil" },
  { course: "Main", name: "Dry-Aged Ribeye", description: "Bone marrow butter, pomme purée" },
  { course: "Dessert", name: "Chocolate Soufflé", description: "Grand Marnier, gold leaf" },
];

export const mockEvent: EventWithRelations = {
  id: "seed-event-1",
  chefId: MOCK_CHEF_ID,
  clientId: "seed-client-1",
  eventDate: "2026-07-15T18:00:00Z",
  headcount: 12,
  serviceType: "PRIVATE_DINNER",
  status: "CLIENT_REVIEW",
  intakeData: {
    allergies: "shellfish, tree nuts",
    dietaryPreferences: "Pescatarian, low sodium",
    kitchenEquipment: "Gas range, double oven, outdoor grill",
    occasion: "Anniversary celebration",
  },
  createdAt: "2026-06-01T10:00:00Z",
  chef: {
    id: MOCK_CHEF_ID,
    name: "Chef Elena Martinez",
    email: "chef@menutotable.com",
    bio: "Farm-to-table private chef specializing in Mediterranean cuisine. Fifteen years crafting unforgettable experiences.",
    profileImage:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
  },
  client: {
    id: "seed-client-1",
    name: "Sarah & James Chen",
    email: "sarah@example.com",
    phone: "(555) 123-4567",
  },
  menuProposals: [
    {
      id: "seed-proposal-1",
      chefNotes:
        "Dear Sarah & James,\n\nCongratulations on your anniversary. I've designed three distinct menus inspired by the Mediterranean coast — each honoring your pescatarian preferences while avoiding shellfish and tree nuts.\n\nI look forward to creating an evening you'll remember.",
      status: "SENT",
      createdAt: "2026-06-05T10:00:00Z",
      tiers: [
        {
          id: "tier-classic",
          name: "Classic",
          description: "Elegant simplicity with seasonal ingredients and timeless technique.",
          pricePerPerson: 145,
          totalCost: 1740,
          menuItems: classicMenuItems,
          imageUrl:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
          isSelected: false,
        },
        {
          id: "tier-signature",
          name: "Signature",
          description: "My most celebrated dishes — refined flavors and artful presentation.",
          pricePerPerson: 185,
          totalCost: 2220,
          menuItems: signatureMenuItems,
          imageUrl:
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
          isSelected: false,
        },
        {
          id: "tier-executive",
          name: "Executive",
          description: "The pinnacle of private dining — rare ingredients and white-glove service.",
          pricePerPerson: 265,
          totalCost: 3180,
          menuItems: executiveMenuItems,
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
          isSelected: false,
        },
      ],
    },
  ],
};
