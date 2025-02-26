"use client";
import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) throw new Error(result.error);
    } catch (error) {}
  };

  const handleGithubSignIn = async () => {
    try {
      const result = await signIn("github", { callbackUrl: "/" });
      if (result?.error) throw new Error(result.error);
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[#1c2331] max-w-md w-full p-6 rounded-lg shadow-2xl text-center">
        <h2 className="text-white text-xl font-semibold mb-6">
          Sign in to your account
        </h2>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center bg-[#ff5055] text-white px-4 py-2 rounded-md w-full hover:bg-[#e04a50] transition"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="flex items-center justify-center bg-[#111111] text-white px-4 py-2 rounded-md w-full hover:bg-[#222222] transition"
          >
            <FaGithub className="mr-2" /> Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
