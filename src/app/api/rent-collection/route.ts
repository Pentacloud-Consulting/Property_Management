import { NextRequest, NextResponse } from "next/server";
import { RentCollectionService } from "@/services/rent-collection.service";
import { rentCollectionSchema } from "@/validators/rent-collection.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "dueDate";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const tenantId = searchParams.get("tenantId") || undefined;
    const unitId = searchParams.get("unitId") || undefined;
    const propertyId = searchParams.get("propertyId") || undefined;
    const status = searchParams.get("status") || undefined;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

    const result = await RentCollectionService.getCollections({
      page,
      limit,
      sortBy,
      sortOrder,
      tenantId,
      unitId,
      propertyId,
      status,
      month,
      year,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/rent-collection error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rent collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = rentCollectionSchema.parse(body);
    
    const collection = await RentCollectionService.createCollection(validatedData);
    
    return NextResponse.json({ success: true, data: collection }, { status: 201 });
  } catch (error) {
    console.error("POST /api/rent-collection error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create rent collection" },
      { status: 500 }
    );
  }
}
