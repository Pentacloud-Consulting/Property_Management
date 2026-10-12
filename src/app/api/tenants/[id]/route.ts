import { NextRequest, NextResponse } from "next/server";
import { TenantService } from "@/services/tenant.service";
import { tenantSchema } from "@/validators/tenant.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await TenantService.getTenantById(id);
    
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error(`GET /api/tenants/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenant" },
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
    const validatedData = tenantSchema.parse(body);
    
    const tenant = await TenantService.updateTenant(id, validatedData);
    
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error(`PUT /api/tenants/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update tenant" },
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
    const success = await TenantService.deleteTenant(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Tenant not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Tenant deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/tenants/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}
