"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import SearchBox from "./SearchBox";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

import { useSession } from "next-auth/react";

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-[#09090b] py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src={"/assets/logo.svg"}
            width={30}
            height={20}
            alt="logo image"
          />
          <Link
            href={"/"}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Blog App
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {session && (
            <div>
              <Link href="/write">
                <p className="text-gray-700 font-semibold dark:text-gray-300 hover:text-blue-600 transition">
                  Write Blog
                </p>
              </Link>
            </div>
          )}
          {/* <button
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            onClick={() => setIsSearchOpen(true)}
          >
            <FaSearch size={20} />
          </button> */}

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

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "dark" ? (
              <MdLightMode size={24} />
            ) : (
              <MdDarkMode size={24} />
            )}
          </button>

          {session ? (
            <Link href={"/auth/profile"}>
            <Image
              src={session.user?.image || '/assets/picture-profile.png'}
              alt="User Avatar"
              width={38}
              height={38}
              className="rounded-full hover:ring-2 hover:ring-blue-600 transition"
            />
          </Link>
          ) : (
            <Link
              href={"/auth/login"}
              className=" text-white font-[600] px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 hover:text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <SearchBox
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </nav>
  );
}
