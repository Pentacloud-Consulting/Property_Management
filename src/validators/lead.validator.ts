import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES, OWNER_TYPES, SERVICES } from "@/lib/constants";

export const leadSchema = z.object({
  leadName: z.string().min(2, "Lead name must be at least 2 characters"),
  companyName: z.string().optional(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  alternateMobile: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES).default("New"),
  ownerType: z.enum(OWNER_TYPES).optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  propertyType: z.string().optional(),
  propertyName: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  servicesInterested: z.array(z.enum(SERVICES)).optional(),
  expectedStartDate: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  lostReason: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const convertLeadSchema = z.object({
  accountName: z.string().min(2, "Company/Account name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export type ConvertLeadFormValues = z.infer<typeof convertLeadSchema>;
