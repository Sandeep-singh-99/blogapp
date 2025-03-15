"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { showError, showSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

function ProfileInfo() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
      showSuccess({ message: "Logged out successfully" });
    } catch (error) {
      showError({
        message:
          error instanceof Error
            ? error.message
            : "Request failed. Please try again.",
      });
    }
  };

  return (
    <div className="p-4">
      {session ? (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              src={session.user?.image || "/assets/picture-profile.png"}
              alt="User Avatar"
              width={48}
              height={48}
              quality={100}
              className="rounded-full w-12 h-12 sm:w-[62px] sm:h-[62px]"
            />
            <div className="overflow-hidden">
              <h2 className="text-white text-xl sm:text-2xl font-[500] font-serif truncate">
                {session.user?.name}
              </h2>
              <p className="text-white font-[400] text-sm sm:text-base truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => handleLogout()}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm sm:text-base w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white text-center">
          Please login to view your profile
        </p>
      )}
    </div>
  );
}

export default ProfileInfo;
