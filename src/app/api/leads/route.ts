import { NextRequest, NextResponse } from "next/server";
import { LeadService } from "@/services/lead.service";
import { leadSchema } from "@/validators/lead.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;
    const status = searchParams.get("status") || undefined;
    const source = searchParams.get("source") || undefined;

    const result = await LeadService.getLeads({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      status,
      source,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = leadSchema.parse(body);
    
    // Create lead
    const newLead = await LeadService.createLead(validatedData);
    
    return NextResponse.json(
      { success: true, data: newLead, message: "Lead created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leads error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
