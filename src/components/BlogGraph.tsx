"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
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


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

type StatsData = {
  labels: string[];
  data: number[];
};

type BarChartData = ChartData<"bar", number[], string>;

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function BlogGraph() {
  const { data: session } = useSession();

  
  const { data, error } = useSWR<StatsData>(
    session?.user.id ? "/api/blogs/stats" : null,
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      fallbackData: { labels: [], data: [] },
    }
  );

  if (error) {
    return <p className="text-red-500">Failed to load blog stats.</p>;
  }

  if (!data || data.labels.length === 0) {
    return <p>Loading graph...</p>;
  }

  const chartData: BarChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Blogs Uploaded",
        data: data.data,
        backgroundColor: "#2563eb",
      },
    ],
  };

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
