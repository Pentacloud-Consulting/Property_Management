import dbConnect from "@/lib/db";
import Property, { IPropertyDocument } from "@/models/Property";
import ActivityLog from "@/models/ActivityLog";
import { PropertyFormValues } from "@/validators/property.validator";
import { PaginationParams, PaginatedResponse } from "@/types";

export class PropertyService {
  static async getProperties(
    params: PaginationParams & { accountId?: string; propertyType?: string }
  ): Promise<PaginatedResponse<IPropertyDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", accountId, propertyType } = params;
    
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (accountId) query.accountId = accountId;
    if (propertyType) query.propertyType = propertyType;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Property.find(query)
        .populate("accountId", "accountName phone email")
        .populate("primaryContactId", "firstName lastName contactType")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    return {
      data: data as unknown as IPropertyDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPropertyById(id: string): Promise<IPropertyDocument | null> {
    await dbConnect();
    return Property.findById(id)
      .populate("accountId", "accountName phone email")
      .populate("primaryContactId", "firstName lastName contactType")
      .lean() as unknown as IPropertyDocument | null;
  }

  static async createProperty(data: PropertyFormValues): Promise<IPropertyDocument> {
    await dbConnect();
    
    const insertData: any = { ...data };
    if (!insertData.primaryContactId || insertData.primaryContactId === "") delete insertData.primaryContactId;
    if (!insertData.propertyManager || insertData.propertyManager === "") delete insertData.propertyManager;
    if (!insertData.ownershipType || insertData.ownershipType === "") delete insertData.ownershipType;

    const property = await Property.create(insertData);
    
    await ActivityLog.create({
      action: "CREATE",
      entityType: "Property",
      entityId: property._id,
      description: `Created property ${property.propertyName}`,
    });

    return property;
  }

  static async updateProperty(
    id: string,
    data: Partial<PropertyFormValues>
  ): Promise<IPropertyDocument | null> {
    await dbConnect();
    
    const updateData: any = { ...data };
    const unsets: any = {};

    if (!updateData.primaryContactId || updateData.primaryContactId === "") {
      delete updateData.primaryContactId;
      unsets.primaryContactId = 1;
    }
    if (!updateData.propertyManager || updateData.propertyManager === "") {
      delete updateData.propertyManager;
      unsets.propertyManager = 1;
    }
    if (!updateData.ownershipType || updateData.ownershipType === "") {
      delete updateData.ownershipType;
      unsets.ownershipType = 1;
    }

    const updateQuery: any = { $set: updateData };
    if (Object.keys(unsets).length > 0) {
      updateQuery.$unset = unsets;
    }

    const property = await Property.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (property) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "Property",
        entityId: property._id,
        description: `Updated property ${property.propertyName}`,
      });
    }

    return property;
  }

  static async deleteProperty(id: string): Promise<boolean> {
    await dbConnect();
    
    const property = await Property.findById(id);
    if (!property) return false;

    await Property.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "Property",
      entityId: id,
      description: `Deleted property ${property.propertyName}`,
    });

    return true;
  }
}
