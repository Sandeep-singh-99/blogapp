'use client'
import { showError, showSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AdminLogin() {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        showError({ message: data.error });
      } else {
        router.push("/admin-dashboard/admin-portal")
        showSuccess({ message: data.message });
      }
    } catch (error) {
      showError({ message: error instanceof Error ? error.message : "Failed to login" });
    }
  }
  return (
    <div className="bg-black h-screen flex justify-center items-center">
      <div className="w-96 p-8 bg-gray-100 rounded-lg">
        <h1 className="text-2xl text-black font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
