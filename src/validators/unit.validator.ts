import { z } from "zod";

export const unitSchema = z.object({
  unitNumber: z.string().min(1, "Unit Number is required."),
  propertyId: z.string().min(1, "Property is required."),
  unitType: z.enum(['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Shop', 'Office', 'Other']).default('1BHK'),
  floorNumber: z.coerce.number().optional(),
  sizeSqFt: z.coerce.number().min(0).optional(),
  bedRooms: z.coerce.number().min(0).optional(),
  bathRooms: z.coerce.number().min(0).optional(),
  hasBalcony: z.boolean().default(false).optional(),
  furnishingStatus: z.enum(['Unfurnished', 'Semi', 'Fully']).default("Unfurnished"),
  rentAmount: z.coerce.number().min(0, "Rent amount cannot be negative."),
  maintenanceAmount: z.coerce.number().min(0).optional().default(0),
  securityDeposit: z.coerce.number().min(0).optional().default(0),
  currentStatus: z.enum(['Vacant', 'Occupied', 'Under Maintenance', 'Notice Period']).default("Vacant"),
  amenities: z.array(z.string()).optional(),
  media: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    caption: z.string().optional(),
    type: z.enum(['photo', 'video']).default('photo')
  })).optional(),
  notes: z.string().optional(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
