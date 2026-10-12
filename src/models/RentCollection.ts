import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRentCollectionDocument extends Document {
  invoiceNumber: string;
  tenantId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  amountDue: number;
  dueDate: Date;
  amountPaid: number;
  paymentDate?: Date | null;
  paymentMethod?: string;
  transactionId?: string;
  lateFee: number;
  status: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RentCollectionSchema = new Schema<IRentCollectionDocument>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    amountDue: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Online'],
    },
    transactionId: { type: String, trim: true },
    lateFee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    receiptUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

RentCollectionSchema.index({ tenantId: 1, year: 1, month: 1 });
RentCollectionSchema.index({ status: 1 });
RentCollectionSchema.index({ dueDate: 1 });
RentCollectionSchema.index({ propertyId: 1 });

// Clear mongoose model cache for hot reloading
if (mongoose.models.RentCollection) {
  delete mongoose.models.RentCollection;
}

const RentCollection: Model<IRentCollectionDocument> =
  mongoose.model<IRentCollectionDocument>('RentCollection', RentCollectionSchema);

export default RentCollection;
