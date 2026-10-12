import mongoose, { Schema, Document, Model } from 'mongoose';

const MediaItemSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

export interface IMaintenanceRequestDocument extends Document {
  ticketNumber: string;
  propertyId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  tenantId?: mongoose.Types.ObjectId | null;
  reportedBy: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: string;
  scheduledDate?: Date | null;
  costEstimate?: number;
  actualCost?: number;
  paidBy?: string;
  media: { url: string; publicId: string; caption?: string; type?: string }[];
  notes?: string;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceRequestSchema = new Schema<IMaintenanceRequestDocument>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null },
    reportedBy: { type: String, enum: ['Tenant', 'Manager', 'Owner'], required: true },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'],
      default: 'Open',
    },
    assignedTo: { type: String },
    scheduledDate: { type: Date, default: null },
    costEstimate: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    paidBy: { type: String, enum: ['Owner', 'Tenant', 'Split'] },
    media: { type: [MediaItemSchema], default: [] },
    notes: { type: String },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MaintenanceRequestSchema.index({ ticketNumber: 1 });
MaintenanceRequestSchema.index({ status: 1 });
MaintenanceRequestSchema.index({ priority: 1 });
MaintenanceRequestSchema.index({ propertyId: 1 });

// Clear mongoose model cache for hot reloading
if (mongoose.models.MaintenanceRequest) {
  delete mongoose.models.MaintenanceRequest;
}

const MaintenanceRequest: Model<IMaintenanceRequestDocument> =
  mongoose.model<IMaintenanceRequestDocument>('MaintenanceRequest', MaintenanceRequestSchema);

export default MaintenanceRequest;
