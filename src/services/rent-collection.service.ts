import dbConnect from "@/lib/db";
import RentCollection, { IRentCollectionDocument } from "@/models/RentCollection";
import ActivityLog from "@/models/ActivityLog";
import { RentCollectionFormValues } from "@/validators/rent-collection.validator";
import { PaginationParams, PaginatedResponse } from "@/types";

export class RentCollectionService {
  static async getCollections(
    params: PaginationParams & { tenantId?: string; unitId?: string; propertyId?: string; status?: string; month?: number; year?: number }
  ): Promise<PaginatedResponse<IRentCollectionDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "dueDate", sortOrder = "desc", tenantId, unitId, propertyId, status, month, year } = params;
    
    const query: any = {};
    
    if (tenantId) query.tenantId = tenantId;
    if (unitId) query.unitId = unitId;
    if (propertyId) query.propertyId = propertyId;
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = year;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      RentCollection.find(query)
        .populate({
          path: "tenantId",
          select: "contactId",
          populate: { path: "contactId", select: "firstName lastName mobileNumber email" }
        })
        .populate("unitId", "unitNumber")
        .populate("propertyId", "propertyName")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      RentCollection.countDocuments(query),
    ]);

    return {
      data: data as unknown as IRentCollectionDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCollectionById(id: string): Promise<IRentCollectionDocument | null> {
    await dbConnect();
    return RentCollection.findById(id)
      .populate({
        path: "tenantId",
        populate: { path: "contactId", select: "firstName lastName mobileNumber email" }
      })
      .populate("unitId", "unitNumber unitType rentAmount")
      .populate("propertyId", "propertyName address")
      .lean() as unknown as IRentCollectionDocument | null;
  }

  static async createCollection(data: RentCollectionFormValues): Promise<IRentCollectionDocument> {
    await dbConnect();
    
    // Auto-update status to Overdue if due date passed and status is Pending
    if (data.status === "Pending" && new Date(data.dueDate) < new Date()) {
      data.status = "Overdue";
    }

    // Auto-generate invoiceNumber
    const count = await RentCollection.countDocuments();
    const invoiceNumber = `INV-${(count + 1).toString().padStart(4, "0")}`;

    const collection = await RentCollection.create({ ...data, invoiceNumber });
    
    await ActivityLog.create({
      action: "CREATE",
      entityType: "RentCollection",
      entityId: collection._id,
      description: `Recorded rent collection for ${data.month}/${data.year}`,
    });

    return collection;
  }

  static async updateCollection(
    id: string,
    data: Partial<RentCollectionFormValues>
  ): Promise<IRentCollectionDocument | null> {
    await dbConnect();
    
    if (data.status === "Pending" && data.dueDate && new Date(data.dueDate) < new Date()) {
      data.status = "Overdue";
    }

    const collection = await RentCollection.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (collection) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "RentCollection",
        entityId: collection._id,
        description: `Updated rent collection status to ${collection.status}`,
      });
    }

    return collection;
  }

  static async deleteCollection(id: string): Promise<boolean> {
    await dbConnect();
    
    const collection = await RentCollection.findById(id);
    if (!collection) return false;

    await RentCollection.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "RentCollection",
      entityId: id,
      description: `Deleted rent collection record`,
    });

    return true;
  }
}
