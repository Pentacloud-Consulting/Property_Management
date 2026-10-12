import { z } from "zod";

export const maintenanceSchema = z.object({
  propertyId: z.string().min(1, "Property is required."),
  unitId: z.string().min(1, "Unit is required."),
  tenantId: z.string().optional().or(z.literal("")),
  reportedBy: z.enum(["Tenant", "Manager", "Owner"]),
  category: z.enum(["Plumbing", "Electrical", "Carpentry", "Cleaning", "Other"]),
  priority: z.enum(["Low", "Medium", "High", "Emergency"]).default("Medium"),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  status: z.enum(["Open", "In Progress", "On Hold", "Resolved", "Closed"]).default("Open"),
  assignedTo: z.string().optional(),
  scheduledDate: z.string().optional().or(z.literal("")),
  costEstimate: z.coerce.number().min(0).optional().default(0),
  actualCost: z.coerce.number().min(0).optional().default(0),
  paidBy: z.enum(["Owner", "Tenant", "Split"]).optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
