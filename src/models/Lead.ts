import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeadDocument extends Document {
  leadNumber: string;
  leadName: string;
  mobileNumber: string;
  alternateMobile?: string;
  email?: string;
  source: string;
  status: string;
  ownerType?: string;
  companyName?: string;
  city?: string;
  locality?: string;
  propertyType?: string;
  propertyName?: string;
  state?: string;
  pincode?: string;
  servicesInterested?: string[];
  expectedStartDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  nextFollowUpDate?: Date;
  lostReason?: string;
  notes?: string;
  convertedAt?: Date | null;
  convertedContactId?: mongoose.Types.ObjectId | null;
  convertedAccountId?: mongoose.Types.ObjectId | null;
  convertedPropertyId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    leadNumber: { type: String, unique: true },
    leadName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    alternateMobile: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Walk-in', 'Google Ads', 'Broker', 'Cold Call', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'],
      default: 'New',
    },
    ownerType: { type: String, enum: ['Individual', 'Company'] },
    companyName: { type: String, trim: true },
    city: { type: String, trim: true },
    locality: { type: String, trim: true },
    propertyType: { type: String, enum: ['Apartment', 'Villa', 'Independent House', 'Commercial', 'Plot'] },
    propertyName: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    servicesInterested: [{ type: String, enum: ['Tenant Finding', 'Rent Collection', 'Maintenance', 'Full Management'] }],
    expectedStartDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    nextFollowUpDate: { type: Date },
    lostReason: { type: String },
    notes: { type: String },
    convertedAt: { type: Date, default: null },
    convertedContactId: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
    convertedAccountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
    convertedPropertyId: { type: Schema.Types.ObjectId, ref: 'Property', default: null },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ mobileNumber: 1 });
LeadSchema.index({ leadName: 'text', email: 'text', leadNumber: 'text' });

// Auto-increment leadNumber
LeadSchema.pre('save', async function () {
  if (this.isNew && !this.leadNumber) {
    const lastLead = await mongoose.model('Lead').findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastLead && lastLead.leadNumber) {
      const lastNum = parseInt(lastLead.leadNumber.replace('LD-', ''), 10);
      if (!isNaN(lastNum)) {
        this.leadNumber = `LD-${(lastNum + 1).toString().padStart(4, '0')}`;
        return;
      }
    }
    this.leadNumber = 'LD-0001';
  }
});

if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}
const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', LeadSchema);

export default Lead;
