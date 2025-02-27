import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    const { id } = params;

    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await BlogModel.findById(id);
    }

    if (!blog) {
      blog = await BlogModel.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    const { id } = params;

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const UpdateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    const { id } = params;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const markdown = formData.get("markdown") as string;
    const contentImage = formData.get("contentImage") as string;
    const thumbnailImage = formData.get("thumbnailImage") as string;

    if (
      !title ||
      !category ||
      !tags ||
      !markdown ||
      !contentImage ||
      !thumbnailImage
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await BlogModel.findByIdAndUpdate(id, {
      title,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      markdown,
      content: markdown,
      slug: UpdateSlug(title),
      contentImage,
      thumbnailImage,
    });

    return NextResponse.json(
      { success: true, message: "Blog updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
