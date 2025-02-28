import { NextRequest, NextResponse } from "next/server";
import { getAuthOptions } from "../../../../../lib/auth";
import NextAuth from "next-auth";

const authOptionsPromise = getAuthOptions();

export async function GET(
  req: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  try {
    const authOptions = await authOptionsPromise;
    const authHandler = NextAuth(authOptions);

    const response = await authHandler(req, context);

    if (response instanceof Response) {
      return response;
    }

    return NextResponse.json(
      { error: "Authentication processing failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("GET /api/auth/[...nextauth] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  try {
    const authOptions = await authOptionsPromise;
    const authHandler = NextAuth(authOptions);

    const response = await authHandler(req, context);

    if (response instanceof Response) {
      return response;
    }

    return NextResponse.json(
      { error: "Authentication processing failed" },
      { status: 500 }
    );
  } catch (error) {
    console.error("POST /api/auth/[...nextauth] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
