import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function BlogCard({ blog }) {
  return (
    <div
      className="relative max-w-[400px] h-[320px] bg-cover bg-center rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
      style={{ backgroundImage: `url(${blog.thumbnailImage})` }}
    >
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="absolute bottom-0 p-5 text-white w-full flex flex-col gap-3">
        {/* Blog Title */}
        <p className="line-clamp-3 text-lg font-semibold">{blog.title}</p>

        {/* Read More Button */}
        <button
          className="flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white font-medium px-5 py-2 rounded-lg backdrop-blur-md transition-all duration-300"
          onClick={() => (window.location.href = `/blog/${blog.slug}`)} 
        >
          Read More <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
