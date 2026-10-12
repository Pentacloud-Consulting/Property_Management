import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocumentDocument extends Document {
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  category: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  publicId: string;
  caption?: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocumentDocument>(
  {
    entityType: {
      type: String,
      enum: ['property', 'unit', 'tenant'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    category: {
      type: String,
      enum: ['image', 'video', 'document', 'aadhaar', 'pan', 'passport', 'sale_deed', 'tax_receipt', 'noc', 'floor_plan'],
      required: true,
    },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

DocumentSchema.index({ entityType: 1, entityId: 1 });
DocumentSchema.index({ category: 1 });

const DocumentModel: Model<IDocumentDocument> =
  mongoose.models.Document || mongoose.model<IDocumentDocument>('Document', DocumentSchema);

export default DocumentModel;
