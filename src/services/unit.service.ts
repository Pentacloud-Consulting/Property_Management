import dbConnect from "@/lib/db";
import Unit, { IUnitDocument } from "@/models/Unit";
import ActivityLog from "@/models/ActivityLog";
import { UnitFormValues } from "@/validators/unit.validator";
import { PaginationParams, PaginatedResponse } from "@/types";

export class UnitService {
  static async getUnits(
    params: PaginationParams & { propertyId?: string; occupancyStatus?: string }
  ): Promise<PaginatedResponse<IUnitDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "unitNumber", sortOrder = "asc", propertyId, occupancyStatus } = params;
    
    const query: any = {};
    
    if (search) {
      // Basic regex search for unitNumber if search is provided
      query.unitNumber = { $regex: search, $options: "i" };
    }
    if (propertyId) query.propertyId = propertyId;
    if (occupancyStatus) query.occupancyStatus = occupancyStatus;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Unit.find(query)
        .populate("propertyId", "propertyName address media coverImageIndex")
        .populate("currentTenantId", "tenantName phone")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Unit.countDocuments(query),
    ]);

    return {
      data: data as unknown as IUnitDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUnitById(id: string): Promise<IUnitDocument | null> {
    await dbConnect();
    return Unit.findById(id)
      .populate("propertyId", "propertyName address media coverImageIndex")
      .populate("currentTenantId")
      .lean() as unknown as IUnitDocument | null;
  }

  static async createUnit(data: UnitFormValues): Promise<IUnitDocument> {
    await dbConnect();
    
    const unit = await Unit.create(data);
    
    await ActivityLog.create({
      action: "CREATE",
      entityType: "Unit",
      entityId: unit._id,
      description: `Created unit ${unit.unitNumber}`,
    });

    return unit;
  }

  static async updateUnit(
    id: string,
    data: Partial<UnitFormValues>
  ): Promise<IUnitDocument | null> {
    await dbConnect();
    
    const unit = await Unit.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (unit) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "Unit",
        entityId: unit._id,
        description: `Updated unit ${unit.unitNumber}`,
      });
    }

    return unit;
  }

  static async deleteUnit(id: string): Promise<boolean> {
    await dbConnect();
    
    const unit = await Unit.findById(id);
    if (!unit) return false;

    await Unit.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "Unit",
      entityId: id,
      description: `Deleted unit ${unit.unitNumber}`,
    });

    return true;
  }
}
