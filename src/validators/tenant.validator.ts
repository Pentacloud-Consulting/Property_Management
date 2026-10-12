import { z } from "zod";

export const tenantSchema = z.object({
  propertyId: z.string().min(1, "Property is required."),
  contactId: z.string().min(1, "Contact is required."),
  unitId: z.string().min(1, "Unit is required."),
  leaseStartDate: z.string().min(1, "Lease Start Date is required."),
  leaseEndDate: z.string().optional().or(z.literal("")),
  rentAmount: z.coerce.number().min(0, "Rent amount cannot be negative."),
  maintenanceAmount: z.coerce.number().min(0).optional().default(0),
  securityDeposit: z.coerce.number().min(0).optional().default(0),
  rentPaymentCycle: z.enum(["Monthly", "Quarterly", "Annually"]).default("Monthly"),
  rentDueDate: z.string().optional(),
  policeVerificationStatus: z.enum(["Pending", "Verified", "Rejected"]).default("Pending"),
  documents: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    name: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  status: z.enum(["Active", "Notice", "Past"]).default("Active"),
  notes: z.string().optional(),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;
