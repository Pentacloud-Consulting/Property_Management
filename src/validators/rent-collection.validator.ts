import { z } from "zod";

export const rentCollectionSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required."),
  unitId: z.string().min(1, "Unit is required."),
  propertyId: z.string().min(1, "Property is required."),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  amountDue: z.coerce.number().min(1, "Amount due is required."),
  dueDate: z.string().min(1, "Due date is required."),
  amountPaid: z.coerce.number().default(0),
  paymentDate: z.string().optional().or(z.literal("")),
  paymentMethod: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque", "Online"]).optional().or(z.literal("")),
  transactionId: z.string().optional().or(z.literal("")),
  lateFee: z.coerce.number().default(0),
  status: z.enum(["Paid", "Pending", "Partial", "Overdue"]).default("Pending"),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type RentCollectionFormValues = z.infer<typeof rentCollectionSchema>;
