"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import useSWR from "swr";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

export default function AllStats() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/api/blogs/all-blogs-stats`, fetcher);

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">Error loading stats.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Skeleton className="h-48 w-48 rounded-full mx-auto" />
        <p className="text-gray-500 mt-4">Loading stats...</p>
      </Card>
    );
  }

  const chartData = {
    labels: data.labels, 
    datasets: [
      {
        label: "Total Blogs",
        data: data.data, 
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#facc15",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">All Blog Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="w-80 h-80">
          <Doughnut data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
