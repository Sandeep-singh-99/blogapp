import useSWR from "swr";
import { showError } from "@/utils/toast";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) showError({ message: "Failed to fetch users" });
  return response.json();
};

export default function AllUser() {
  const { data, error, isLoading, mutate } = useSWR(
    `${baseUrl}/api/auth/all-users`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60000,
    }
  );

  if (error) {
    showError({ message: error.message });
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">Error loading users.</p>
        <button
          onClick={() => mutate()} 
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-bold mb-4">All Registered Users</h2>
      <div className="space-y-4">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))
          : data?.allUsers?.length > 0 ? (
              data.allUsers.map((user) => (
                <Card className="flex justify-between items-center p-4" key={user._id}>
                  <div className="flex space-x-4 items-center">
                    <Image
                      src={user.image || "/default-avatar.png"} // Default image fallback
                      alt={user.name}
                      width={80}
                      height={80}
                      className="rounded-full border"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                    <div className="flex flex-col">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">Blogs Published: 5</p>
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                    Delete Account
                  </button>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No users found.</p>
            )}
      </div>
    </Card>
  );
}
