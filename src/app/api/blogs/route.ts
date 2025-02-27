import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/db";
import { authOptions } from "../auth/[...nextauth]/route";
import BlogModel from "../../../../models/blog";



// Slug generation function
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
};

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const session = await getServerSession(authOptions);

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

    if (!title || !category || !tags || !markdown || !contentImage || !thumbnailImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    
    await BlogModel.create({
      title,
      category,
      tags: tags.split(",").map(tag => tag.trim()), 
      markdown,
      content: markdown, 
      slug: generateSlug(title),
      author: session.user.id,
      contentImage,
      thumbnailImage,
    });

    return NextResponse.json({ success: true, message: "Blog created successfully!" });

  } catch (error) {
    console.error("❌ Blog creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}




export async function GET() {
  try {
    await ConnectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blogs = await BlogModel.find({author: session.user.id}).sort({ createdAt: -1 });

    console.log("Blogs:", blogs);
    

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
