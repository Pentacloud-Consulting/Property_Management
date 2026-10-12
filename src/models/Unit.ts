import mongoose, { Schema, Document, Model } from 'mongoose';

const MediaItemSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, default: '' },
    type: { type: String, enum: ['photo', 'video'], default: 'photo' }
  },
  { _id: false }
);

export interface IUnitDocument extends Document {
  unitNumber: string;
  propertyId: mongoose.Types.ObjectId;
  unitType?: string;
  floorNumber?: number;
  sizeSqFt?: number;
  bedRooms?: number;
  bathRooms?: number;
  hasBalcony?: boolean;
  furnishingStatus?: string;
  rentAmount: number;
  maintenanceAmount?: number;
  securityDeposit?: number;
  currentStatus: string;
  currentTenantId?: mongoose.Types.ObjectId | null;
  amenities?: string[];
  media: { url: string; publicId: string; caption?: string; type: string }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnitSchema = new Schema<IUnitDocument>(
  {
    unitNumber: { type: String, required: true, trim: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    unitType: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Shop', 'Office', 'Other'],
      default: '1BHK',
    },
    floorNumber: { type: Number },
    sizeSqFt: { type: Number },
    bedRooms: { type: Number },
    bathRooms: { type: Number },
    hasBalcony: { type: Boolean, default: false },
    furnishingStatus: {
      type: String,
      enum: ['Unfurnished', 'Semi', 'Fully'],
      default: 'Unfurnished',
    },
    rentAmount: { type: Number, required: true },
    maintenanceAmount: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    currentStatus: {
      type: String,
      enum: ['Vacant', 'Occupied', 'Under Maintenance', 'Notice Period'],
      default: 'Vacant',
    },
    currentTenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null },
    amenities: [{ type: String }],
    media: { type: [MediaItemSchema], default: [] },
    notes: { type: String },
  },
  { timestamps: true }
);

UnitSchema.index({ propertyId: 1 });
UnitSchema.index({ currentStatus: 1 });
UnitSchema.index({ unitNumber: 1, propertyId: 1 }, { unique: true });

if (mongoose.models.Unit) {
  delete mongoose.models.Unit;
}
const Unit: Model<IUnitDocument> = mongoose.model<IUnitDocument>('Unit', UnitSchema);

export default Unit;
