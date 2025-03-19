"use client";

import useSWR, { mutate } from "swr";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { showError, showSuccess } from "@/utils/toast";
import { useState } from "react";

interface BookMarkBtnProps {
  id: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BookMarkBtn({ id }: BookMarkBtnProps) {
  const { data, error } = useSWR(`/api/bookmark/${id}`, fetcher);
  const [loading, setLoading] = useState(false);
  const isBookmarked = data?.isBookmarked || false;

  if (error)
    return (
      <p className="text-red-500 text-sm">Error loading bookmark status</p>
    );

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/bookmark/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to update bookmark");

      showSuccess({ message: data.message });

      mutate(`/api/bookmark/${id}`, { isBookmarked: !isBookmarked }, false);
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      title={isBookmarked ? "Bookmark" : "Unbookmark"}
    >
      {isBookmarked ? (
        <FaBookmark size={24} className="text-yellow-500" />
      ) : (
        <FaRegBookmark size={24}/>
      )}
    </button>
  );
}
