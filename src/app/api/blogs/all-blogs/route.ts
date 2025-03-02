import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET() {
  try {
    await ConnectDB();

    const allBlogs = await BlogModel.find().lean().sort({ createdAt: -1 });

    return NextResponse.json({ allBlogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
