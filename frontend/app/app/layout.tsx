"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/chrome/sidebar";
import { TopBar } from "@/components/chrome/top-bar";
import { KeyboardShortcuts } from "@/components/chrome/keyboard-shortcuts";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden bg-paper">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      <KeyboardShortcuts />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  );
}
