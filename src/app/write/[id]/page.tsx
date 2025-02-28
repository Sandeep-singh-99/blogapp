import EditBlog from "@/components/EditBlog";

interface PageParams {
  id: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getBlogData(id: string) {
  const res = await fetch(`${baseUrl}/api/blogs/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch blog data");
  }
  return res.json();
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const blogData = await getBlogData(id);

  return (
    <div>
      <EditBlog initialData={blogData} />
    </div>
  );
}
