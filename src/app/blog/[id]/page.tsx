import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div className="py-10">
      <div className="flex justify-center items-center">
        <div className="max-w-[750px] mx-5 space-y-2 md:space-y-6">
          <h1 className="md:text-[40px] text-[24px] font-[600] line-clamp-4">
            Digital Declutter : Cutting the Noise in a Hyperconnected World
          </h1>
          <p className="text-[#757575] font-[400]">4 Mins Read</p>

          <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center pt-5 md:pt-10">
            <div className="flex items-center gap-5">
              <Image
                src={"/assets/picture-profile.png"}
                alt=""
                width={42}
                height={42}
                quality={100}
              />
              <div>
                <h1>Sadneep Singh</h1>
                <p className="text-[#757575]">Author</p>
              </div>
            </div>
            <p className="text-[#757575]">Nov 29, 2024</p>
          </div>

          <Image
            src={"/assets/back.png"}
            alt="nac"
            width={350}
            height={100}
            layout="responsive"
          />

          <p>
            In today’s hyperconnected world, the lines between work, leisure,
            and rest have blurred significantly. Notifications, endless streams
            of content, and the need to always stay connected often create a
            digital noise that impacts mental well-being, focus, and
            productivity. This is where the concept of digital declutter comes
            into play.
          </p>

          <h1>What is Digital Declutter?</h1>

            <p>
                Digital declutter is the practice of minimizing digital distractions
                and interruptions to improve focus, productivity, and overall
                well-being. It involves reducing the time spent on digital devices,
                decluttering digital spaces, and creating intentional digital
                habits.
            </p>
        </div>
      </div>
    </div>
  );
}
