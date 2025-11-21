"use client";

import { useState } from "react";
import { PortalsBackground } from "@/components/PortalsBackground";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000a2a] text-white">
      <PortalsBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Welcome to Portals
            </h1>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const res = await fetch("/api/rooms", { method: "POST" });
                  const json = await res.json();
                  if (json?.url) {
                    window.location.href = json.url;
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-wait disabled:opacity-60 md:w-auto"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Whiteboard"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


