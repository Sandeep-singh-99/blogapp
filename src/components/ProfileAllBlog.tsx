"use client";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Blog {
  _id: string;
  category: string;
  title: string;
  authorDetails: { name: string } | string;
}

const rowsPerPage = 3;

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function ProfileAllBlog() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();

  const { data, error } = useSWR("/api/blogs", fetcher, {
    dedupingInterval: 60000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    fallbackData: { blogs: [] },
  });

  if (error) {
    showError({ message: "Failed to fetch blogs" });
    return <p className="text-red-500">Error loading blogs...</p>;
  }

  if (!data) return <p className="text-gray-500">Loading...</p>;

  const blogData: Blog[] = data.blogs || [];
  const totalPages = Math.ceil(blogData.length / rowsPerPage);

  // Paginated Data
  const currentData = blogData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });

      if (response.ok) {
        mutate(
          "/api/blogs",
          async (cachedData) => {
            return {
              blogs: cachedData.blogs.filter((blog: Blog) => blog._id !== id),
            };
          },
          false
        ); 
        showSuccess({ message: "Blog deleted successfully" });
      } else {
        showError({ message: "Failed to delete blog" });
      }
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "Failed to Delete Data",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto shadow-lg p-6 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            <TableHead className="text-right">View Blog</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((blog) => (
            <TableRow key={blog._id}>
              <TableCell className="font-semibold">
                {typeof blog.authorDetails === "object" &&
                blog.authorDetails !== null
                  ? blog.authorDetails.name
                  : "Unknown"}
              </TableCell>
              <TableCell>{blog.category}</TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/write/${blog._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </Link>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </button>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/blog/${blog._id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
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
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}