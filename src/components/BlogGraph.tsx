"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Import shadcn/ui Card components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

type StatsData = {
  labels: string[];
  data: number[];
};

type BarChartData = ChartData<"bar", number[], string>;

export default function BlogGraph() {
  const [chartData, setChartData] = useState<BarChartData | null>(null);
  const {data: session } = useSession();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/blogs/stats");
        const stats: StatsData = await res.json();

        console.log("Stats:", stats);
        
        setChartData({
          labels: stats.labels, 
          datasets: [
            {
              label: "Blogs Uploaded",
              data: stats.data, 
              backgroundColor: "#2563eb", 
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch blog stats:", error);
      }
    }
    if (session?.user.id) {
      fetchStats();
    }
  }, [session]);

  if (!chartData) {
    return <p>Loading graph...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Uploads Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "User Blog Uploads",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}



