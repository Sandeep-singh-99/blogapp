"use client";
import React, { useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { showError, showSuccess } from "@/utils/toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { X } from "lucide-react";

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
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState<string>("");
  const [contentImages, setContentImages] = useState<File[]>([]);
  const [showThumbnailOptions, setShowThumbnailOptions] = useState(false);

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
      setThumbnailUrlInput("");
      setShowThumbnailOptions(false);
    }
  }

  const handleSubmit = async () => {
    if (!title) return showError({ message: "Title is required!" });
    if (!category) return showError({ message: "Category is required!" });
    if (!tags) return showError({ message: "Tags are required!" });
    if (!contentMarkdown) return showError({ message: "Content is required!" });
    if (!thumbnailImage && !thumbnailUrlInput)
      return showError({ message: "Thumbnail (file or URL) is required!" });

    let thumbnailUrl = "";
    let contentImageUrl = "";

    if (thumbnailImage) {
      thumbnailUrl = await onImageUpload(thumbnailImage, "thumbnails");
    } else if (thumbnailUrlInput) {
      thumbnailUrl = thumbnailUrlInput;
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
        setThumbnailUrlInput("");
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

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-900 shadow-sm hover:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled hidden>
              Select a Category
            </option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App Development">
              Mobile App Development
            </option>
            <option value="Software Development">Software Development</option>
            <option value="Cybersecurity and Privacy">
              Cybersecurity and Privacy
            </option>
            <option value="Artificial Intelligence and Machine Learning">
              Artificial Intelligence and Machine Learning
            </option>
            <option value="Data Science and Analytics">
              Data Science and Analytics
            </option>
            <option value="Personal Development">Personal Development</option>
            <option value="Internet of Things (IoT)">
              Internet of Things (IoT)
            </option>
            <option value="Augmented Reality and Virtual Reality">
              Augmented Reality and Virtual Reality
            </option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            ▼
          </span>
        </div>

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-3 rounded-lg bg-transparent dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Thumbnail Upload or URL */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <button
            onClick={() => setShowThumbnailOptions(!showThumbnailOptions)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            🖼 Upload Thumbnail
          </button>

          {/* Thumbnail Options Menu */}
          {showThumbnailOptions && (
            <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
              <div className="p-2">
                <label className="block text-sm text-gray-900 dark:text-gray-100 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-900 dark:text-gray-100"
                  onChange={handleThumbnailUpload}
                />
              </div>
              <div className="p-2">
                <label className="block text-sm text-gray-900 dark:text-gray-100 mb-1">
                  Add URL
                </label>
                <input
                  type="text"
                  placeholder="Enter Thumbnail URL"
                  value={thumbnailUrlInput}
                  onChange={(e) => {
                    setThumbnailUrlInput(e.target.value);
                    setThumbnailImage(null);
                    setShowThumbnailOptions(false);
                  }}
                  className="w-full border p-2 rounded-lg bg-transparent dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {(thumbnailImage || thumbnailUrlInput) && (
            <p className="mt-2 text-green-500">✅ Thumbnail selected</p>
          )}
        </div>

        {/* Thumbnail Preview */}
        {(thumbnailImage || thumbnailUrlInput) && (
          <div className="relative w-48 h-48 border rounded-lg overflow-hidden shadow-md">
            <img
              src={
                thumbnailImage
                  ? URL.createObjectURL(thumbnailImage)
                  : thumbnailUrlInput
              }
              alt="Thumbnail Preview"
              className="w-full h-full object-cover"
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/150")
              }
            />
            <button
              onClick={() => {
                setThumbnailImage(null);
                setThumbnailUrlInput("");
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              title="Remove Thumbnail"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Markdown Editor & Preview */}
      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg overflow-y-auto">
          <MdEditor
            style={{ width: "100%", height: "100%" }}
            onImageUpload={handleMarkdownImageUpload}
            value={contentMarkdown}
            onChange={({ text }) => setContentMarkdown(text)}
            renderHTML={(text) => mdParser.render(text)}
            view={{ menu: true, md: true, html: false }}
          />
        </div>

        <div className="w-full md:w-1/2 p-4 border-l border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg overflow-y-auto">
          <h2 className="text-xl font-bold mb-2 top-0 bg-gray-100 dark:bg-gray-900 z-10">
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
