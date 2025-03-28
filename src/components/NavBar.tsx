"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Moon, NotebookPen, Sun } from "lucide-react";
import SearchBox from "./SearchBox";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

// ShadCN UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const {  setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-[#09090b] py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/logo.svg"
            width={30}
            height={20}
            alt="logo image"
          />
          <Link
            href="/"
            className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Blog App
          </Link>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {session && (
            <Link href="/write" className="flex items-center space-x-2">
              <NotebookPen/>
              <p className="text-gray-700 hidden lg:inline font-semibold dark:text-gray-300 hover:text-blue-600 transition">
                Write Blog
              </p>
            </Link>
          )}

          {/* Search Button */}
          <div className="relative group flex items-center">
            <button
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch size={20} />
            </button>
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2">
              Search
            </span>
          </div>

          {/* Theme Toggle with ShadCN UI */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile or Login */}
          {session ? (
            <Link href="/auth/profile">
              <Image
                src={session.user?.image || "/assets/picture-profile.png"}
                alt="User Avatar"
                width={38}
                height={38}
                className="rounded-full hover:ring-2 hover:ring-blue-600 transition"
              />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-white font-semibold px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Search Box Modal */}
      {isSearchOpen && (
        <SearchBox
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </nav>
  );
}
