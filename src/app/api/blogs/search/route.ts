import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    console.log("Search Query:", query);

    const blogs = await BlogModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    console.log("Matching Blogs:", blogs);

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/blogs/search:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
