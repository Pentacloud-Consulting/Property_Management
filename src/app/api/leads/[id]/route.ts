import { NextRequest, NextResponse } from "next/server";
import { LeadService } from "@/services/lead.service";
import { leadSchema } from "@/validators/lead.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await LeadService.getLeadById(id);
    
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error(`GET /api/leads/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lead" },
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
    
    // Validate request body (partial validation since it's an update)
    const validatedData = leadSchema.partial().parse(body);
    
    const updatedLead = await LeadService.updateLead(id, validatedData);
    
    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedLead, 
      message: "Lead updated successfully" 
    });
  } catch (error) {
    console.error(`PUT /api/leads/[id] error:`, error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
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
    const deleted = await LeadService.deleteLead(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead deleted successfully" 
    });
  } catch (error) {
    console.error(`DELETE /api/leads/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
