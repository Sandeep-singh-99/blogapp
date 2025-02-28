import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { getAuthOptions } from "../../../../../lib/auth";

export async function GET() {
    try {
        await ConnectDB();
        
       const session = await getServerSession(await getAuthOptions());

       if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Check if user has any blogs
      const userBlogs = await BlogModel.find({ author: session.user.id });

      if (userBlogs.length === 0) {
          return NextResponse.json({ labels: [], data: [] }, { status: 200 });
      }

      const userId = new mongoose.Types.ObjectId(session.user.id);

        const stats = await BlogModel.aggregate([
            { $match: { author: userId } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                },
            },
            {
                $sort: { _id: 1 }
            }
        ])

        const match = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const labels = stats.map((stat) => match[stat._id - 1]);
        const data = stats.map((stat) => stat.count);

        return NextResponse.json({labels, data }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch blog stats:", error);
        return NextResponse.json({ error: "Failed to fetch blog stats" }, { status: 500 });
    }
}
