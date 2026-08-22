"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#FBF7EC",
          border: "1px solid var(--border)",
          color: "#0F172A",
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
      gap={8}
      offset={16}
    />
  );
}
