import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactDocument extends Document {
  contactNumber: string;
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  alternateMobile?: string;
  whatsappNumber?: string;
  email?: string;
  designation?: string;
  contactType: string;
  accountId?: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  preferredContactMethod?: string;
  leadSource?: string;
  leadId?: mongoose.Types.ObjectId;
  isPrimary: boolean;
  notes?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContactDocument>(
  {
    contactNumber: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    mobileNumber: { type: String, required: true },
    alternateMobile: { type: String },
    whatsappNumber: { type: String },
    email: { type: String, lowercase: true },
    designation: { type: String },
    contactType: { 
      type: String, 
      enum: ['Property Owner', 'Tenant', 'Vendor', 'Broker', 'Emergency Contact', 'Other'],
      default: 'Other'
    },
    accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
    dateOfBirth: { type: Date },
    address: {
      line1: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    preferredContactMethod: { type: String, enum: ['Call', 'WhatsApp', 'Email'] },
    leadSource: { type: String },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    isPrimary: { type: Boolean, default: false },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

ContactSchema.index({ firstName: 'text', lastName: 'text', mobileNumber: 'text', email: 'text', contactNumber: 'text' });
ContactSchema.index({ accountId: 1 });
ContactSchema.index({ contactType: 1 });

// Auto-increment contactNumber
ContactSchema.pre('save', async function () {
  if (this.isNew && !this.contactNumber) {
    const lastContact = await mongoose.model('Contact').findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastContact && lastContact.contactNumber) {
      const lastNum = parseInt(lastContact.contactNumber.replace('CON-', ''), 10);
      if (!isNaN(lastNum)) {
        this.contactNumber = `CON-${(lastNum + 1).toString().padStart(4, '0')}`;
        return;
      }
    }
    this.contactNumber = 'CON-0001';
  }
});

if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}
const Contact: Model<IContactDocument> = mongoose.model<IContactDocument>("Contact", ContactSchema);

export default Contact;
