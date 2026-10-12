import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLogDocument extends Document {
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  propertyId?: mongoose.Types.ObjectId | null;
  unitId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    entityType: {
      type: String,
      enum: ['lead', 'account', 'Property', 'Unit', 'Tenant', 'RentCollection', 'MaintenanceRequest', 'PropertyExpense'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'converted', 'statusChanged', 'moveIn', 'moveOut', 'rentPaid', 'renewed', 'follow_up', 'CREATE', 'UPDATE', 'DELETE', 'EXIT_INITIATED', 'EXIT_COMPLETED'],
      required: true,
    },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    propertyId: { type: Schema.Types.ObjectId, default: null },
    unitId: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ propertyId: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

if (mongoose.models.ActivityLog) {
  delete mongoose.models.ActivityLog;
}
const ActivityLog: Model<IActivityLogDocument> = mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
