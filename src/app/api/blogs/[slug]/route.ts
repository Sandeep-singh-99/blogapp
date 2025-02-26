import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await ConnectDB();

    const blog = await BlogModel.findOne({ slug: params.slug }).populate("author", "name email")

    if (!blog) {
        return NextResponse.json({ error: "blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
