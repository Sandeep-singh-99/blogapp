import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/db";
import BookMarkModel from "../../../../models/bookmark-model";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../../../../lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(getAuthOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await ConnectDB()

    const allBookmarks = await BookMarkModel.find({userId: session.user.id}).populate("blogId");

    return NextResponse.json({ bookmarks: allBookmarks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
