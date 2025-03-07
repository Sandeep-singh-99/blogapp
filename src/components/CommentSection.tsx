"use client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import useSWR, { mutate } from "swr";

const FALLBACK_IMAGE = "/file.svg";

interface CommentSectionProps {
  BlogId: string;
}

interface Comment {
  _id: string;
  author: {
    name: string;
    image?: string;
  };
  comment: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function CommentSection({ BlogId }: CommentSectionProps) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const handleRefresh = () => {
    mutate(`/api/comments/${BlogId}`);
  }

  const { data, error } = useSWR(`/api/comments/${BlogId}`, fetcher, {
    revalidateOnFocus: true,
  })

  const loading = !data && !error;
  const comments = data?.comments;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${BlogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const responseData = await response.json();
      showSuccess({ message: responseData.message });
      setComment("");
      handleRefresh()
    } catch (error) {
      showError({
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 py-6 lg:py-12 rounded-lg antialiased">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Discussion Thread
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            12 comments
          </span>
        </div>

        {status === "loading" ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading session....
          </div>
        ) : !session ? (
          <div className="text-center py-4 text-gray-600 dark:text-gray-300">
            Please sign in to comment
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mb-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 transition-all duration-200"
          >
            <div className="mb-8">
              <textarea
                id="comment"
                rows={7}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 resize-none placeholder-gray-400 dark:placeholder-gray-500 "
                placeholder="Share your thoughts..."
                required
                disabled={isSubmitting || loading}
              />
            </div>
            <div className="flex justify-end">
              <button className="py-2 px-5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          { loading ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <svg
                className="animate-spin h-6 w-6 mx-auto text-indigo-600 dark:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            <span className="mt-2 block text-sm">Loading Comments....</span>
          </div>
          ) : comments.length > 0 ? (
            comments.map((comment: Comment) => (
              <article
                key={comment._id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition duration-200"
              >
                <div className="flex items-start space-x-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={comment.author.image}
                    alt={comment.author.name || "User"}
                    onError={(e) => {
                      console.log(`Image failed to load: ${comment.author.image}`);
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <time dateTime={comment.createdAt}>
                            {new Date(comment.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
