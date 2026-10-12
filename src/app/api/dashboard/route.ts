import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import Account from "@/models/Account";
import Property from "@/models/Property";
import Unit from "@/models/Unit";
import Tenant from "@/models/Tenant";
import RentCollection from "@/models/RentCollection";
import MaintenanceRequest from "@/models/MaintenanceRequest";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const [
      totalAccounts,
      totalProperties,
      totalUnits,
      activeTenants,
      pendingRent,
      openMaintenance,
      recentActivities,
      recentProperties,
      recentMaintenance
    ] = await Promise.all([
      Account.countDocuments(),
      Property.countDocuments(),
      Unit.countDocuments(),
      Tenant.countDocuments({ status: "Active" }),
      RentCollection.aggregate([
        { $match: { status: { $in: ["Pending", "Overdue", "Partial"] } } },
        { $group: { _id: null, total: { $sum: "$amountDue" }, count: { $sum: 1 } } }
      ]),
      MaintenanceRequest.countDocuments({ status: { $in: ["Open", "In Progress"] } }),
      ActivityLog.find({}, "action entityType description createdAt").sort({ createdAt: -1 }).limit(6).lean(),
      Property.find({}, "propertyName address totalUnits propertyType status createdAt").sort({ createdAt: -1 }).limit(5).lean(),
      MaintenanceRequest.find({}, "title propertyId status priority createdAt category").sort({ createdAt: -1 }).limit(5).populate("propertyId", "propertyName").lean()
    ]);

    const pendingRentData = pendingRent[0] || { total: 0, count: 0 };

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalAccounts,
          totalProperties,
          totalUnits,
          activeTenants,
          pendingRentTotal: pendingRentData.total,
          pendingRentCount: pendingRentData.count,
          openMaintenance,
        },
        recentActivities,
        properties: recentProperties,
        maintenanceRequests: recentMaintenance
      }
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
