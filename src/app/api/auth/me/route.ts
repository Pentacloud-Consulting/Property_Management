import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(cookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
