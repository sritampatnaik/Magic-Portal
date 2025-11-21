"use client";

import { useState, useEffect } from "react";
import { PortalsBackground } from "@/components/PortalsBackground";

const ADMIN_PASSWORD = "portal22112025";

const DEFAULT_PROMPT = `Analyze the provided child-like sketch and accurately infer its shapes, layout, and visual intention.
Create a pixar style image inspired by this sketch. 
Avoid realism entirely; keep it abstract, dynamic, and artful.
High quality, gallery-level output.`;

const DEFAULT_TEMPLATE = `Using the selected child-like sketch as reference, {prompt}. Preserve the composition; amplify shapes and rhythm; use vibrant colors; painterly style; high quality.`;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current values from localStorage
    const storedPrompt = localStorage.getItem("image_generation_prompt");
    const storedTemplate = localStorage.getItem("image_generation_template");
    
    setPrompt(storedPrompt || DEFAULT_PROMPT);
    setTemplate(storedTemplate || DEFAULT_TEMPLATE);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleSave = () => {
    localStorage.setItem("image_generation_prompt", prompt);
    localStorage.setItem("image_generation_template", template);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    setTemplate(DEFAULT_TEMPLATE);
  };

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#000a2a] text-white">
        <PortalsBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200/20 bg-white/10 backdrop-blur px-8 py-10">
            <h1 className="text-3xl font-semibold tracking-tight text-center">
              Admin Access
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg border border-gray-200/30 bg-white/10 px-4 py-2 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Enter password"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000a2a] text-white">
      <PortalsBackground />
      <div className="relative z-10 min-h-screen px-6 py-16">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              Admin - Image Generation Prompt
            </h1>
            <p className="text-gray-300">
              Manage the placeholder image generation prompts used in the room page.
            </p>
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200/20 bg-white/10 backdrop-blur p-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                  Generate Button Prompt
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  This prompt is used when clicking the "Generate" button manually.
                </p>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-200/30 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono text-sm"
                  placeholder="Enter prompt..."
                />
              </div>

              <div>
                <label htmlFor="template" className="block text-sm font-medium mb-2">
                  Voice Tool Template
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Template used for voice-generated images. Use {"{prompt}"} as a placeholder for the user's spoken prompt.
                </p>
                <textarea
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200/30 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono text-sm"
                  placeholder="Enter template..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200/20">
              <button
                onClick={handleSave}
                className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Save to LocalStorage
              </button>
              <button
                onClick={handleReset}
                className="rounded-full border border-gray-200/30 bg-white/5 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Reset to Default
              </button>
              {saved && (
                <span className="text-sm text-green-400">✓ Saved successfully!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

