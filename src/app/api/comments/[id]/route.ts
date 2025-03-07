import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getAuthOptions } from "../../../../../lib/auth";
import mongoose from "mongoose";
import BlogModel from "../../../../../models/blog";
import CommentModel from "../../../../../models/comments-model";
import { ConnectDB } from "../../../../../lib/db";


export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const session = await getServerSession(getAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } 

    const { id } = await params;
    const { comment } = await req.json();

    if (!comment) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
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


    const newComment = await CommentModel.create({ author: session.user.id, comment, blogId})

    return NextResponse.json({ message: "Comment posted successfully", comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message :"An unknown error occurred"}, { status: 500 });
  }
}




export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const { id } = await params
    await ConnectDB()

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

    const comments = await CommentModel.aggregate([
      { $match: { blogId }},
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: "_id",
          as: 'author'
        },
      },
      { $unwind: '$author'},
        {
          $project: {
            _id: 1,
            comment: 1,
            createdAt: 1,
            "author.name": 1,
            "author.email": 1,
            "author.image": 1,
          },
        },
        {$sort: { createdAt: -1 }}
    ])

    return NextResponse.json({ comments: comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message :"An unknown error occurred"}, { status: 500 });
  }
}