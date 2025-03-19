import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../../lib/db";
import LikeModel from "../../../../../../models/like-model";
import mongoose from "mongoose";
import BlogModel from "../../../../../../models/blog";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
              { error: "Missing blog ID" },
              { status: 400 }
            );
          }
        
        await ConnectDB()

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

        const totalLikes = await LikeModel.countDocuments({ blogId });

        return NextResponse.json({ totalLikes }, { status: 200})
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
    }
}