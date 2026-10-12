import { NextRequest, NextResponse } from "next/server";
import { MaintenanceService } from "@/services/maintenance.service";
import { maintenanceSchema } from "@/validators/maintenance.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestItem = await MaintenanceService.getRequestById(id);
    
    if (!requestItem) {
      return NextResponse.json(
        { success: false, error: "Maintenance request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: requestItem });
  } catch (error) {
    console.error(`GET /api/maintenance/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch maintenance request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = maintenanceSchema.parse(body);
    
    const requestItem = await MaintenanceService.updateRequest(id, validatedData);
    
    if (!requestItem) {
      return NextResponse.json(
        { success: false, error: "Maintenance request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: requestItem });
  } catch (error) {
    console.error(`PUT /api/maintenance/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update maintenance request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await MaintenanceService.deleteRequest(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Maintenance request not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Maintenance request deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/maintenance/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete maintenance request" },
      { status: 500 }
    );
  }
}
