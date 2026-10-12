import { NextRequest, NextResponse } from "next/server";
import { LeadService } from "@/services/lead.service";
import { convertLeadSchema } from "@/validators/lead.validator";
import { ZodError } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = convertLeadSchema.parse(body);
    
    // Convert lead
    const result = await LeadService.convertToOwner(id, validatedData);
    
    return NextResponse.json(
      { 
        success: true, 
        data: result, 
        message: "Lead successfully converted to Property Owner" 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`POST /api/leads/[id]/convert error:`, error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || "Failed to convert lead" },
      { status: error.message === "Lead is already converted" ? 400 : 500 }
    );
  }
}
