import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { getAuthOptions } from "../../../../../lib/auth";

export async function GET() {
  try {
    await ConnectDB();

    const session = await getServerSession(getAuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has any blogs
    const userBlogs = await BlogModel.find({ author: session.user.id });

    if (userBlogs.length === 0) {
      return NextResponse.json({ labels: [], data: [] }, { status: 200 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // const stats = await BlogModel.aggregate([
    //   { $match: { author: userId } },
    //   {
    //     $group: {
    //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { _id: 1 } },
    // ]);

    // const labels = stats.map(stat => stat._id); // Use full date (YYYY-MM-DD)
    // const data = stats.map(stat => stat.count);

    const stats = await BlogModel.aggregate([
      {
        $match: { author: userId },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    const labels = stats.map(
      (stat) =>
        `${stat._id.year}-${String(stat._id.month).padStart(2, "0")}-${String(
          stat._id.day
        ).padStart(2, "0")}`
    );
    const data = stats.map((stat) => stat.count);

    return NextResponse.json({ labels, data }, { status: 200 });
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
