import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET() {
    try {
        await ConnectDB()

        const allBlogStats = await BlogModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            }
        ])

        const labels = allBlogStats.map(
            (stat) =>
              `${stat._id.year}-${String(stat._id.month).padStart(2, "0")}-${String(
                stat._id.day
              ).padStart(2, "0")}`
          );
          const data = allBlogStats.map((stat) => stat.count);

          return NextResponse.json({ labels, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}