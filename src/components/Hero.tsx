import React from "react";

export default function Hero() {
  return (
    <div
      className="relative bg-contain bg-center h-96"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=600')",
      }}
    >
      <div className="absolute inset-0 bg-gray-100/5 opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4">
          Stay Ahead with the Latest in Tech & Development
        </h1>
        <p className="text-lg sm:text-xl">
          Insights, trends, and innovations in Web, Mobile, and Emerging Technologies.
        </p>
      </div>
    </div>
  );
}
