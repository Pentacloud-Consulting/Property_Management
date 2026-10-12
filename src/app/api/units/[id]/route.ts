import { NextRequest, NextResponse } from "next/server";
import { UnitService } from "@/services/unit.service";
import { unitSchema } from "@/validators/unit.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const unit = await UnitService.getUnitById(id);
    
    if (!unit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error(`GET /api/units/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch unit" },
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
    const validatedData = unitSchema.parse(body);
    
    const unit = await UnitService.updateUnit(id, validatedData);
    
    if (!unit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error(`PUT /api/units/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update unit" },
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
    const success = await UnitService.deleteUnit(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Unit deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/units/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete unit" },
      { status: 500 }
    );
  }
}
