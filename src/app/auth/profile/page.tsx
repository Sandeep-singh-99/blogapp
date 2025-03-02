import BlogGraph from "@/components/BlogGraph";
import ProfileAllBlog from "@/components/ProfileAllBlog";
import ProfileInfo from "@/components/ProfileInfo";
import React from "react";


export default async function Profile() {
 
  return (
    <div className="px-6 md:px-12 py-5 md:py-10">
      <div>
        <h1 className="text-3xl font-semibold font-serif">Profile</h1>
        <div className="bg-gray-400 dark:bg-gray-800 w-full h-1 my-4"></div>

        <div className="relative bg-gradient-to-br mb-5 from-[#1e1e2f] via-[#282a3a] to-[#1c1e27] dark:from-[#1a1c23] dark:via-[#20222e] dark:to-[#181920] shadow-xl border border-[#6e56cf] dark:border-[#5a4acc] p-8 rounded-2xl transition-all hover:shadow-2xl hover:border-[#8b72ff]">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#8b72ff] blur-3xl opacity-40 rounded-full"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#ff72d2] blur-3xl opacity-30 rounded-full"></div>

          <ProfileInfo />

          <div className="w-full h-1 mt-6 bg-gradient-to-r from-[#8b72ff] via-[#ff72d2] to-[#ff8e72] rounded-full" />
        </div>

        {/* <h1 className="text-3xl font-semibold font-serif">All Blogs</h1> */}
        <div className="bg-gray-400 dark:bg-gray-800 w-full h-1 my-4"></div>
        <div className="mb-5">
          <ProfileAllBlog />
        </div>
        

        {/* <h1 className="text-3xl font-semibold font-serif">Graphs</h1> */}
        <div className="bg-gray-400 dark:bg-gray-800 w-full h-1 my-4"></div>
        <BlogGraph />

      </div>
    </div>
  );
}
