"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: { background: "green" },
        },
        error: {
          style: { background: "red" },
        },
      }}
    />
  );
}
