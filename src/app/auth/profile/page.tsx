import BlogGraph from "@/components/BlogGraph";
import ProfileAllBlog from "@/components/ProfileAllBlog";
import ProfileInfo from "@/components/ProfileInfo";
import React from "react";

export default async function Profile() {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-4 sm:py-5 md:py-10 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-gray-900 dark:text-white">
          Profile
        </h1>
        <div className="bg-gray-300 dark:bg-gray-700 w-full h-0.5 my-4 sm:my-6" />

        {/* Profile Info Card */}
        <div className="relative mb-6 sm:mb-8 bg-gradient-to-br from-[#1e1e2f] via-[#282a3a] to-[#1c1e27] dark:from-[#1a1c23] dark:via-[#20222e] dark:to-[#181920] shadow-lg border border-[#6e56cf] dark:border-[#5a4acc] p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-[#8b72ff]">
          <div className="absolute -top-6 -right-6 w-12 h-12 sm:w-16 sm:h-16 bg-[#8b72ff] blur-3xl opacity-40 rounded-full animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 sm:w-16 sm:h-16 bg-[#ff72d2] blur-3xl opacity-30 rounded-full animate-pulse" />

          <ProfileInfo />

          <div className="w-full h-0.5 mt-6 bg-gradient-to-r from-[#8b72ff] via-[#ff72d2] to-[#ff8e72] rounded-full" />
        </div>

        {/* All Blogs Section */}
        <h2 className="text-xl sm:text-2xl font-semibold font-serif text-gray-900 dark:text-white mb-2">
          All Blogs
        </h2>
        <div className="bg-gray-300 dark:bg-gray-700 w-full h-0.5 my-4 sm:my-6" />
        <div className="mb-6 sm:mb-8">
          <ProfileAllBlog />
        </div>

        {/* Graphs Section */}
        <h2 className="text-xl sm:text-2xl font-semibold font-serif text-gray-900 dark:text-white mb-2">
          Graphs
        </h2>
        <div className="bg-gray-300 dark:bg-gray-700 w-full h-0.5 my-4 sm:my-6" />
        <div>
          <BlogGraph />
        </div>
      </div>
    </div>
  );
}
