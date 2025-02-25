"use client";
import React from "react";
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
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] bg-white dark:bg-gray-900">
        {/* Search Input */}
        <CommandInput placeholder="Search for articles, topics..." className="px-4 py-2 text-lg" />

        {/* Search Results */}
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>React</CommandItem>
            <CommandItem>Next.js</CommandItem>
            <CommandItem>Tailwind CSS</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
