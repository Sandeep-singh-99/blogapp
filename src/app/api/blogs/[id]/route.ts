import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";
import mongoose from "mongoose";


interface RouteParams {
  params: {
    id: string;
  };
}


export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await ConnectDB();
    const { id } = params;

    // if (!id) {
    //   return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    // }

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


export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await ConnectDB();
    const { id } = params;

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

const UpdateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


// export async function PUT(req: NextRequest, { params }: RouteParams) {
//   try {
//     await ConnectDB();
//     const { id } = params;
//     const formData = await req.formData();

//     const title = formData.get("title") as string;
//     const category = formData.get("category") as string;
//     const tags = formData.get("tags") as string;
//     const markdown = formData.get("markdown") as string;
//     const contentImage = formData.get("contentImage") as string;
//     const thumbnailImage = formData.get("thumbnailImage") as string;

//     if (
//       !title ||
//       !category ||
//       !tags ||
//       !markdown ||
//       !contentImage ||
//       !thumbnailImage
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     await BlogModel.findByIdAndUpdate(id, {
//       title,
//       category,
//       tags: tags.split(",").map((tag) => tag.trim()),
//       markdown,
//       content: markdown,
//       slug: UpdateSlug(title),
//       contentImage,
//       thumbnailImage,
//     });

//     return NextResponse.json(
//       { success: true, message: "Blog updated successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ConnectDB();
    const { id } = params;
    const formData = await req.formData();

    // Create an empty update object
    const updateFields: Record<string, any> = {};

    // Check and add fields only if they exist in the request
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

    // If no valid fields are present, return an error response
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Perform the update
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
