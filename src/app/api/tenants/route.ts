import { NextRequest, NextResponse } from "next/server";
import { TenantService } from "@/services/tenant.service";
import { tenantSchema } from "@/validators/tenant.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const unitId = searchParams.get("unitId") || undefined;
    const propertyId = searchParams.get("propertyId") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await TenantService.getTenants({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      unitId,
      propertyId,
      status,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/tenants error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = tenantSchema.parse(body);
    
    const tenant = await TenantService.createTenant(validatedData);
    
    return NextResponse.json({ success: true, data: tenant }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tenants error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
