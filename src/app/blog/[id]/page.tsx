import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

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
  params: { id: string };
}

export default async function BlogView({ params }: BlogViewProps) {
  const blogData = await getBlogData(params.id);

  if (!blogData) return notFound();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold"> {blogData.title}</h1>
      <p className="text-gray-600 mb-2">Category: {blogData.category}</p>

      {/* Blog Thumbnail */}
      {blogData.thumbnailImage && (
        <Image
          src={blogData.thumbnailImage}
          alt={blogData.title}
          width={600}
          height={400}
          className="rounded-lg mb-4"
        />
      )}

      {/* Blog Content (Markdown) */}
      <div className="prose lg:prose-xl dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-bold" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-base my-2" {...props} />
            ),
            img: ({ node, ...props }) => (
              <img className="rounded-md" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-500 underline" {...props} />
            ),
          }}
        >
          {blogData.markdown}
        </ReactMarkdown>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Created on: {new Date(blogData.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
