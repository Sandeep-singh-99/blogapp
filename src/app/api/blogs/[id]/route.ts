import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";
import mongoose from "mongoose";



interface BlogUpdateFields {
  title?: string;
  slug?: string;
  category?: string;
  tags?: string[];
  markdown?: string;
  content?: string;
  contentImage?: string;
  thumbnailImage?: string;
}

// GET handler with explicit typing
export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }>}) {
  try {
    await ConnectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

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

// DELETE handler with explicit typing
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ConnectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const UpdateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// PUT handler with explicit typing
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ConnectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const formData = await req.formData();

    const updateFields: BlogUpdateFields = {};

    if (formData.has("title")) {
      updateFields.title = formData.get("title") as string;
      updateFields.slug = UpdateSlug(updateFields.title);
    }
    if (formData.has("category")) {
      updateFields.category = formData.get("category") as string;
    }
    if (formData.has("tags")) {
      updateFields.tags = (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim());
    }
    if (formData.has("markdown")) {
      updateFields.markdown = formData.get("markdown") as string;
      updateFields.content = updateFields.markdown;
    }
    if (formData.has("contentImage")) {
      updateFields.contentImage = formData.get("contentImage") as string;
    }
    if (formData.has("thumbnailImage")) {
      updateFields.thumbnailImage = formData.get("thumbnailImage") as string;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    await BlogModel.findByIdAndUpdate(id, updateFields, { new: true });

    return NextResponse.json(
      { success: true, message: "Blog updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}