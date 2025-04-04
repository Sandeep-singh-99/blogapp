"use client";
import { showError } from "@/utils/toast";
import React, { useCallback } from "react";
import { AiFillLike } from "react-icons/ai";
import useSWR, { mutate } from "swr";

interface LikeBtnProps {
  id: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url,);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

export default function LikeBtn({ id }: LikeBtnProps) {
    
  const { data, isLoading } = useSWR(
    `/api/likes/total-likes/${id}`,
    fetcher,
  );

  const totalLikes = data?.totalLikes ?? 0;

  const toggleLike = useCallback(async () => {
    try {
      const response = await fetch(`/api/likes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to toggle like");
      }

      
      mutate(`/api/likes/total-likes/${id}`, () => ({
        totalLikes: result.error ? totalLikes - 1 : totalLikes + 1,
      }), false);

      // showSuccess({ message: result.message || result.error });
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }, [id, totalLikes]);

 

  return (
    <button
      className="flex items-center justify-center gap-2 hover:text-blue-500 transition-colors"
      onClick={toggleLike}
      disabled={isLoading}
      aria-label={`Like button, ${totalLikes} likes`}
    >
      <AiFillLike size={24} />
      <span>{totalLikes}</span>
    </button>
  );
}



