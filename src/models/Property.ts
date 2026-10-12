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

const DocumentItemSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    expiryDate: { type: Date }
  },
  { _id: false }
);

export interface IPropertyDocument extends Document {
  propertyNumber: string;
  propertyName: string;
  accountId: mongoose.Types.ObjectId;
  primaryContactId?: mongoose.Types.ObjectId;
  propertyType: string;
  address: {
    line1?: string;
    line2?: string;
    landmark?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  geoLocation?: {
    lat?: number;
    lng?: number;
    googleMapsLink?: string;
  };
  totalUnits: number;
  totalFloors?: number;
  builtUpArea?: number;
  yearBuilt?: number;
  amenities?: string[];
  parkingSlots?: number;
  propertyManager?: mongoose.Types.ObjectId;
  ownershipType?: string;
  surveyNumber?: string;
  taxAccountNumber?: string;
  registrationNumber?: string;
  documents: { url: string; publicId: string; name?: string; type?: string; expiryDate?: Date }[];
  media: { url: string; publicId: string; caption?: string; type: string }[];
  coverImageIndex?: number;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IPropertyDocument>(
  {
    propertyNumber: { type: String, unique: true },
    propertyName: { type: String, required: true, trim: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    primaryContactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'Commercial', 'Plot', 'PG'],
      default: 'Apartment',
    },
    address: {
      line1: { type: String },
      line2: { type: String },
      landmark: { type: String },
      locality: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    geoLocation: {
      lat: { type: Number },
      lng: { type: Number },
      googleMapsLink: { type: String },
    },
    totalUnits: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 0 },
    builtUpArea: { type: Number },
    yearBuilt: { type: Number },
    amenities: [{ type: String, enum: ['Lift', 'Parking', 'Power Backup', 'Gym', 'Pool', 'Security', 'Water Supply', 'Water', 'Garden'] }],
    parkingSlots: { type: Number },
    propertyManager: { type: Schema.Types.ObjectId, ref: 'User' },
    ownershipType: { type: String, enum: ['Freehold', 'Leasehold'] },
    surveyNumber: { type: String },
    taxAccountNumber: { type: String },
    registrationNumber: { type: String },
    documents: { type: [DocumentItemSchema], default: [] },
    media: { type: [MediaItemSchema], default: [] },
    coverImageIndex: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Active', 'Inactive', 'Under Maintenance'], default: 'Draft' },
    notes: { type: String },
  },
  { timestamps: true }
);

PropertySchema.index({ accountId: 1 });
PropertySchema.index({ propertyName: 'text', 'address.city': 'text', propertyNumber: 'text' });
PropertySchema.index({ 'address.city': 1 });

// Auto-increment propertyNumber
PropertySchema.pre('save', async function () {
  if (this.isNew && !this.propertyNumber) {
    const lastProp = await mongoose.model('Property').findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastProp && lastProp.propertyNumber) {
      const lastNum = parseInt(lastProp.propertyNumber.replace('PRP-', ''), 10);
      if (!isNaN(lastNum)) {
        this.propertyNumber = `PRP-${(lastNum + 1).toString().padStart(4, '0')}`;
        return;
      }
    }
    this.propertyNumber = 'PRP-0001';
  }
});

if (mongoose.models.Property) {
  delete mongoose.models.Property;
}
const Property: Model<IPropertyDocument> = mongoose.model<IPropertyDocument>('Property', PropertySchema);

export default Property;
