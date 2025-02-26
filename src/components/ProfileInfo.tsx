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
      const res = await signOut({ redirect: false }); 
      router.push("/"); 
      showSuccess({ message: "Logged out successfully" });
    } catch (error) {
      showError({ message: "Failed to logout" });
    }
  };
  return (
    <div>
      {session ? (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src={session.user?.image || "/assets/picture-profile.png"}
              alt="User Avater"
              width={62}
              height={62}
              quality={100}
              className="rounded-full"
            />
            <div>
                <h2 className="text-white text-2xl font-[500] font-serif">{session.user?.name}</h2>
                <p className="text-white font-[400]">{session.user?.email}</p>
            </div>
          </div>
          <div>
            <button onClick={() => handleLogout()} className="bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white">Logout</button>
          </div>
        </div>
      ) : (
        <p>Please login to view your profile</p>
      )}
    </div>
  );
}

export default ProfileInfo;
