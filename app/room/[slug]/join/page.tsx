"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("😀");

  useEffect(() => {
    try {
      const prev = localStorage.getItem("cursor_user");
      if (prev) {
        const parsed = JSON.parse(prev);
        if (parsed?.name) setName(parsed.name);
        if (parsed?.avatar) setAvatar(parsed.avatar);
      }
    } catch {}
  }, [slug]);

  return (
    <main className="min-h-screen max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Choose your name</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <button
            onClick={() => {
              if (!name.trim()) return;
              const id = getOrCreateClientId();
              const user = { id, name: name.trim(), avatar };
              localStorage.setItem("cursor_user", JSON.stringify(user));
              router.push(`/room/${slug}`);
            }}
            className="rounded-md bg-black text-white px-5 py-3 text-sm font-medium hover:bg-black/85"
          >
            Enter room
          </button>
        </div>
      </div>
    </main>
  );
}

function getOrCreateClientId(): string {
  try {
    const key = "cursor_user_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}


