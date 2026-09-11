import { z } from "zod";
import { BUDGET_RANGES } from "@/lib/taxonomy";

export const leadSchema = z.object({
  type: z.enum(["CONTACT", "CALLBACK", "NEWSLETTER"]).default("CONTACT"),
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().max(4000).optional(),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  website: z.string().max(0).optional(),
});

/* ---- Request For Quote (multi-step wizard) ---- */

export const quoteSchema = z.object({
  serviceSlugs: z.array(z.string()).min(1, "Select at least one service"),
  projectType: z.string().trim().max(120).optional(),
  industrySlug: z.string().trim().optional(),
  state: z.string().trim().max(4).optional(),
  sizeSqft: z.coerce.number().int().positive().max(100_000_000).optional(),
  floors: z.coerce.number().int().positive().max(300).optional(),
  deadline: z.string().trim().optional(),
  budgetRange: z.enum(BUDGET_RANGES).optional(),
  description: z.string().trim().max(6000).optional(),
  name: z.string().trim().min(1, "Your name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(40).optional(),
  companyName: z.string().trim().max(160).optional(),
  fileKeys: z.array(z.object({ name: z.string(), url: z.string(), size: z.number(), type: z.string().optional() })).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email(),
    company: z.string().trim().max(160).optional(),
    password: z.string().min(8, "Use at least 8 characters").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
