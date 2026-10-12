import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccountDocument extends Document {
  accountNumber: string;
  accountName: string;
  accountType: string;
  primaryContactId?: mongoose.Types.ObjectId;
  phone: string;
  email?: string;
  PAN?: string;
  GSTIN?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  bankDetails?: {
    accountHolder?: string;
    bankName?: string;
    accountNumber?: string;
    IFSC?: string;
    UPI_id?: string;
  };
  servicesOpted?: string[];
  managementFeeType?: string;
  managementFeeValue?: number;
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  accountOwner?: mongoose.Types.ObjectId;
  status: string;
  totalProperties: number;
  totalUnits: number;
  notes?: string;
  documents: { url: string; publicId: string; name?: string; type?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    accountNumber: { type: String, unique: true },
    accountName: { type: String, required: true },
    accountType: { type: String, enum: ['Individual', 'Company'], default: 'Individual' },
    primaryContactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true },
    PAN: { type: String },
    GSTIN: { type: String },
    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    bankDetails: {
      accountHolder: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      IFSC: { type: String },
      UPI_id: { type: String },
    },
    servicesOpted: [{ type: String, enum: ['Tenant Finding', 'Rent Collection', 'Maintenance', 'Full Management'] }],
    managementFeeType: { type: String, enum: ['Percentage', 'Fixed'] },
    managementFeeValue: { type: Number },
    agreementStartDate: { type: Date },
    agreementEndDate: { type: Date },
    accountOwner: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Active', 'Inactive', 'On Hold'], default: 'Active' },
    totalProperties: { type: Number, default: 0 },
    totalUnits: { type: Number, default: 0 },
    notes: { type: String },
    documents: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        name: { type: String, default: '' },
        type: { type: String, default: '' },
      }
    ],
  },
  { timestamps: true }
);

AccountSchema.index({ accountName: 'text', phone: 'text', email: 'text', accountNumber: 'text' });
AccountSchema.index({ status: 1 });

// Auto-increment accountNumber
AccountSchema.pre('save', async function () {
  if (this.isNew && !this.accountNumber) {
    const lastAcc = await mongoose.model('Account').findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastAcc && lastAcc.accountNumber) {
      const lastNum = parseInt(lastAcc.accountNumber.replace('ACC-', ''), 10);
      if (!isNaN(lastNum)) {
        this.accountNumber = `ACC-${(lastNum + 1).toString().padStart(4, '0')}`;
        return;
      }
    }
    this.accountNumber = 'ACC-0001';
  }
});

if (mongoose.models.Account) {
  delete mongoose.models.Account;
}
const Account: Model<IAccountDocument> = mongoose.model<IAccountDocument>("Account", AccountSchema);

export default Account;
