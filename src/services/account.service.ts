import dbConnect from "@/lib/db";
import Account, { IAccountDocument } from "@/models/Account";
import Contact from "@/models/Contact";
import Property from "@/models/Property";
import Unit from "@/models/Unit";
import RentCollection from "@/models/RentCollection";
import ActivityLog from "@/models/ActivityLog";
import { AccountFormValues } from "@/validators/account.validator";
import { PaginationParams, PaginatedResponse } from "@/types";
import mongoose from "mongoose";

export class AccountService {
  /**
   * Get all accounts with pagination and search
   */
  static async getAccounts(
    params: PaginationParams
  ): Promise<PaginatedResponse<IAccountDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc" } = params;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { accountName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [data, total] = await Promise.all([
      Account.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Account.countDocuments(query),
    ]);

    return {
      data: data as unknown as IAccountDocument[],
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get a single account by ID with full aggregate details
   */
  static async getAccountDetails(id: string): Promise<any | null> {
    await dbConnect();
    const account = await Account.findById(id).lean();
    if (!account) return null;

    // Fetch contacts
    const contacts = await Contact.find({ accountId: id }).lean();

    // Fetch properties linked to this account
    const properties = await Property.find({
      $or: [{ accountId: id }, { ownerId: id }]
    }).sort({ createdAt: -1 }).lean();
    const propertyIds = properties.map(p => p._id);

    // Fetch units and aggregate info
    const units = await Unit.find({ propertyId: { $in: propertyIds } }).lean();
    
    let occupiedUnits = 0;
    let vacantUnits = 0;
    let totalRent = 0;

    units.forEach(unit => {
      const status = (unit as any).currentStatus || (unit as any).status;
      if (status === 'Occupied') occupiedUnits++;
      if (status === 'Vacant') vacantUnits++;
      
      const rent = (unit as any).rentAmount || (unit as any).marketRent || 0;
      if (status === 'Occupied' && rent) {
        totalRent += rent;
      }
    });

    // Or calculate revenue from actual RentCollections
    const recentCollections = await RentCollection.aggregate([
      { $match: { propertyId: { $in: propertyIds }, status: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amountDue" } } }
    ]);
    
    const totalRevenue = recentCollections.length > 0 ? recentCollections[0].totalRevenue : 0;

    // Fallback address from first property if account address is not set
    const effectiveAddress = (account.address?.city || account.address?.line1) 
      ? account.address 
      : (properties[0]?.address ? {
          line1: properties[0].address.line1 || "",
          line2: properties[0].address.line2 || "",
          city: properties[0].address.city || "",
          state: properties[0].address.state || "",
          pincode: properties[0].address.pincode || "",
        } : account.address);

    return {
      ...account,
      address: effectiveAddress,
      metrics: {
        totalContacts: contacts.length,
        totalProperties: properties.length,
        totalUnits: units.length,
        occupiedUnits,
        vacantUnits,
        monthlyRevenueEstimate: totalRent,
        totalRevenueCollected: totalRevenue,
      },
      contacts,
      properties,
    };
  }

  /**
   * Create a new account
   */
  static async createAccount(data: AccountFormValues): Promise<IAccountDocument> {
    await dbConnect();
    
    // Separate embedded objects
    const { contact, property, ...accountData } = data;

    // If account address was not provided, inherit from first property
    if (!accountData.address || (!accountData.address.line1 && !accountData.address.city)) {
      if (property?.address?.line1 || property?.address?.city) {
        accountData.address = {
          line1: property.address.line1 || "",
          line2: property.address.line2 || "",
          city: property.address.city || "",
          state: property.address.state || "",
          pincode: property.address.pincode || "",
        };
      }
    }
    
    if (property && property.propertyName) {
      (accountData as any).totalProperties = 1;
    }

    const account = await Account.create(accountData);
    
    // Create Primary Contact if provided
    let contactId;
    if (contact && contact.firstName) {
      const newContact = await Contact.create({
        ...contact,
        accountId: account._id,
        contactType: "Property Owner",
        isPrimary: true,
      });
      contactId = newContact._id;
      
      // Link to account
      await Account.findByIdAndUpdate(account._id, { primaryContactId: contactId });
    }
    
    // Create Initial Property if provided
    if (property && property.propertyName) {
      await Property.create({
        ...property,
        accountId: account._id,
        propertyManager: contactId || undefined,
        status: "Draft",
      });
    }

    await ActivityLog.create({
      entityType: "account",
      entityId: account._id,
      action: "created",
      description: `Account ${account.accountName} was created with initial onboarding`,
    });
    
    return account;
  }

  /**
   * Update an existing account
   */
  static async updateAccount(id: string, data: Partial<AccountFormValues>): Promise<IAccountDocument | null> {
    await dbConnect();
    
    const { contact, property, ...accountData } = data;

    const account = await Account.findByIdAndUpdate(id, accountData, { new: true, runValidators: true });
    if (!account) return null;

    // Update or create Primary Contact if provided
    if (contact && contact.firstName) {
      if (account.primaryContactId) {
        await Contact.findByIdAndUpdate(account.primaryContactId, {
          firstName: contact.firstName,
          lastName: contact.lastName || "",
          mobileNumber: contact.mobileNumber || account.phone,
          email: contact.email || account.email,
          contactType: "Property Owner",
          isPrimary: true,
        });
      } else {
        const existing = await Contact.findOne({ accountId: id });
        if (existing) {
          await Contact.findByIdAndUpdate(existing._id, {
            firstName: contact.firstName,
            lastName: contact.lastName || "",
            mobileNumber: contact.mobileNumber || account.phone,
            email: contact.email || account.email,
            contactType: "Property Owner",
            isPrimary: true,
          });
          await Account.findByIdAndUpdate(id, { primaryContactId: existing._id });
        } else {
          const newContact = await Contact.create({
            firstName: contact.firstName,
            lastName: contact.lastName || "",
            mobileNumber: contact.mobileNumber || account.phone,
            email: contact.email || account.email,
            accountId: id,
            contactType: "Property Owner",
            isPrimary: true,
          });
          await Account.findByIdAndUpdate(id, { primaryContactId: newContact._id });
        }
      }
    }

    await ActivityLog.create({
      entityType: "account",
      entityId: id,
      action: "updated",
      description: `Account ${account.accountName} was updated`,
    });
    
    return account;
  }

  /**
   * Delete an account
   */
  static async deleteAccount(id: string): Promise<boolean> {
    await dbConnect();
    
    // Check if account has properties
    const propertyCount = await Property.countDocuments({
      $or: [{ accountId: id }, { ownerId: id }]
    });
    if (propertyCount > 0) {
      throw new Error("Cannot delete account with existing properties. Please reassign or delete properties first.");
    }
    
    const result = await Account.findByIdAndDelete(id);
    if (result) {
      await Contact.deleteMany({ accountId: id });
    }
    return !!result;
  }
}
