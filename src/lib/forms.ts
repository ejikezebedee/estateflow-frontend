import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(["seeker", "landlord", "agent"])
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(12)
});

export const savedSearchSchema = z.object({
  name: z.string().min(2),
  alertFrequency: z.enum(["instant", "daily", "weekly", "off"])
});

export const wizardSchema = z.object({
  listingGoal: z.string().min(1),
  propertyType: z.string().min(1),
  address: z.string().min(3),
  city: z.string().min(2),
  price: z.coerce.number().positive(),
  rooms: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  amenities: z.string().optional(),
  energyClass: z.string().min(1),
  contactEmail: z.string().email()
});
