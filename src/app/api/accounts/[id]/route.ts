import { NextRequest, NextResponse } from "next/server";
import { AccountService } from "@/services/account.service";
import { accountSchema, updateAccountSchema } from "@/validators/account.validator";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = await AccountService.getAccountDetails(id);
    
    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/accounts/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch account details" },
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
    
    const validatedData = updateAccountSchema.parse(body);
    
    const updatedAccount = await AccountService.updateAccount(id, validatedData);
    
    if (!updatedAccount) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: updatedAccount, message: "Account updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PUT /api/accounts/[id] error:`, error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update account" },
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
    const success = await AccountService.deleteAccount(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/accounts/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
