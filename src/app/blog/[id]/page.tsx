import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getBlogData(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

interface BlogViewProps {
  params: Promise<{ id: string }>;
}

export default async function BlogView({ params }: BlogViewProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const blogData = await getBlogData(id);

  if (!blogData) return notFound();

  return (
    <article className="container mx-auto px-6 py-12 max-w-3xl">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          {blogData.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4 text-sm">
          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-md">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            {blogData.category}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(blogData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Thumbnail Image */}
      {blogData.thumbnailImage && (
        <div className="relative mb-10 rounded-xl overflow-hidden shadow-xl">
          <Image
            src={blogData.thumbnailImage}
            alt={blogData.title}
            width={800}
            height={400}
            className="object-cover w-full h-64 md:h-80 transition-transform duration-500 hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChgB3fKILGQAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      {/* Blog Content */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg prose prose-modern dark:prose-invert max-w-none">
        <MarkdownRenderer markdown={blogData.markdown} />
      </section>

      {/* Footer Metadata */}
      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <p>
          Last updated:{" "}
          {new Date(blogData.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Share
          </a>
          <a
            href="#"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Comment
          </a>
        </div>
      </footer>
    </article>
  );
}
