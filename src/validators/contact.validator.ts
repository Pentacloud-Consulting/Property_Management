import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  mobileNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  alternateMobile: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  designation: z.string().optional(),
  contactType: z.enum(['Property Owner', 'Tenant', 'Vendor', 'Broker', 'Emergency Contact', 'Other']).default('Other'),
  accountId: z.string().optional().or(z.literal("")),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
