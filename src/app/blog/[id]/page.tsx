import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CommentSection from "@/components/CommentSection";
import BookMarkBtn from "@/components/BookMarkBtn";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getBlogData(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/blogs/${id}`);
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
    <article className="container mx-auto px-6 py-12 max-w-4xl">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
          {blogData.title}
        </h1>
        <div className="flex justify-between items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Image
              src={blogData.authorDetails.image}
              alt={blogData.authorDetails.name}
              width={40}
              height={40}
              className="object-cover w-10 h-10 rounded-full"
            />
            <h1 className="text-lg font-medium">
              {blogData.authorDetails.name}
            </h1>
          </div>
          <div>
            <BookMarkBtn id={id} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
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
          <time>
            {new Date(blogData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {/* Thumbnail Image */}

      {blogData.thumbnailImage && (
        <div className="relative mb-10 rounded-xl overflow-hidden shadow-lg max-w-[800px] mx-auto aspect-[2/1]">
          <Image
            src={blogData.thumbnailImage}
            alt={blogData.title || "Blog Thumbnail"}
            layout="fill" // Fill the container
            unoptimized
            quality={100}
            className="transition-transform duration-300 hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChgB3fKILGQAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      {/* Blog Content */}
      <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md prose prose-lg dark:prose-invert max-w-none">
        <MarkdownRenderer markdown={blogData.markdown} />
      </section>

      {/* Footer Metadata */}
      <footer className="mt-10 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-between items-center gap-3">
        <p>
          Last updated:{" "}
          <time>
            {new Date(blogData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
            Share
          </button>
        </div>
      </footer>
      <div className="mt-10">
        <CommentSection BlogId={id} />
      </div>
    </article>
  );
}
