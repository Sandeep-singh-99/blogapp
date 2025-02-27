import { NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import BlogModel from "../../../../../models/blog";

export async function GET() {
    try {
        await ConnectDB();

        const stats = await BlogModel.aggregate([
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

        return NextResponse.json({ labels, data }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch blog stats:", error);
        return NextResponse.json({ error: "Failed to fetch blog stats" }, { status: 500 });
    }
}