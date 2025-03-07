import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import mongoose from "mongoose";
import BlogModel from "../../../../../models/blog";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../../../../../lib/auth";
import BookMarkModel from "../../../../../models/bookmark-model";

export async function POST(req: NextRequest, {params}: { params: {id: string}}) {
     try {
        const session = await getServerSession(getAuthOptions)

        if (!session?.user?.id) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        await ConnectDB()

        const { id } = await params;

        if (!id) {
            return NextResponse.json({error: "Bookmark ID is required"}, {status: 400});
        }

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

        const existingBookmark = await BookMarkModel.findOne({ userId: session.user.id, blogId });

        if (existingBookmark) {
            return NextResponse.json({error: "You have already bookmarked this post"}, {status: 400});
        }

        const newBookmark = await BookMarkModel.create({ userId: session.user.id, blogId });

        return NextResponse.json({message: "Bookmark added successfully", bookmark: newBookmark}, {status: 201});
     } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "An unknown error occurred"}, {status: 500});
     }
}