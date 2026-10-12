import { NextRequest, NextResponse } from "next/server";
import { AccountService } from "@/services/account.service";
import { accountSchema } from "@/validators/account.validator";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = await AccountService.getAccounts({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error("GET /api/accounts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property owners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = accountSchema.parse(body);
    
    const owner = await AccountService.createAccount(validatedData);
    
    return NextResponse.json({ success: true, data: owner }, { status: 201 });
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create property owner" },
      { status: 500 }
    );
  }
}
