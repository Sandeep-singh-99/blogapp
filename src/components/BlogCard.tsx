import Image from "next/image";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function BlogCard() {
  return (
    <div>
      <div className="bg-white max-w-[400px] dark:bg-[#212121] rounded-lg shadow-lg pb-5">
        <Image
          src="/assets/back.png"
          alt="blog1"
          width={400}
          height={300}
          quality={100}
          className="rounded-t-lg"
        />
        <div className="flex flex-col space-y-5 px-5">
          <div className="flex flex-row space-x-3 items-center mt-5">
            <Image
              src={"/assets/picture-profile.png"}
              alt="profile"
              width={32}
              height={32}
              quality={100}
            />

            <h1 className="text=[14sm] text-[#212121] dark:text-white font-[500]">
              Sandeep Singh
            </h1>
            <p className="text=[14sm] text-[#9A9A9A] font-[500]">2 days ago</p>
          </div>

          <p className="line-clamp-3 text-[14px] text-[#212121] dark:text-white ">
            In today’s hyperconnected world, the lines between work, leisure,
            and rest have blurred significantly. Notifications, endless streams
            of content, and the need to always stay connected often create a
            digital noise that impacts mental well-being, focus, and
            productivity. This is where the concept of digital declutter comes
            into play.
          </p>

          <div className="">
            <button className="flex items-center text-center bg-[#F4F4F4] dark:text-black font-serif px-5 py-2">
              Read More <MdKeyboardArrowRight size={24} />{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
