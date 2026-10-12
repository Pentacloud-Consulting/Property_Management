import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tenant from "@/models/Tenant";
import Unit from "@/models/Unit";
import ActivityLog from "@/models/ActivityLog";

// POST /api/tenants/[id]/exit — Start or complete the exit process
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    if (tenant.status === "Past") {
      return NextResponse.json(
        { success: false, error: "Tenant already exited" },
        { status: 400 }
      );
    }

    const {
      action, // "initiate" | "complete"
      exitRequestDate,
      exitInspectionDate,
      exitInspectionNotes,
      damageAssessment,
      deductions, // Array of { type, description, amount }
      moveOutDate,
      agreementClosed,
      exitPhotos,
    } = body;

    if (action === "initiate") {
      // Start exit / notice process
      tenant.status = "Notice";
      tenant.exitProcess = {
        exitRequestDate: exitRequestDate ? new Date(exitRequestDate) : new Date(),
        exitInspectionDate: exitInspectionDate ? new Date(exitInspectionDate) : undefined,
        exitInspectionNotes: exitInspectionNotes || "",
        damageAssessment: damageAssessment || "",
        deductions: [],
        totalDeductions: 0,
        depositRefundAmount: tenant.securityDeposit || 0,
        depositSettled: false,
        agreementClosed: false,
        exitPhotos: [],
      };

      // Mark unit as Notice Period
      await Unit.findByIdAndUpdate(tenant.unitId, {
        currentStatus: "Notice Period",
      });

      await tenant.save();

      await ActivityLog.create({
        action: "EXIT_INITIATED",
        entityType: "Tenant",
        entityId: tenant._id,
        description: `Exit process initiated for ${tenant.tenantNumber}`,
      });

      return NextResponse.json({ success: true, data: tenant });
    }

    if (action === "complete") {
      // Complete exit — calculate deductions, settle deposit, vacate unit
      const exitDeductions = deductions || [];
      const totalDeductions = exitDeductions.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
      const depositRefund = Math.max((tenant.securityDeposit || 0) - totalDeductions, 0);

      let newExitPhotos = tenant.exitProcess?.exitPhotos || [];
      if (exitPhotos && exitPhotos.length > 0) {
        const uploadedPhotos = exitPhotos.map((p: any) => ({
          url: p.url,
          publicId: `exit-${Date.now()}-${Math.random()}`,
          caption: p.name || 'Exit Photo'
        }));
        newExitPhotos = [...newExitPhotos, ...uploadedPhotos];
      }

      tenant.status = "Past";
      tenant.exitProcess = {
        ...((tenant.exitProcess as any)?._doc || tenant.exitProcess || {}),
        exitInspectionDate: exitInspectionDate ? new Date(exitInspectionDate) : tenant.exitProcess?.exitInspectionDate,
        exitInspectionNotes: exitInspectionNotes || tenant.exitProcess?.exitInspectionNotes || "",
        damageAssessment: damageAssessment || tenant.exitProcess?.damageAssessment || "",
        deductions: exitDeductions,
        totalDeductions,
        depositRefundAmount: depositRefund,
        depositSettled: true,
        depositSettlementDate: new Date(),
        agreementClosed: agreementClosed !== undefined ? agreementClosed : true,
        moveOutDate: moveOutDate ? new Date(moveOutDate) : new Date(),
        exitPhotos: newExitPhotos,
      };

      await tenant.save();

      // Free up the unit — mark as Vacant
      await Unit.findByIdAndUpdate(tenant.unitId, {
        currentStatus: "Vacant",
        currentTenantId: null,
      });

      await ActivityLog.create({
        action: "EXIT_COMPLETED",
        entityType: "Tenant",
        entityId: tenant._id,
        description: `Exit completed for ${tenant.tenantNumber}. Deposit refund: ₹${depositRefund}`,
      });

      return NextResponse.json({ success: true, data: tenant });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'initiate' or 'complete'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/tenants/[id]/exit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process exit" },
      { status: 500 }
    );
  }
}
