// "use client";
// import React, { useState } from "react";
// import MdEditor from "react-markdown-editor-lite";
// import "react-markdown-editor-lite/lib/index.css";
// import MarkdownIt from "markdown-it";

// const mdParser = new MarkdownIt();

// function onImageUpload(file: any) {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (data) => {
//       resolve(data.target.result);
//     };
//     reader.readAsDataURL(file);
//   });
// }

// export default function Write() {
//   const [contentImage, setContentImage] = useState<string>("");
//   return (
//     <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold">📝 Create a New Blog</h1>

//       {/* Blog Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input
//           type="text"
//           name="title"
//           placeholder="Blog Title"
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="text"
//           name="tags"
//           placeholder="Tags (comma-separated)"
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-2"
//         />
//       </div>

//       {/* Image Upload Buttons */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
//           🖼 Upload Thumbnail Image
//         </button>
//       </div>

//       {/* Markdown Editor & Preview */}
//       <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden w-full">
//         <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
//           <p className="text-lg font-semibold text-gray-700">
//             Write Your Content
//           </p>
//         </div>
//         <MdEditor
//           style={{ width: "100%", height: "500px" }}
//           className="p-3"
//           onImageUpload={onImageUpload}
//           value={contentImage}
//           onChange={({ text }) => setContentImage(text)}
//           renderHTML={(text) => mdParser.render(text)}
//         />
//       </div>

//       {/* Submit Button */}
//       <button className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-all">
//         🚀 Publish Blog
//       </button>
//     </div>
//   );
// }



// "use client";
// import React, { useState } from "react";
// import MdEditor from "react-markdown-editor-lite";
// import "react-markdown-editor-lite/lib/index.css";
// import MarkdownIt from "markdown-it";

// const mdParser = new MarkdownIt();

// export default function Write() {
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [tags, setTags] = useState("");
//   const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
//   const [contentMarkdown, setContentMarkdown] = useState<string>("");
//   const [contentImages, setContentImages] = useState<File[]>([]);

//   // Function to upload an image to Cloudinary
//   async function onImageUpload(file: File, folder: string): Promise<string> {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("folder", folder);
//     formData.append("upload_preset", "j6l66rqt"); // Replace with actual preset

//     try {
//       const response = await fetch(
//         "https://api.cloudinary.com/v1_1/djlnhwj6u/image/upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();

//       if (data.secure_url) return data.secure_url;

//       console.error("Cloudinary Error:", data);
//       return "";
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       return "";
//     }
//   }

//   // Function to handle Markdown image uploads
//   async function handleMarkdownImageUpload(file: File) {
//     const url = await onImageUpload(file, "blogs");
//     if (url) setContentImages((prev) => [...prev, url]); 
//     return url;
//   }

//   // Function to handle thumbnail upload
//   function handleThumbnailUpload(event: React.ChangeEvent<HTMLInputElement>) {
//     if (event.target.files?.[0]) {
//       setThumbnailImage(event.target.files[0]);
//     }
//   }

//   // Function to submit the blog
//   const handleSubmit = async () => {
//     if (!title || !category || !tags || !contentMarkdown) {
//       return alert("Please fill in all fields!");
//     }

//     // let thumbnailUrl = "";
//     // if (thumbnailImage) {
//     //   thumbnailUrl = await onImageUpload(thumbnailImage, "thumbnails");
//     // }

//     const formData = new FormData()

//     formData.append("title", title)
//     formData.append("category", category)
//     formData.append("tags", tags)
//     formData.append("markdown", contentMarkdown)
//     formData.append("thumbnailImage", thumbnailImage as File)
//     formData.append("contentImage", contentImages as File)
   


//     // Send the blog data to the API
//     try {
//       const response = await fetch("/api/blogs", {
//         method: "POST",
//         body: formData,
//       });

//       const responseData = await response.json();

//       console.log("Response:", responseData);

//       if (response.ok) {
//         alert("Blog published successfully!");
//       } else {
//         const errorData = await response.json();
//         alert("Error: " + errorData.error);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold">📝 Create a New Blog</h1>

//       {/* Blog Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input
//           type="text"
//           name="title"
//           placeholder="Blog Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
//         />
//         <input
//           type="text"
//           name="tags"
//           placeholder="Tags (comma-separated)"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//           className="border p-3 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none col-span-1 md:col-span-2"
//         />
//       </div>

//       {/* Thumbnail Upload */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <label className="flex items-center gap-2 cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all">
//           🖼 Upload Thumbnail Image
//           <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
//         </label>
//         {thumbnailImage && (
//           <p className="text-green-600 font-semibold">✅ Thumbnail selected</p>
//         )}
//       </div>

//       {/* Markdown Editor & Preview */}
//       <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden w-full">
//         <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
//           <p className="text-lg font-semibold text-gray-700">Write Your Content</p>
//         </div>
//         <MdEditor
//           style={{ width: "100%", height: "500px" }}
//           className="p-3"
//           onImageUpload={handleMarkdownImageUpload} // Handles image upload inside Markdown
//           value={contentMarkdown}
//           onChange={({ text }) => setContentMarkdown(text)}
//           renderHTML={(text) => mdParser.render(text)}
//         />
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-all"
//       >
//         🚀 Publish Blog
//       </button>
//     </div>
//   );
// }



"use client";
import React, { useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { showError, showSuccess } from "@/utils/toast";

const mdParser = new MarkdownIt();

export default function Write() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [contentMarkdown, setContentMarkdown] = useState<string>("");
  const [contentImages, setContentImages] = useState<File[]>([]);

  // Upload an image to Cloudinary
  async function onImageUpload(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("upload_preset", "j6l66rqt"); // Replace with actual preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/djlnhwj6u/image/upload", {
        method: "POST",
        body: formData,
      });

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
    if (url) setContentImages((prev) => [...prev, file]); // Store file for API submission
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
  
    let thumbnailUrl = "";
    let contentImageUrl = "";
  
    // Upload thumbnail image
    if (thumbnailImage) {
      thumbnailUrl = await onImageUpload(thumbnailImage, "thumbnails");
    }
  
    // Upload content image (take the first image if multiple are uploaded)
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
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        showSuccess({message: "Blog published successfully!"});
      } else {
        alert("Error: " + responseData.error);
        showError({message: "Error: " + responseData.error});
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">📝 Create a New Blog</h1>

      {/* Blog Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-3 rounded-lg col-span-1 md:col-span-2"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="flex gap-4">
        <label className="bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer">
          🖼 Upload Thumbnail
          <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
        </label>
        {thumbnailImage && <p className="text-green-600">✅ Thumbnail selected</p>}
      </div>

      {/* Markdown Editor */}
      <MdEditor
        style={{ width: "100%", height: "500px" }}
        onImageUpload={handleMarkdownImageUpload}
        value={contentMarkdown}
        onChange={({ text }) => setContentMarkdown(text)}
        renderHTML={(text) => mdParser.render(text)}
      />

      {/* Submit Button */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-3 rounded-lg">
        🚀 Publish Blog
      </button>
    </div>
  );
}
