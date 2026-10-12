import { NextRequest, NextResponse } from "next/server";
import { UnitService } from "@/services/unit.service";
import { unitSchema } from "@/validators/unit.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "unitNumber";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const propertyId = searchParams.get("propertyId") || undefined;
    const occupancyStatus = searchParams.get("occupancyStatus") || undefined;

    const result = await UnitService.getUnits({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      propertyId,
      occupancyStatus,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/units error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = unitSchema.parse(body);
    
    const unit = await UnitService.createUnit(validatedData);
    
    return NextResponse.json({ success: true, data: unit }, { status: 201 });
  } catch (error) {
    console.error("POST /api/units error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create unit" },
      { status: 500 }
    );
  }
}
