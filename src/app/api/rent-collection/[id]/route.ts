import { NextRequest, NextResponse } from "next/server";
import { RentCollectionService } from "@/services/rent-collection.service";
import { rentCollectionSchema } from "@/validators/rent-collection.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await RentCollectionService.getCollectionById(id);
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Rent collection not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error(`GET /api/rent-collection/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rent collection" },
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
    const validatedData = rentCollectionSchema.parse(body);
    
    const collection = await RentCollectionService.updateCollection(id, validatedData);
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Rent collection not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error(`PUT /api/rent-collection/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update rent collection" },
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
    const success = await RentCollectionService.deleteCollection(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Rent collection not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Rent collection deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/rent-collection/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete rent collection" },
      { status: 500 }
    );
  }
}
