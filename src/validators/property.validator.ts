import { z } from "zod";

export const propertySchema = z.object({
  propertyName: z.string().min(2, "Property name must be at least 2 characters"),
  accountId: z.string().min(1, "Account/Owner is required"),
  primaryContactId: z.string().optional().or(z.literal("")),
  propertyType: z.enum(['Apartment', 'Villa', 'Independent House', 'Commercial', 'Plot', 'PG']).default('Apartment'),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    landmark: z.string().optional(),
    locality: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  geoLocation: z.object({
    lat: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
    lng: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
    googleMapsLink: z.string().optional(),
  }).optional(),
  totalFloors: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
  builtUpArea: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
  yearBuilt: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
  amenities: z.array(z.string()).optional(),
  parkingSlots: z.number().optional().or(z.string().transform(v => v ? Number(v) : undefined)),
  propertyManager: z.string().optional().or(z.literal("")),
  ownershipType: z.enum(['Freehold', 'Leasehold']).optional().or(z.literal("")),
  surveyNumber: z.string().optional(),
  taxAccountNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  documents: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    name: z.string().optional(),
    type: z.string().optional(),
    expiryDate: z.string().optional().or(z.literal("")),
  })).optional(),
  media: z.array(z.object({
    url: z.string(),
    publicId: z.string().optional(),
    caption: z.string().optional(),
    type: z.enum(['photo', 'video']).default('photo')
  })).optional(),
  coverImageIndex: z.number().optional().default(0),
  status: z.enum(['Draft', 'Active', 'Inactive', 'Under Maintenance']).default('Draft'),
  notes: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
