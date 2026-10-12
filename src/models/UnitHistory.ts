import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUnitHistoryDocument extends Document {
  unitId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  tenantName: string;
  moveInDate: Date;
  moveOutDate: Date;
  rentAmount: number;
  depositAmount: number;
  createdAt: Date;
}

const UnitHistorySchema = new Schema<IUnitHistoryDocument>(
  {
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    tenantName: { type: String, required: true },
    moveInDate: { type: Date, required: true },
    moveOutDate: { type: Date, required: true },
    rentAmount: { type: Number, required: true },
    depositAmount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

UnitHistorySchema.index({ unitId: 1, moveInDate: -1 });
UnitHistorySchema.index({ propertyId: 1 });

const UnitHistory: Model<IUnitHistoryDocument> =
  mongoose.models.UnitHistory || mongoose.model<IUnitHistoryDocument>('UnitHistory', UnitHistorySchema);

export default UnitHistory;
