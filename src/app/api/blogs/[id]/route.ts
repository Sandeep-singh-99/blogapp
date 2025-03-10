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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ConnectDB();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await BlogModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            title: 1,
            category: 1,
            slug: 1,
            tags: 1,
            contentImage: 1,
            thumbnailImage: 1,
            content: 1,
            markdown: 1,
            createdAt: 1,
            updatedAt: 1,
            "authorDetails._id": 1,
            "authorDetails.name": 1,
            "authorDetails.image": 1, 
          },
        },
      ]);
    }

    if (!blog || blog.length === 0) {
      blog = await BlogModel.aggregate([
        { $match: { slug: id } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            title: 1,
            category: 1,
            slug: 1,
            tags: 1,
            contentImage: 1,
            thumbnailImage: 1,
            content: 1,
            markdown: 1,
            createdAt: 1,
            updatedAt: 1,
            "authorDetails._id": 1,
            "authorDetails.name": 1,
            "authorDetails.image": 1, 
          },
        },
      ]);
    }

    if (!blog || blog.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog[0], { status: 200 });
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



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
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


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
