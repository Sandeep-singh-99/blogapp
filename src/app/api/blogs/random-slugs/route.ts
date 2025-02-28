import {  NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";


export async function GET() {
  try {
    await ConnectDB();

    const blogs = await BlogModel.aggregate([{ $sample: { size: 5 } }]); 

    return NextResponse.json({ slugs: blogs.map((b) => ({ slug: b.slug })) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching random slugs:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
