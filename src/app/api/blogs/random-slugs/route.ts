import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET() {
  try {
    await ConnectDB();

    const blogs = await BlogModel.aggregate([{ $sample: { size: 5 } }]).exec();

    return NextResponse.json(
      { slugs: blogs.map((b) => ({ slug: b.slug })) },
      { status: 200 }
    );
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



