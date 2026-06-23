import { z } from "zod";

const menuItemSchema = z.object({
  course: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const intakeSchema = z.object({
  chefId: z.string().min(1, "Chef ID is required"),
  serviceType: z.enum(["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  headcount: z.coerce.number().int().min(1).max(500),
  intakeData: z.record(z.unknown()).default({}),
});

const proposalTierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerPerson: z.coerce.number().positive("Price must be greater than zero"),
  menuItems: z.array(menuItemSchema).min(1, "At least one menu item is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const proposalSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  chefNotes: z.string().min(10, "Chef notes must be at least 10 characters"),
  tiers: z
    .array(proposalTierSchema)
    .min(1, "At least one tier is required")
    .max(3, "Maximum of 3 tiers allowed"),
});

export const selectTierSchema = z.object({
  tierId: z.string().min(1, "Tier ID is required"),
});

export const chefServicesSchema = z.object({
  activeServices: z
    .array(z.enum(["PRIVATE_DINNER", "MEAL_PREP", "COOKING_CLASS"]))
    .min(1, "At least one service must be active"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CHEF", "CLIENT"]),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});
