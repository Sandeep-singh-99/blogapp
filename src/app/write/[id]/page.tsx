// app/write/[id]/page.tsx
import EditBlog from "@/components/EditBlog";

async function getBlogData(id: string) {
  const res = await fetch(`http://localhost:3000/api/blogs/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch blog data");
  }
  return res.json();
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blogData = await getBlogData(params.id);

  return (
    <div>
      <EditBlog initialData={blogData} />
    </div>
  );
}
