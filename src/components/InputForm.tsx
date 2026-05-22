"use client";

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import type { Platform, ContentType } from "@/lib/types";
import { PLATFORMS, CONTENT_TYPES, PLATFORM_LABELS, CONTENT_TYPE_LABELS } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function InputForm() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const { state, generate } = useApp();

  const canSubmit = topic.trim().length > 0 && platform !== null && contentType !== null && !state.loading;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !platform || !contentType) return;
    generate(topic.trim(), platform, contentType);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-apple-text sm:text-4xl">
          AI Hook Lab
        </h1>
        <p className="text-sm text-apple-secondary">
          一次生成 10 个爆款开头，让好内容从第一句开始
        </p>
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="输入你的主题，例如：如何提高工作效率"
          disabled={state.loading}
          className="w-full rounded-2xl border-0 bg-white px-5 py-4 text-base text-apple-text shadow-sm ring-1 ring-black/10 placeholder:text-apple-secondary focus:outline-none focus:ring-2 focus:ring-apple-accent disabled:opacity-50"
        />
      </div>

      {/* Platform Selection */}
      <div className="mb-4">
        <p className="mb-3 text-sm font-medium text-apple-text">选择平台</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p === platform ? null : p)}
              disabled={state.loading}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                p === platform
                  ? "bg-apple-accent text-white shadow-sm"
                  : "bg-white text-apple-secondary ring-1 ring-black/10 hover:bg-gray-50 hover:text-apple-text"
              } disabled:opacity-50`}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-apple-text">内容类型</p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct}
              type="button"
              onClick={() => setContentType(ct === contentType ? null : ct)}
              disabled={state.loading}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                ct === contentType
                  ? "bg-apple-accent text-white shadow-sm"
                  : "bg-white text-apple-secondary ring-1 ring-black/10 hover:bg-gray-50 hover:text-apple-text"
              } disabled:opacity-50`}
            >
              {CONTENT_TYPE_LABELS[ct]}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-full bg-apple-accent px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state.loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              生成 10 个 Hook
            </>
          )}
        </button>
      </div>
    </form>
  );
}
