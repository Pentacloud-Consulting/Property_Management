import dbConnect from "@/lib/db";
import MaintenanceRequest, { IMaintenanceRequestDocument } from "@/models/MaintenanceRequest";
import ActivityLog from "@/models/ActivityLog";
import { MaintenanceFormValues } from "@/validators/maintenance.validator";
import { PaginationParams, PaginatedResponse } from "@/types";
import { v4 as uuidv4 } from "uuid";

export class MaintenanceService {
  static async getRequests(
    params: PaginationParams & { propertyId?: string; unitId?: string; status?: string; priority?: string }
  ): Promise<PaginatedResponse<IMaintenanceRequestDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", propertyId, unitId, status, priority } = params;
    
    const query: any = {};
    
    if (search) {
      query.ticketNumber = { $regex: search, $options: "i" };
    }
    if (propertyId) query.propertyId = propertyId;
    if (unitId) query.unitId = unitId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MaintenanceRequest.find(query)
        .populate("propertyId", "propertyName")
        .populate("unitId", "unitNumber")
        .populate({
          path: "tenantId",
          populate: { path: "contactId", select: "firstName lastName mobileNumber" }
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      MaintenanceRequest.countDocuments(query),
    ]);

    return {
      data: data as unknown as IMaintenanceRequestDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getRequestById(id: string): Promise<IMaintenanceRequestDocument | null> {
    await dbConnect();
    return MaintenanceRequest.findById(id)
      .populate("propertyId", "propertyName address")
      .populate("unitId", "unitNumber")
      .populate({
        path: "tenantId",
        populate: { path: "contactId", select: "firstName lastName mobileNumber email" }
      })
      .lean() as unknown as IMaintenanceRequestDocument | null;
  }

  static async createRequest(data: MaintenanceFormValues): Promise<IMaintenanceRequestDocument> {
    await dbConnect();
    
    const ticketNumber = `TKT-${uuidv4().substring(0, 6).toUpperCase()}`;

    const request = await MaintenanceRequest.create({
      ...data,
      ticketNumber
    });
    
    await ActivityLog.create({
      action: "CREATE",
      entityType: "MaintenanceRequest",
      entityId: request._id,
      description: `Created maintenance ticket ${ticketNumber}`,
    });

    return request;
  }

  static async updateRequest(
    id: string,
    data: Partial<MaintenanceFormValues>
  ): Promise<IMaintenanceRequestDocument | null> {
    await dbConnect();
    
    const updateData: any = { ...data };
    if (data.status === "Resolved" || data.status === "Closed") {
      updateData.resolvedAt = new Date();
    } else if (data.status === "Open" || data.status === "In Progress" || data.status === "On Hold") {
      updateData.resolvedAt = null;
    }

    const request = await MaintenanceRequest.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (request) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "MaintenanceRequest",
        entityId: request._id,
        description: `Updated maintenance ticket ${request.ticketNumber} to ${request.status}`,
      });
    }

    return request;
  }

  static async deleteRequest(id: string): Promise<boolean> {
    await dbConnect();
    
    const request = await MaintenanceRequest.findById(id);
    if (!request) return false;

    await MaintenanceRequest.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "MaintenanceRequest",
      entityId: id,
      description: `Deleted maintenance ticket ${request.ticketNumber}`,
    });

    return true;
  }
}
