import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB, getMongoClient } from "../../../../lib/db";

import BlogModel from "../../../../models/blog";
import { getAuthOptions } from "../../../../lib/auth";
import { ObjectId } from "mongodb";


// Slug generation function
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const session = await getServerSession(getAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const markdown = formData.get("markdown") as string;
    const contentImage = formData.get("contentImage") as string;
    const thumbnailImage = formData.get("thumbnailImage") as string;

    if (!title || !category || !tags || !markdown || !thumbnailImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await BlogModel.create({
      title,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
      markdown,
      content: markdown,
      slug: generateSlug(title),
      author: session.user.id,
      ...(contentImage ? { contentImage } : {}),
      thumbnailImage,
    });

    return NextResponse.json({
      success: true,
      message: "Blog created successfully!",
    });
  } catch (error) {
    return NextResponse.json({error: error instanceof Error ? error.message :'An unknown error occurred'}, {status: 500});
  }
}



export async function GET(req: Request) {
  try {
    const client = await getMongoClient();
    const db = client.db();
    const session = await getServerSession(getAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const userId = new ObjectId(session.user.id);

   
    const blogs = await db.collection("blogs").aggregate([
      { $match: { author: userId } }, 
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: { path: "$authorDetails", preserveNullAndEmptyArrays: true } }, 
      { $sort: { createdAt: -1 } }, 
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
          "authorDetails.email": 1,
          "authorDetails.image": 1,
        },
      },
    ]).toArray();

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}