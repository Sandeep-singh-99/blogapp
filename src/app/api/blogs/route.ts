import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/db";
import { authOptions } from "../auth/[...nextauth]/route";
import { UploadImage } from "../../../../lib/uploadImage";
import BlogModel from "../../../../models/blog";

// export async function POST(req: NextRequest) {
//   try {
//     await ConnectDB();
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const title = formData.get("title") as string;
//     const category = formData.get("category") as string;
//     const tags = formData.get("tags") as string;
//     const markdown = formData.get("markdown") as string;
//     const contentImage = formData.get("contentImage") as File;
//     const thumbnailImage = formData.get("thumbnailImage") as File;

//     if (!title || !category || !tags || !markdown) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     if (!contentImage || !thumbnailImage) {
//       return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
//     }
    

//     // Upload images to Cloudinary
//     const contentImageResult = await UploadImage(contentImage, "blogs");
//     const thumbnailImageResult = await UploadImage(thumbnailImage, "blogs");

//     // Save to MongoDB
//     await BlogModel.create({
//       title,
//       category,
//       tags,
//       markdown,
//       author: session.user.id,
//       contentImage: contentImageResult.secure_url,
//       thumbnailImage: thumbnailImageResult.secure_url,
//       cloudinaryId: contentImageResult.public_id,
//     });

//     return NextResponse.json({ success: true, message: "Blog created successfully!" });

//   } catch (error) {
//     console.error("❌ Blog creation error:", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }



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

    // Save to MongoDB
    await BlogModel.create({
      title,
      category,
      tags: tags.split(",").map(tag => tag.trim()), // Convert tags string into an array
      markdown,
      content: markdown, // Set content field
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

    const blogs = await BlogModel.find().populate("author", "name email");

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
