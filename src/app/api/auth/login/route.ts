import { NextRequest, NextResponse } from "next/server";
import { AUTH_CREDENTIALS, AUTH_COOKIE_NAME } from "@/lib/auth-constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const isValidUser =
      username.trim().toLowerCase() === AUTH_CREDENTIALS.username.toLowerCase();
    const isValidPass = password === AUTH_CREDENTIALS.password;

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password. Use Pentacloud / Pentacloud@2026",
        },
        { status: 401 }
      );
    }

    const sessionData = {
      username: AUTH_CREDENTIALS.username,
      name: AUTH_CREDENTIALS.name,
      email: AUTH_CREDENTIALS.email,
      role: AUTH_CREDENTIALS.role,
      loginAt: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: "Authentication successful",
    });

    // Set cookie valid for 7 days
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: JSON.stringify(sessionData),
      httpOnly: false, // Accessible to client-side auth helpers
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
