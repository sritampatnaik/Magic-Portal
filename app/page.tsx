"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Portals</h1>
        <p className="text-gray-500 mb-8"></p>
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
          className="inline-flex items-center justify-center rounded-md bg-black text-white px-5 py-3 text-sm font-medium hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating…" : "Create Whiteboard"}
        </button>
      </div>
    </main>
  );
}


