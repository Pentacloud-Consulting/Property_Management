import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tenant from "@/models/Tenant";
import Unit from "@/models/Unit";
import ActivityLog from "@/models/ActivityLog";

// POST /api/tenants/[id]/renew — Renew a tenant's lease
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const { newLeaseStart, newLeaseEnd, newRentAmount, newSecurityDeposit, newRentalAgreement, agreementName, notes } = body;

    if (!newLeaseStart || !newRentAmount) {
      return NextResponse.json(
        { success: false, error: "newLeaseStart and newRentAmount are required" },
        { status: 400 }
      );
    }

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    if (tenant.status === "Past") {
      return NextResponse.json(
        { success: false, error: "Cannot renew a past tenant" },
        { status: 400 }
      );
    }

    // Save current lease to renewal history
    const renewalRecord = {
      previousLeaseStart: tenant.leaseStartDate,
      previousLeaseEnd: tenant.leaseEndDate,
      previousRent: tenant.rentAmount,
      newLeaseStart: new Date(newLeaseStart),
      newLeaseEnd: newLeaseEnd ? new Date(newLeaseEnd) : undefined,
      newRent: newRentAmount,
      renewedAt: new Date(),
      notes: notes || "",
    };

    // Update lease fields
    tenant.leaseStartDate = new Date(newLeaseStart);
    tenant.leaseEndDate = newLeaseEnd ? new Date(newLeaseEnd) : undefined;
    tenant.rentAmount = newRentAmount;
    
    if (newSecurityDeposit !== undefined) {
      tenant.securityDeposit = newSecurityDeposit;
    }
    
    if (newRentalAgreement) {
      tenant.documents.push({
        url: newRentalAgreement,
        publicId: `renew-${Date.now()}`,
        name: agreementName || "Renewed Rental Agreement",
        type: "Rental Agreement"
      });
    }

    tenant.status = "Active";
    tenant.renewalHistory.push(renewalRecord as any);

    // Clear any exit process if it was in notice
    tenant.exitProcess = undefined;

    await tenant.save();

    // Make sure unit stays occupied
    await Unit.findByIdAndUpdate(tenant.unitId, {
      currentStatus: "Occupied",
      currentTenantId: tenant._id,
    });

    await ActivityLog.create({
      action: "RENEW",
      entityType: "Tenant",
      entityId: tenant._id,
      description: `Renewed lease for ${tenant.tenantNumber}. New rent: ₹${newRentAmount}`,
    });

    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error("POST /api/tenants/[id]/renew error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to renew lease" },
      { status: 500 }
    );
  }
}
