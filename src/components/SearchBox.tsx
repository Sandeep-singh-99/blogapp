"use client";
import React, {  useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandDialog,
  CommandGroup,
} from "./ui/command";

interface Blog {
  title: string;
  slug: string;
}

interface Slug {
  slug: string;
}

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchBox({ isOpen, onClose }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Fetch default slugs using SWR
  const { data: defaultData } = useSWR(
    isOpen ? "/api/blogs/random-slugs" : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const defaultSlugs: Slug[] = defaultData?.slugs || [];

  // Fetch search results using SWR
  const { data: searchData, isValidating } = useSWR(
    query.length > 1 ? `/api/blogs/search?q=${query}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const results: Blog[] = searchData?.blogs || [];

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
          {isValidating ? (
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
                    onSelect={() => {
                      router.push(`/blog/${blog.slug}`);
                      onClose();
                    }}
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
