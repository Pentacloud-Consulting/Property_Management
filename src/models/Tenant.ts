import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExitDeduction {
  type: string; // Painting, Service, Utility, Damage, Other
  description?: string;
  amount: number;
}

export interface IExitProcess {
  exitRequestDate?: Date;
  exitInspectionDate?: Date;
  exitInspectionNotes?: string;
  damageAssessment?: string;
  deductions: IExitDeduction[];
  totalDeductions: number;
  depositRefundAmount: number;
  depositSettled: boolean;
  depositSettlementDate?: Date;
  agreementClosed: boolean;
  moveOutDate?: Date;
  exitPhotos: { url: string; publicId: string; caption?: string }[];
}

export interface IRenewalHistory {
  previousLeaseStart: Date;
  previousLeaseEnd?: Date;
  previousRent: number;
  newLeaseStart: Date;
  newLeaseEnd?: Date;
  newRent: number;
  renewedAt: Date;
  notes?: string;
}

export interface ITenantDocument extends Document {
  tenantNumber: string;
  propertyId: mongoose.Types.ObjectId;
  contactId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  leaseStartDate: Date;
  leaseEndDate?: Date;
  rentAmount: number;
  maintenanceAmount?: number;
  securityDeposit?: number;
  rentPaymentCycle?: string;
  rentDueDate?: string;
  policeVerificationStatus: string;
  documents: { url: string; publicId: string; name?: string; type?: string }[];
  status: string;
  notes?: string;
  // Exit process
  exitProcess?: IExitProcess;
  // Renewal history
  renewalHistory: IRenewalHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const ExitDeductionSchema = new Schema(
  {
    type: { type: String, enum: ['Painting', 'Service', 'Utility', 'Damage', 'Other'], required: true },
    description: { type: String, default: '' },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ExitProcessSchema = new Schema(
  {
    exitRequestDate: { type: Date },
    exitInspectionDate: { type: Date },
    exitInspectionNotes: { type: String },
    damageAssessment: { type: String },
    deductions: { type: [ExitDeductionSchema], default: [] },
    totalDeductions: { type: Number, default: 0 },
    depositRefundAmount: { type: Number, default: 0 },
    depositSettled: { type: Boolean, default: false },
    depositSettlementDate: { type: Date },
    agreementClosed: { type: Boolean, default: false },
    moveOutDate: { type: Date },
    exitPhotos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
  },
  { _id: false }
);

const RenewalHistorySchema = new Schema(
  {
    previousLeaseStart: { type: Date, required: true },
    previousLeaseEnd: { type: Date },
    previousRent: { type: Number, required: true },
    newLeaseStart: { type: Date, required: true },
    newLeaseEnd: { type: Date },
    newRent: { type: Number, required: true },
    renewedAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { _id: false }
);

const TenantSchema = new Schema<ITenantDocument>(
  {
    tenantNumber: { type: String, unique: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    leaseStartDate: { type: Date, required: true },
    leaseEndDate: { type: Date },
    rentAmount: { type: Number, required: true },
    maintenanceAmount: { type: Number, default: 0 },
    securityDeposit: { type: Number },
    rentPaymentCycle: { type: String, enum: ['Monthly', 'Quarterly', 'Annually'], default: 'Monthly' },
    rentDueDate: { type: String }, // e.g. "1st", "5th"
    policeVerificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    documents: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        name: { type: String, default: '' },
        type: { type: String, default: '' }, // Aadhaar, Passport, Lease Agreement
      }
    ],
    status: {
      type: String,
      enum: ['Active', 'Notice', 'Past'],
      default: 'Active',
    },
    notes: { type: String },
    // Exit process
    exitProcess: { type: ExitProcessSchema, default: undefined },
    // Renewal history
    renewalHistory: { type: [RenewalHistorySchema], default: [] },
  },
  { timestamps: true }
);

TenantSchema.index({ unitId: 1 });
TenantSchema.index({ propertyId: 1 });
TenantSchema.index({ contactId: 1 });
TenantSchema.index({ status: 1 });
TenantSchema.index({ tenantNumber: 1 }, { unique: true });

// Auto-increment tenantNumber
TenantSchema.pre('save', async function () {
  if (this.isNew && !this.tenantNumber) {
    const lastTenant = await mongoose.model('Tenant').findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastTenant && lastTenant.tenantNumber) {
      const lastNum = parseInt(lastTenant.tenantNumber.replace('TEN-', ''), 10);
      if (!isNaN(lastNum)) {
        this.tenantNumber = `TEN-${(lastNum + 1).toString().padStart(4, '0')}`;
        return;
      }
    }
    this.tenantNumber = 'TEN-0001';
  }
});

if (mongoose.models.Tenant) {
  delete mongoose.models.Tenant;
}
const Tenant: Model<ITenantDocument> = mongoose.model<ITenantDocument>('Tenant', TenantSchema);

export default Tenant;
