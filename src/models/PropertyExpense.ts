import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPropertyExpenseDocument extends Document {
  expenseNumber: string;
  propertyId: mongoose.Types.ObjectId;
  unitId?: mongoose.Types.ObjectId | null;
  category: string;
  amount: number;
  date: Date;
  paidDate?: Date | null;
  paidTo?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  billUrl?: string;
  approvedBy?: string;
  notes?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyExpenseSchema = new Schema<IPropertyExpenseDocument>(
  {
    expenseNumber: { type: String, required: true, unique: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', default: null },
    category: {
      type: String,
      enum: ['Repairs', 'Taxes', 'Insurance', 'Utilities', 'Salary', 'Other'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    paidDate: { type: Date, default: null },
    paidTo: { type: String },
    paymentMethod: { type: String },
    referenceNumber: { type: String },
    billUrl: { type: String },
    approvedBy: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

PropertyExpenseSchema.index({ propertyId: 1, date: -1 });
PropertyExpenseSchema.index({ category: 1 });
PropertyExpenseSchema.index({ status: 1 });

// Clear mongoose model cache for hot reloading
if (mongoose.models.PropertyExpense) {
  delete mongoose.models.PropertyExpense;
}

const PropertyExpense: Model<IPropertyExpenseDocument> =
  mongoose.model<IPropertyExpenseDocument>('PropertyExpense', PropertyExpenseSchema);

export default PropertyExpense;
