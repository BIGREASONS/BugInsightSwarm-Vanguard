"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LandingPage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [issueText, setIssueText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!issueText.trim()) {
      setError("Please describe the issue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/swarm/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl, issue_text: issueText }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data = await res.json();
      router.push(`/dashboard?job=${data.job_id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to start swarm: ${message}`);
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            All Systems Online
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Bug<span className="text-indigo-400">Insight</span> Swarm
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            AI-powered bug severity prediction and autonomous fix generation.
            Powered by CodeBERT&nbsp;&&nbsp;LangGraph.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Repo URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="repo-url"
                className="block text-sm font-medium text-zinc-300"
              >
                GitHub Repository URL
              </label>
              <button
                type="button"
                onClick={() => setRepoUrl("https://github.com/BIGREASONS/BugInsightSwarm-Vanguard")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Try Demo Repository
              </button>
            </div>
            <input
              id="repo-url"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub repository URL"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Issue Description */}
          <div className="space-y-2">
            <label
              htmlFor="issue-text"
              className="block text-sm font-medium text-zinc-300"
            >
              Issue Description
            </label>
            <textarea
              id="issue-text"
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="Users are reporting that they can log in without a valid password by passing special characters into the username field."
              rows={5}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-800 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Initializing Swarm…
              </span>
            ) : (
              "Initialize Swarm"
            )}
          </button>
        </form>

        {/* Footer badges */}
        <div className="flex flex-col items-center justify-center gap-6 mt-8">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Local CodeBERT
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Local Qwen 2.5 Coder
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              No External APIs
            </span>
          </div>
          <div className="text-center text-xs text-zinc-600 font-mono tracking-widest uppercase">
            Detect → Explain → Fix → Plan → PR
          </div>
        </div>
      </div>
    </main>
  );
}
