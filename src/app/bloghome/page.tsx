"use client";
import BlogCard from "@/components/BlogCard";
import Hero from "@/components/Hero";
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
    <>
      <Hero />
      <div className="container mx-auto px-4 pb-10">
        {/* Blog Cards Grid */}
        <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 mt-8">
          Latest Blogs
        </h2>

        <div className="mt-10 flex justify-center lg:flex-row space-x-6">
          {/* Blog Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-2/3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <BlogSkeleton key={index} />
                )) // Show Skeletons
              : data.allBlogs.map((blog: any) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
          </div>

          {/* Sidebar with Author Info and Additional Content */}
          <div className="w-1/3 hidden lg:block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {/* Author Info */}
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Sandeep Singh
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Author & Tech Enthusiast
              </p>

              {/* Latest Post */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Latest Post
                </h3>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Post Title:</span> "Exploring
                    the Future of Web Development"
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Published on:</span> March 10,
                    2025
                  </p>
                </div>
              </div>

              {/* Top Editor Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Top Editor
                </h3>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Editor:</span> John Doe
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Position:</span> Senior Editor
                  </p>
                </div>
              </div>

              {/* Category Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Categories
                </h3>
                <ul className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Web Development</li>
                  <li>Mobile Development</li>
                  <li>Emerging Technologies</li>
                  <li>Tech Trends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//  Skeleton UI Component
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
