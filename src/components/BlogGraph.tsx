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
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Import shadcn/ui Card components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsData = {
  labels: string[];
  data: number[];
};

export default function BlogGraph() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/blogs/stats");
        const stats: StatsData = await res.json();

        
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
    fetchStats();
  }, []);

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
