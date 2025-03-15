"use client";
import BlogCard from "@/components/BlogCard";
import Hero from "@/components/Hero";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import useSWR from "swr";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
};

const rowsPerPage = 6;

interface Blog {
  _id: string;
  category: string;
  title: string;
  authorDetails: { name: string } | string;
}

export default function BlogHome() {
  const [currentPage, setCurrentPage] = useState(1);
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

  if (!data) return <p className="text-gray-500">Loading...</p>;

  const blogData: Blog[] = data.allBlogs || [];
  const totalPages = Math.ceil(blogData.length / rowsPerPage);

  const currentData = blogData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <BlogSkeleton key={index} />
                )) // Show Skeletons
              : currentData.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
          </div>
        </div>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
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
