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
    <nav className="bg-white dark:bg-gray-900 py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src={"/assets/logo.svg"}
            width={30}
            height={20}
            alt="logo image"
          />
          <Link href={"/"} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Blog App
          </Link>
        </div>

        <div className="flex items-center space-x-4">

          {
            session ? (
              <div>
                <Link href="/admin-dashboard">
                  <p className="text-black dark:text-gray-300 dark:bg-blue-500 p-2 rounded-lg hover:text-white hover:bg-blue-700 transition">
                    Write Own Blog
                  </p>
                </Link>
              </div>
            ) : (
              <p></p>
            )
          }
          <button
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            onClick={() => setIsSearchOpen(true)}
          >
            <FaSearch size={20} />
          </button>

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

          {
            session ? (
              <Link href={"/auth/profile"}>
                <Image src={session.user?.image || '/assets/picture-profile.png'} alt="User Avater" width={32} height={32} className="rounded-full"/>
              </Link>
            ) : (
              <Link href={"/auth/login"} className=" text-black dark:text-white font-[600] px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 hover:text-white transition">
              Login
            </Link>
            )
          }
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
