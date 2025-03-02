"use client";
import BlogCard from "@/components/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import useSWR from "swr";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
};

export default function BlogHome() {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/api/blogs/all-blogs`,
    fetcher,
    {
      dedupingInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      fallbackData: undefined,
    }
  );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">
          Failed to load blogs. Please try again later.
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mt-6 sm:mt-10 px-4 text-center">
        <h1 className="text-[#212121] dark:text-white text-lg sm:text-2xl md:text-4xl font-bold leading-snug">
          Stay Ahead with the Latest in Tech & Development
        </h1>
        <p className="text-[#4F5563] dark:text-gray-300 text-sm sm:text-base md:text-lg font-serif mt-2 sm:mt-3 max-w-2xl">
          Insights, trends, and innovations in Web, Mobile, and Emerging
          Technologies.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="mt-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <BlogSkeleton key={index} />
              )) // Show Skeletons
            : data.allBlogs.map((blog: any) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
        </div>
      </div>
    </div>
  );
}

// ✅ Skeleton UI Component
function BlogSkeleton() {
  return (
    <div className="max-w-[400px] h-[320px] bg-white dark:bg-[#212121] rounded-lg shadow-lg overflow-hidden">
      <Skeleton className="h-[200px] w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    </div>
  );
}
