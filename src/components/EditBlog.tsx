"use client";
import React, { useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { showError, showSuccess } from "@/utils/toast";
import MarkdownRenderer from "./MarkdownRenderer";

interface BlogData {
  _id?: string;
  title?: string;
  category?: string;
  tags?: string | string[];
  markdown?: string;
  thumbnailImage?: string;
  contentImage?: string;
}

const mdParser = new MarkdownIt();

export default function EditBlog({
  initialData = null,
}: {
  initialData?: BlogData | null;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags)
      ? initialData.tags.join(",")
      : initialData?.tags || ""
  );
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [contentMarkdown, setContentMarkdown] = useState(
    initialData?.markdown || ""
  );
  const [contentImages, setContentImages] = useState<File[]>([]);

  async function onImageUpload(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("upload_preset", "j6l66rqt");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djlnhwj6u/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) return data.secure_url;
      console.error("Cloudinary Error:", data);
      return "";
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  }

  // Handle Markdown Image Upload
  async function handleMarkdownImageUpload(file: File) {
    const url = await onImageUpload(file, "blogs");
    if (url) setContentImages((prev) => [...prev, file]);
    return url;
  }

  // Handle thumbnail upload
  function handleThumbnailUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.[0]) {
      setThumbnailImage(event.target.files[0]);
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !category || !tags || !contentMarkdown) {
      return alert("Please fill in all fields!");
    }

    let thumbnailUrl = initialData?.thumbnailImage || "";
    let contentImageUrl = "";

    if (thumbnailImage) {
      thumbnailUrl = await onImageUpload(thumbnailImage, "thumbnails");
    }
    if (contentImages.length > 0) {
      contentImageUrl = await onImageUpload(contentImages[0], "blogs");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("tags", tags); 
    formData.append("markdown", contentMarkdown);
    formData.append("content", contentMarkdown);
    formData.append("thumbnailImage", thumbnailUrl);
    formData.append("contentImage", contentImageUrl);

    try {
      let response;
      if (initialData?._id) {
        response = await fetch(`/api/blogs/${initialData._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Create new blog
        response = await fetch("/api/blogs", {
          method: "POST",
          body: formData,
        });
      }

      const responseData = await response.json();
      if (response.ok) {
        showSuccess({
          message: initialData
            ? "Blog updated successfully!"
            : "Blog published successfully!",
        });

        if (!initialData) {
          setTitle("");
          setCategory("");
          setTags("");
          setThumbnailImage(null);
          setContentMarkdown("");
          setContentImages([]);
        }
      } else {
        showError({ message: "Error: " + responseData.error });
      }
    } catch (error) {
      console.error("Error:", error);
      showError({ message: "Error: " + String(error) });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto shadow-2xl rounded-lg border-2 my-10">
      <h1 className="text-3xl font-bold">
        {initialData ? "✏️ Update Blog" : "📝 Create a New Blog"}
      </h1>

      {/* Blog Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-900 shadow-sm hover:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled hidden>
              Select a Category
            </option>
            <option value="Technology and Coding">Technology and Coding</option>
            <option value="Travel and Lifestyle">Travel and Lifestyle</option>
            <option value="Health and Fitness">Health and Fitness</option>
            <option value="Food and Recipes">Food and Recipes</option>
            <option value="Education and Learning">
              Education and Learning
            </option>
            <option value="Business and Finance">Business and Finance</option>
            <option value="Personal Development">Personal Development</option>
            <option value="Creative Arts">Creative Arts</option>
            <option value="Fashion and Beauty">Fashion and Beauty</option>
            <option value="Entertainment and Pop Culture">
              Entertainment and Pop Culture
            </option>
          </select>
          {/* Custom Arrow Icon */}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            ▼
          </span>
        </div>

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <label className="bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition">
            🖼 Upload Thumbnail
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailUpload}
            />
          </label>
          {(thumbnailImage || initialData?.thumbnailImage) && (
            <p className="text-green-500">✅ Thumbnail selected</p>
          )}
        </div>

        {/* Thumbnail Preview */}
        {(thumbnailImage || initialData?.thumbnailImage) && (
          <div className="relative w-48 h-48 border rounded-lg overflow-hidden shadow-md">
            <img
              src={
                thumbnailImage
                  ? URL.createObjectURL(thumbnailImage)
                  : initialData?.thumbnailImage || ""
              }
              alt="Thumbnail Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Markdown Editor */}
      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        {/* Markdown Editor */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg overflow-y-auto">
          <MdEditor
            style={{ width: "100%", height: "500px" }}
            onImageUpload={handleMarkdownImageUpload}
            value={contentMarkdown}
            onChange={({ text }) => setContentMarkdown(text)}
            renderHTML={(text) => mdParser.render(text)}
            view={{ menu: true, md: true, html: false }}
          />
        </div>

        {/* Live Preview */}
        <div className="w-full md:w-1/2 p-4 border-l border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg overflow-y-auto">
          <h2 className="text-xl font-bold mb-2  top-0 bg-gray-100 dark:bg-gray-900 z-10">
            👀 Live Preview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MarkdownRenderer markdown={contentMarkdown} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg"
      >
        {initialData ? "Update Blog" : "Publish Blog"}
      </button>
    </div>
  );
}
