import BlogCard from "@/components/BlogCard";
import React from "react";

export default function BlogHome() {
  return (
    <div className="container mx-auto px-4 pb-10">
      <div className="flex flex-col justify-center items-center mt-6 sm:mt-10 px-4 text-center">
        <h1 className="text-[#212121] dark:text-white text-lg sm:text-2xl md:text-4xl font-bold leading-snug">
          Stay Ahead with the Latest in Tech & Development
        </h1>
        <p className="text-[#4F5563] dark:text-gray-300 text-sm sm:text-base md:text-lg font-serif mt-2 sm:mt-3 max-w-2xl">
          Insights, trends, and innovations in Web, Mobile, and Emerging
          Technologies.
        </p>
      </div>

      <div className="flex justify-evenly items-center md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </div>
    </div>
  );
}
