import { z } from "zod";

export const expenseSchema = z.object({
  propertyId: z.string().min(1, "Property is required."),
  unitId: z.string().optional().or(z.literal("")),
  category: z.enum(['Repairs', 'Taxes', 'Insurance', 'Utilities', 'Salary', 'Other']),
  amount: z.coerce.number().min(1, "Amount is required."),
  date: z.string().min(1, "Date is required."),
  paidDate: z.string().optional().or(z.literal("")),
  paidTo: z.string().optional(),
  paymentMethod: z.string().optional(),
  referenceNumber: z.string().optional(),
  billUrl: z.string().optional(),
  approvedBy: z.string().optional(),
  status: z.enum(["Paid", "Pending"]).default("Pending"),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
