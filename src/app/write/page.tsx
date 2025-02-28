"use client";
import React, { useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { showError, showSuccess } from "@/utils/toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const mdParser = new MarkdownIt({
  highlight: function (code, lang) {
    if (lang && Prism.languages[lang]) {
      return `<pre class="language-${lang}"><code>${Prism.highlight(
        code,
        Prism.languages[lang],
        lang
      )}</code></pre>`;
    }
    return `<pre class="language-text"><code>${code}</code></pre>`;
  },
});

export default function Write() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [contentMarkdown, setContentMarkdown] = useState<string>("");
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

  async function handleMarkdownImageUpload(file: File) {
    const url = await onImageUpload(file, "blogs");
    if (url) setContentImages((prev) => [...prev, file]);
    return url;
  }

  function handleThumbnailUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.[0]) {
      setThumbnailImage(event.target.files[0]);
    }
  }

  const handleSubmit = async () => {
    if (!title) return showError({ message: "Title is required!" });
    if (!category) return showError({ message: "Category is required!" });
    if (!tags) return showError({ message: "Tags are required!" });
    if (!contentMarkdown) return showError({ message: "Content is required!" });
    if (!thumbnailImage)
      return showError({ message: "Thumbnail is required!" });

    let thumbnailUrl = "";
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
    formData.append(
      "contentImage",
      contentImageUrl || "https://your-default-image-url.com"
    );

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setTitle("");
        setCategory("");
        setTags("");
        setThumbnailImage(null);
        setContentMarkdown("");
        setContentImages([]);
        showSuccess({ message: "Blog published successfully!" });
      } else {
        showError({ message: "Error: " + responseData.error });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto shadow-lg rounded-lg border dark:border-gray-600 my-10 transition-all bg-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        📝 Create a New Blog
      </h1>

      {/* Blog Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Thumbnail Upload */}
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
        {thumbnailImage && (
          <p className="text-green-500">✅ Thumbnail selected</p>
        )}
      </div>

      {/* Markdown Editor & Preview */}
      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        {/* Markdown Editor */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg overflow-y-auto">
          <MdEditor
            style={{ width: "100%", height: "100%" }} // Changed to 100% to fill container
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
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        🚀 Publish Blog
      </button>
    </div>
  );
}
