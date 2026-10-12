import dbConnect from "@/lib/db";
import Tenant, { ITenantDocument } from "@/models/Tenant";
import Unit from "@/models/Unit";
import ActivityLog from "@/models/ActivityLog";
import { TenantFormValues } from "@/validators/tenant.validator";
import { PaginationParams, PaginatedResponse } from "@/types";

export class TenantService {
  static async getTenants(
    params: PaginationParams & { unitId?: string; propertyId?: string; status?: string }
  ): Promise<PaginatedResponse<ITenantDocument>> {
    await dbConnect();
    
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", unitId, propertyId, status } = params;
    
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (unitId) query.unitId = unitId;
    if (propertyId) query.propertyId = propertyId;
    if (status) query.status = status;

    const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Tenant.find(query)
        .populate("unitId", "unitNumber")
        .populate("propertyId", "propertyName media coverImageIndex")
        .populate("contactId")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Tenant.countDocuments(query),
    ]);

    return {
      data: data as unknown as ITenantDocument[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTenantById(id: string): Promise<ITenantDocument | null> {
    await dbConnect();
    return Tenant.findById(id)
      .populate("unitId", "unitNumber rentAmount securityDeposit unitType media")
      .populate("propertyId", "propertyName address media coverImageIndex")
      .populate("contactId")
      .lean() as unknown as ITenantDocument | null;
  }

  static async createTenant(data: TenantFormValues): Promise<ITenantDocument> {
    await dbConnect();
    
    const tenant = await Tenant.create(data);
    
    // Update the unit to mark it as occupied and set the tenant ID
    await Unit.findByIdAndUpdate(data.unitId, {
      currentStatus: "Occupied",
      currentTenantId: tenant._id,
    });

    await ActivityLog.create({
      action: "CREATE",
      entityType: "Tenant",
      entityId: tenant._id,
      description: `Created tenant ${tenant.tenantNumber}`,
    });

    return tenant;
  }

  static async updateTenant(
    id: string,
    data: Partial<TenantFormValues>
  ): Promise<ITenantDocument | null> {
    await dbConnect();
    
    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (tenant) {
      await ActivityLog.create({
        action: "UPDATE",
        entityType: "Tenant",
        entityId: tenant._id,
        description: `Updated tenant ${tenant.tenantNumber}`,
      });
    }

    return tenant;
  }

  static async deleteTenant(id: string): Promise<boolean> {
    await dbConnect();
    
    const tenant = await Tenant.findById(id);
    if (!tenant) return false;

    // Free up the unit if this was the current tenant
    await Unit.updateMany(
      { currentTenantId: id },
      { $set: { currentTenantId: null, currentStatus: "Vacant" } }
    );

    await Tenant.findByIdAndDelete(id);
    
    await ActivityLog.create({
      action: "DELETE",
      entityType: "Tenant",
      entityId: id,
      description: `Deleted tenant ${tenant.tenantNumber}`,
    });

    return true;
  }
}
