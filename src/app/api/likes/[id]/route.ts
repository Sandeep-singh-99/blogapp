import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../../../../../lib/auth";
import mongoose from "mongoose";
import LikeModel from "../../../../../models/like-model";
import BlogModel from "../../../../../models/blog";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    const session = await getServerSession(getAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    let blogId: mongoose.Types.ObjectId;

    if (isObjectId) {
      const blog = await BlogModel.findById(id)
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


     const blog = await BlogModel.findById(blogId);
     if (blog?.author.toString() === session.user.id) {
       return NextResponse.json({ error: "You can't like your own blog" }, { status: 400 });
     }

    const existingLike = await LikeModel.findOne({ userId: session.user.id, blogId });

    if (existingLike) {
        await LikeModel.findByIdAndDelete(existingLike._id);
        return NextResponse.json({ error: "Unliked successfully" }, { status: 200 });
    }

    
    const newLike = await LikeModel.create({ userId: session.user.id, blogId })

    return NextResponse.json({ message: "Liked successfully", like: newLike }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
