import { z } from "zod";
import { OWNER_TYPES, SERVICES } from "@/lib/constants";

export const baseAccountSchema = z.object({
  accountName: z.string().min(2, "Name must be at least 2 characters"),
  accountType: z.enum(["Individual", "Company"]).default("Individual"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  PAN: z.string().optional(),
  GSTIN: z.string().optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  bankDetails: z.object({
    accountHolder: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    IFSC: z.string().optional(),
    UPI_id: z.string().optional(),
  }).optional(),
  servicesOpted: z.array(z.enum(["Tenant Finding", "Rent Collection", "Maintenance", "Full Management"])).optional(),
  managementFeeType: z.enum(["Percentage", "Fixed"]).optional(),
  managementFeeValue: z.number().optional().or(z.string().transform((val) => (val === "" ? undefined : Number(val)))),
  agreementStartDate: z.string().optional().or(z.literal("")),
  agreementEndDate: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive", "On Hold"]).default("Active"),
  notes: z.string().optional(),
  documents: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    name: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
  // Embedded objects for initial onboarding
  contact: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    mobileNumber: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    role: z.string().default("Owner"),
    contactType: z.string().default("Property Owner"),
  }).optional(),
  property: z.object({
    propertyName: z.string().min(2, "Property name is required"),
    propertyType: z.enum(["Apartment", "Villa", "Independent House", "Commercial", "Plot", "PG"]).default("Apartment"),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      locality: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    builtUpArea: z.number().optional().or(z.string().transform((val) => (val === "" ? undefined : Number(val)))),
    totalFloors: z.number().optional().or(z.string().transform((val) => (val === "" ? undefined : Number(val)))),
    parkingSlots: z.number().optional().or(z.string().transform((val) => (val === "" ? undefined : Number(val)))),
  }).optional(),
});

export const accountSchema = baseAccountSchema.superRefine((data, ctx) => {
  if (data.accountType === "Company" && !data.PAN) {
    ctx.addIssue({
      path: ["PAN"],
      message: "Company PAN is required for Company accounts",
      code: z.ZodIssueCode.custom,
    });
  }
});

export const updateAccountSchema = baseAccountSchema.partial();

export type AccountFormValues = z.infer<typeof accountSchema>;
