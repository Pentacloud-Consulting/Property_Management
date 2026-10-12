import dbConnect from "@/lib/db";
import Lead, { ILeadDocument } from "@/models/Lead";
import Account from "@/models/Account";
import ActivityLog from "@/models/ActivityLog";
import { LeadFormValues, ConvertLeadFormValues } from "@/validators/lead.validator";
import { PaginationParams, PaginatedResponse } from "@/types";
import mongoose from "mongoose";
import Contact from "@/models/Contact";
import Property from "@/models/Property";
import Unit from "@/models/Unit";

export class LeadService {
  /**
   * Get all leads with pagination, search, and filtering
   */
  static async getLeads(
    params: PaginationParams & { status?: string; source?: string }
  ): Promise<PaginatedResponse<ILeadDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", status, source } = params;
    
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (status) query.status = status;
    if (source) query.source = source;

    const skip = (Number(page) - 1) * Number(limit);
    
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [data, total] = await Promise.all([
      Lead.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("convertedAccountId", "accountName")
        .lean(),
      Lead.countDocuments(query),
    ]);

    return {
      data: data as unknown as ILeadDocument[],
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get a single lead by ID
   */
  static async getLeadById(id: string): Promise<ILeadDocument | null> {
    await dbConnect();
    const lead = await Lead.findById(id).populate("convertedAccountId", "accountName").lean();
    return lead as unknown as ILeadDocument;
  }

  /**
   * Create a new lead
   */
  static async createLead(data: LeadFormValues): Promise<ILeadDocument> {
    await dbConnect();
    const lead = await Lead.create(data);
    
    await ActivityLog.create({
      entityType: "lead",
      entityId: lead._id,
      action: "created",
      description: `Lead ${lead.leadName} was created`,
    });
    
    return lead;
  }

  /**
   * Update an existing lead
   */
  static async updateLead(id: string, data: Partial<LeadFormValues>): Promise<ILeadDocument | null> {
    await dbConnect();
    
    const oldLead = await Lead.findById(id);
    if (!oldLead) return null;

    const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
    // Log status change if applicable
    if (data.status && data.status !== oldLead.status) {
      await ActivityLog.create({
        entityType: "lead",
        entityId: id,
        action: "statusChanged",
        description: `Lead status changed from ${oldLead.status} to ${data.status}`,
        metadata: { oldStatus: oldLead.status, newStatus: data.status }
      });
    }
    
    return updatedLead;
  }

  /**
   * Delete a lead
   */
  static async deleteLead(id: string): Promise<boolean> {
    await dbConnect();
    const result = await Lead.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Convert a lead to a Property Owner
   */
  static async convertToOwner(leadId: string, data: ConvertLeadFormValues): Promise<{ lead: ILeadDocument; owner: any }> {
    await dbConnect();
    
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error("Lead not found");
    if (lead.status === "Converted") throw new Error("Lead is already converted");

    // Start a transaction if replica set, otherwise normal operations
    // For simplicity in standard setups, we'll do consecutive operations
    
    // 1. Create the Property Owner (Account)
    const owner = await Account.create({
      accountName: data.accountName,
      phone: data.phone,
      email: data.email,
      address: {
        line1: data.address,
        city: data.city,
        state: data.state || lead.state,
      },
      notes: lead.notes,
    });
    
    // 1b. Create the Primary Contact
    const contact = await Contact.create({
      accountId: owner._id,
      firstName: data.contactName,
      mobileNumber: data.phone,
      email: data.email,
      contactType: "Property Owner",
      isPrimary: true
    });
    
    // 1c. Create a stub Property if propertyType exists
    let newProperty = null;
    if (lead.propertyType || lead.locality || lead.city || lead.propertyName) {
      newProperty = await Property.create({
        propertyName: lead.propertyName || `${data.contactName}'s Property - ${lead.locality || lead.city || "Auto"}`,
        accountId: owner._id,
        propertyType: lead.propertyType || "Apartment",
        address: {
          locality: lead.locality || "",
          city: lead.city || "",
          state: lead.state || data.state || "",
          pincode: lead.pincode || "",
        },
        status: "Draft",
        totalUnits: 1,
      });
      
      await Unit.create({
        unitNumber: "U-01",
        propertyId: newProperty._id,
        rentAmount: 0,
        currentStatus: "Vacant",
      });
      
      await ActivityLog.create({
        entityType: "Property",
        entityId: newProperty._id,
        action: "created",
        description: `Stub Property auto-created from Lead conversion`,
      });
    }
    
    // 2. Update the Lead
    lead.status = "Converted";
    lead.convertedAccountId = owner._id as mongoose.Types.ObjectId;
    lead.convertedContactId = contact._id as mongoose.Types.ObjectId;
    if (newProperty) {
      lead.convertedPropertyId = newProperty._id as mongoose.Types.ObjectId;
    }
    lead.convertedAt = new Date();
    await lead.save();
    
    // 3. Log the activity
    await ActivityLog.create({
      entityType: "lead",
      entityId: lead._id,
      action: "converted",
      description: `Lead ${lead.leadName} converted to Account ${owner.accountName}`,
    });
    
    await ActivityLog.create({
      entityType: "account",
      entityId: owner._id,
      action: "created",
      description: `Property Owner ${owner.accountName} created from Lead conversion`,
    });
    
    return { lead, owner };
  }
}
