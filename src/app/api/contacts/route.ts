import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100;
    const contactType = searchParams.get("contactType");
    const accountId = searchParams.get("accountId");

    const query: any = {};
    if (contactType) {
      query.contactType = contactType;
    }
    if (accountId) {
      query.accountId = accountId;
    }

    const contacts = await Contact.find(query).populate("accountId", "accountName").limit(limit).lean();

    return NextResponse.json({
      data: contacts,
      pagination: { total: contacts.length, page: 1, limit, totalPages: 1 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const contact = await Contact.create(body);
    return NextResponse.json({ data: contact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
