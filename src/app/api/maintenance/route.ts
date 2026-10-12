import { NextRequest, NextResponse } from "next/server";
import { MaintenanceService } from "@/services/maintenance.service";
import { maintenanceSchema } from "@/validators/maintenance.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const propertyId = searchParams.get("propertyId") || undefined;
    const unitId = searchParams.get("unitId") || undefined;
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;

    const result = await MaintenanceService.getRequests({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      propertyId,
      unitId,
      status,
      priority,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch maintenance requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = maintenanceSchema.parse(body);
    
    const requestItem = await MaintenanceService.createRequest(validatedData);
    
    return NextResponse.json({ success: true, data: requestItem }, { status: 201 });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create maintenance request" },
      { status: 500 }
    );
  }
}
