"use client";

import { useState } from "react";
import { PortalsBackground } from "@/components/PortalsBackground";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03030c] text-white">
      <PortalsBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70">
            Instant Room · Shared Whiteboard
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Portals
            </h1>
            <p className="text-base leading-relaxed text-white/70">
              Spin up a collaborative canvas in one tap. We orchestrate audio,
              video, and AI so your team can sketch, debate, and prototype in
              real time.
            </p>
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
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-wait disabled:opacity-60 md:w-auto"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Whiteboard"}
            </button>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              No download · Live in seconds
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


