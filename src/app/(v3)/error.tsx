"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    if (error.message.includes("401")) {
      setTimeout(() => {
        router.push("/admin-dashboard"); // Redirect to login if unauthorized
      }, 3000);
    }
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-700">
      <h1 className="text-3xl font-bold">🚫 Access Denied (401)</h1>
      <p className="mt-2">You are not authorized to access this page.</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
