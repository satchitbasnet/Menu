import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "password123";

const classicItems = [
  { course: "Amuse-Bouche", name: "Heirloom Tomato Crostini", description: "Basil oil, flaky sea salt" },
  { course: "First Course", name: "Garden Greens", description: "Shaved fennel, lemon vinaigrette" },
  { course: "Main", name: "Herb-Roasted Chicken", description: "Seasonal vegetables, pan jus" },
  { course: "Dessert", name: "Seasonal Fruit Tart", description: "Vanilla bean crème" },
];

const signatureItems = [
  { course: "Amuse-Bouche", name: "Tuna Crudo", description: "Citrus, capers, olive oil" },
  { course: "First Course", name: "Burrata & Stone Fruit", description: "Aged balsamic, micro basil" },
  { course: "Main", name: "Pan-Seared Sea Bass", description: "Saffron risotto, fennel pollen" },
  { course: "Dessert", name: "Olive Oil Cake", description: "Macerated berries, mascarpone" },
];

const executiveItems = [
  { course: "Amuse-Bouche", name: "Wagyu Tartare", description: "Quail egg, truffle, brioche" },
  { course: "First Course", name: "Lobster Bisque", description: "Cognac cream, chive oil" },
  { course: "Main", name: "Dry-Aged Ribeye", description: "Bone marrow butter, pomme purée" },
  { course: "Dessert", name: "Chocolate Soufflé", description: "Grand Marnier, gold leaf" },
];

async function main() {
  await prisma.proposalTier.deleteMany();
  await prisma.menuProposal.deleteMany();
  await prisma.event.deleteMany();
  await prisma.client.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const chefUser = await prisma.user.create({
    data: {
      id: "demo-user-chef",
      email: "chef@menutotable.com",
      passwordHash,
      name: "Chef Elena Martinez",
      role: "CHEF",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      id: "demo-user-client",
      email: "client@example.com",
      passwordHash,
      name: "Sarah Chen",
      role: "CLIENT",
    },
  });

  const chef = await prisma.chef.create({
    data: {
      id: "demo-chef-1",
      userId: chefUser.id,
      email: "chef@menutotable.com",
      name: "Chef Elena Martinez",
      bio: "Farm-to-table private chef specializing in Mediterranean cuisine. Fifteen years crafting unforgettable experiences.",
      profileImage:
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
      activeServices: ["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"],
    },
  });

  const client1 = await prisma.client.create({
    data: {
      id: "seed-client-1",
      userId: clientUser.id,
      name: "Sarah & James Chen",
      email: "client@example.com",
      phone: "(555) 123-4567",
    },
  });

  const event1 = await prisma.event.create({
    data: {
      id: "seed-event-1",
      chefId: chef.id,
      clientId: client1.id,
      eventDate: new Date("2026-07-15T18:00:00Z"),
      headcount: 12,
      serviceType: "PRIVATE_DINNER",
      status: "CLIENT_REVIEW",
      intakeData: {
        allergies: "shellfish, tree nuts",
        dietaryPreferences: "Pescatarian, low sodium",
        kitchenEquipment: "Gas range, double oven, outdoor grill",
        occasion: "Anniversary celebration",
      },
    },
  });

  await prisma.menuProposal.create({
    data: {
      id: "seed-proposal-1",
      eventId: event1.id,
      chefNotes:
        "Dear Sarah & James,\n\nCongratulations on your anniversary. I've designed three distinct menus inspired by the Mediterranean coast — each honoring your pescatarian preferences while avoiding shellfish and tree nuts.\n\nI look forward to creating an evening you'll remember.",
      status: "SENT",
      tiers: {
        create: [
          {
            id: "tier-classic",
            name: "Classic",
            description: "Elegant simplicity with seasonal ingredients and timeless technique.",
            pricePerPerson: 145,
            totalCost: 145 * 12,
            menuItems: classicItems,
            imageUrl:
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
          },
          {
            id: "tier-signature",
            name: "Signature",
            description: "My most celebrated dishes — refined flavors and artful presentation.",
            pricePerPerson: 185,
            totalCost: 185 * 12,
            menuItems: signatureItems,
            imageUrl:
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
          },
          {
            id: "tier-executive",
            name: "Executive",
            description: "The pinnacle of private dining — rare ingredients and white-glove service.",
            pricePerPerson: 265,
            totalCost: 265 * 12,
            menuItems: executiveItems,
            imageUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
          },
        ],
      },
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Michael Torres",
      email: "michael@example.com",
      phone: "(555) 987-6543",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      id: "seed-event-2",
      chefId: chef.id,
      clientId: client2.id,
      eventDate: new Date("2026-08-02T12:00:00Z"),
      headcount: 4,
      serviceType: "MEAL_PREP",
      status: "APPROVED",
      intakeData: {
        deliveryDays: ["Monday", "Wednesday"],
        containerPreference: "Glass containers provided by chef",
        fridgeSpace: "Full-size refrigerator",
        servingsPerWeek: 10,
        dietaryRestrictions: "Gluten-free",
      },
    },
  });

  await prisma.menuProposal.create({
    data: {
      eventId: event2.id,
      chefNotes: "A weekly rotation of Mediterranean-inspired meals, gluten-free throughout.",
      status: "TIER_SELECTED",
      tiers: {
        create: [
          {
            name: "Classic",
            description: "Essential weekly prep — balanced, wholesome, delicious.",
            pricePerPerson: 45,
            totalCost: 180,
            menuItems: [
              { course: "Week 1", name: "Lemon Herb Chicken", description: "Roasted vegetables" },
              { course: "Week 2", name: "Salmon & Quinoa Bowl", description: "Cucumber dill sauce" },
            ],
            isSelected: false,
          },
          {
            name: "Signature",
            description: "Elevated meal prep with premium proteins and chef sauces.",
            pricePerPerson: 60,
            totalCost: 240,
            menuItems: [
              { course: "Week 1", name: "Miso-Glazed Cod", description: "Forbidden rice, bok choy" },
              { course: "Week 2", name: "Lamb Kofta", description: "Tzatziki, herb salad" },
            ],
            isSelected: true,
          },
        ],
      },
    },
  });

  await prisma.client.create({
    data: { name: "Apex Labs Team", email: "events@apexlabs.com" },
  }).then(async (client3) => {
    await prisma.event.create({
      data: {
        id: "seed-event-3",
        chefId: chef.id,
        clientId: client3.id,
        eventDate: new Date("2026-09-10T17:00:00Z"),
        headcount: 8,
        serviceType: "COOKING_CLASS",
        status: "PENDING_PROPOSAL",
        intakeData: {
          skillLevel: "Intermediate",
          cuisineInterest: "Italian pasta making",
          equipmentAvailable: "Commercial kitchen on-site",
          groupType: "Corporate team building",
        },
      },
    });
  });

  console.log("Seed complete.");
  console.log(`Chef login: chef@menutotable.com / ${DEMO_PASSWORD}`);
  console.log(`Client login: client@example.com / ${DEMO_PASSWORD}`);
  console.log(`Proposal: /proposal/seed-event-1`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
