import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import mongoose from "mongoose";
import BlogModel from "../../../../../models/blog";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../../../../../lib/auth";
import BookMarkModel from "../../../../../models/bookmark-model";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(getAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    let blogId: mongoose.Types.ObjectId;

    if (isObjectId) {
      const blog = await BlogModel.findById(id);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      blogId = new mongoose.Types.ObjectId(id);
    } else {
      const blog = await BlogModel.findOne({ slug: id });
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      blogId = blog._id;
    }

    const existingBookmark = await BookMarkModel.findOne({
      userId: session.user.id,
      blogId,
    });

    if (existingBookmark) {
      await BookMarkModel.findByIdAndDelete(existingBookmark._id);
      return NextResponse.json({ message: "Bookmark removed successfully" });
    }

    const newBookmark = await BookMarkModel.create({
      userId: session.user.id,
      blogId,
    });

    return NextResponse.json(
      { message: "Bookmark added successfully", bookmark: newBookmark },
      { status: 201 }
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(getAuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 });
    }

    let blogId: mongoose.Types.ObjectId | null = null;

   
    if (mongoose.Types.ObjectId.isValid(id)) {
      blogId = new mongoose.Types.ObjectId(id);
    } else {
      const blog = await BlogModel.findOne({ slug: id });
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      blogId = blog._id;
    }

   
    const isBookmarked = await BookMarkModel.exists({
      userId: session.user.id,
      blogId: blogId,
    });

    return NextResponse.json({ isBookmarked: Boolean(isBookmarked) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch bookmark" }, { status: 500 });
  }
}