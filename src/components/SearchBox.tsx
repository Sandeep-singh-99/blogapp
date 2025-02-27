"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandDialog,
  CommandGroup,
} from "./ui/command";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBox({ isOpen, onClose }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ title: string; slug: string }[]>([]);
  const [defaultSlugs, setDefaultSlugs] = useState<{ slug: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/blogs/random-slugs`)
        .then((res) => res.json())
        .then((data) => setDefaultSlugs(data.slugs))
        .catch((err) => console.error("Error fetching slugs:", err));
    }
  }, [isOpen]);

  // Debounced search function
  const fetchResults = useCallback((searchQuery: string) => {
    if (searchQuery.length > 1) {
      setLoading(true);
      fetch(`/api/blogs/search?q=${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setResults(data.blogs))
        .catch((err) => console.error("Error fetching search results:", err))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, fetchResults]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] bg-white dark:bg-gray-900">
        {/* Search Input */}
        <CommandInput
          placeholder="Search for articles, topics..."
          className="px-4 py-2 text-lg"
          value={query}
          onValueChange={setQuery}
        />

        {/* Search Results & Default Slugs */}
        <CommandList>
          {loading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : results.length > 0 ? (
            <CommandGroup heading="Search Results">
              {results.map((blog) => (
                <CommandItem
                  key={blog.slug}
                  onSelect={() => {
                    router.push(`/blog/${blog.slug}`);
                    onClose(); 
                  }}
                >
                  {blog.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Popular Blogs">
                {defaultSlugs.map((blog) => (
                  <CommandItem
                    key={blog.slug}
                    onSelect={() => router.push(`/blog/${blog.slug}`)}
                  >
                    {blog.slug}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
