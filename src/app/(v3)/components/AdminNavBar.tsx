"use client";

import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function AdminNavbar() {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <nav className="admin-navbar flex items-center justify-between px-6 py-4 shadow-lg border rounded-lg bg-background text-foreground">
      <Link href={"/"} className="text-xl font-bold">Admin Dashboard</Link>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition"
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
    </nav>
  );
}
