import { NextRequest, NextResponse } from "next/server";
import { PropertyService } from "@/services/property.service";
import { propertySchema } from "@/validators/property.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await PropertyService.getPropertyById(id);
    
    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error(`GET /api/properties/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property" },
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
    const validatedData = propertySchema.parse(body);
    
    const property = await PropertyService.updateProperty(id, validatedData);
    
    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error(`PUT /api/properties/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update property" },
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
    const success = await PropertyService.deleteProperty(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/properties/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
