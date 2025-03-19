import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CommentSection from "@/components/CommentSection";
import BookMarkBtn from "@/components/BookMarkBtn";
import Head from "next/head";
import { Share } from "lucide-react";
import LikeBtn from "@/components/LikeBtn";


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

  // Metadata for the blog
  const title = blogData.title;
  const imageUrl = blogData.thumbnailImage || "/default-image.jpg";
  const author = blogData.authorDetails.name;

  return (
    <>
      <Head>
        <title>{title} | My Blog</title>
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`${baseUrl}/blog/${id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:author" content={author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:creator" content={`@${author}`} />
      </Head>

      <article className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            {blogData.title}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <Image
              src={blogData.authorDetails.image}
              alt={blogData.authorDetails.name}
              width={40}
              height={40}
              className="object-cover w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold">
                {blogData.authorDetails.name}
              </h1>
              <time className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(blogData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
           
          </div>

          <div className="flex justify-between items-center mt-4 border rounded-md py-4 px-4">
            <LikeBtn id={id} />

            <div className="flex justify-center items-center gap-5">
              <BookMarkBtn id={id} />
              <Share />
            </div>
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
        <section className="dark:bg-gray-950 p-6 md:p-8 rounded-xl shadow-md prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer markdown={blogData.markdown} />
        </section>

        {/* Footer Metadata */}
        <footer className="mt-10 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap justify-start items-center gap-3">
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
        </footer>
        <div className="mt-10">
          <CommentSection BlogId={id} />
        </div>
      </article>
    </>
  );
}
