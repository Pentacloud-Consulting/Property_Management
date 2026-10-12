import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@/services/property.service";
import { propertySchema } from "@/validators/property.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const accountId = searchParams.get("accountId") || undefined;
    const propertyType = searchParams.get("propertyType") || undefined;

    const result = await PropertyService.getProperties({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      accountId,
      propertyType,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = propertySchema.parse(body);
    
    const property = await PropertyService.createProperty(validatedData);
    
    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    console.error("POST /api/properties error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 }
    );
  }
}
