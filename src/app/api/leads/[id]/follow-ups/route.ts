import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import Lead from "@/models/Lead";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const logs = await ActivityLog.find({
      entityType: 'lead',
      entityId: new mongoose.Types.ObjectId(id)
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    await dbConnect();
    
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const log = await ActivityLog.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'follow_up',
      description: body.description || 'Follow-up recorded',
      metadata: {
        type: body.type || 'Note', // Call, Note, Email, Meeting
        date: body.date || new Date().toISOString()
      }
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
