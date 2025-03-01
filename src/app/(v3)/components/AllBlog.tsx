import { showError } from '@/utils/toast';
import React from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) showError({ message: "Failed to fetch blogs" });
  return response.json();
};

export default function AllBlog() {
  const { data, error, isLoading, mutate } = useSWR(
    `${baseUrl}/api/blogs/all-blogs`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 600,
    }
  );

  if (error) {
    showError({ message: error.message });
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">Error loading blogs.</p>
        <button
          onClick={() => mutate()}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="mb-4">
        <CardTitle className="text-3xl font-bold text-center">All Blogs</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))
        ) : data?.allBlogs?.length > 0 ? (
          data.allBlogs.map((blog: any) => (
            <Card
              key={blog._id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className="flex space-x-4 items-center">
                <img
                  src={blog.thumbnailImage || "/default-avatar.png"}
                  alt={blog.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20"
                />
                <div>
                  <h3 className="text-xl font-semibold">{blog.title}</h3>
                  <p className="text-gray-500 line-clamp-2">{blog.description}</p>
                </div>
              </div>
              <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                View
              </button>
            </Card>
          ))
        ) : (
          <p className="text-red-600 text-lg font-semibold text-center">No blogs found.</p>
        )}
      </CardContent>
    </Card>
  );
}
