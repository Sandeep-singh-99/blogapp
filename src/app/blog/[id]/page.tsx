import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

const baseUrl = "http://localhost:3000";

async function getBlogData(id) {
  const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export default async function BlogView({ params }) {
  const { id } = params;
  const blogData = await getBlogData(id);

  if (!blogData || blogData.error) {
    return (
      <div className="container mx-auto p-4">
        <h1>Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1> Sandeep Singh</h1>
      <article key={blogData._id} className="mb-8 p-4 border-b">
        <h1 className="text-3xl font-bold mb-2">Title: {blogData.title}</h1>
        <p className="text-gray-600">Category: {blogData.category}</p>
        <Image src={blogData.thumbnailImage} alt={blogData.title} width={300} height={300}/>
        <div className="my-4">
        <ReactMarkdown
            components={{
              
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold my-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold my-4" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-bold my-4" {...props} />
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
        <p className="text-xs text-gray-400">
          Created on: {new Date(blogData.createdAt).toLocaleDateString()}
        </p>
      </article>
    </div>
  );
}
