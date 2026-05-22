"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Star } from "lucide-react";
import type { HookItem } from "@/lib/types";
import { useApp } from "@/context/AppContext";

interface HookCardProps {
  hook: HookItem;
  index: number;
}

export default function HookCard({ hook, index }: HookCardProps) {
  const [copied, setCopied] = useState(false);
  const { favorites, toggleFavorite } = useApp();

  const isFavorited = favorites.some((f) => f.id === hook.id);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hook.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API may fail in some contexts
    }
  }, [hook.text]);

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <span className="text-blue-400">#{index + 1}</span>
          {hook.style}
        </span>
      </div>

      <p className="mb-4 text-lg font-medium leading-relaxed text-apple-text">
        {hook.text}
      </p>

      <div className="mb-3 flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= hook.stars ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="mb-4 text-sm text-apple-secondary">{hook.reason}</p>

      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-apple-secondary transition-colors hover:bg-gray-100 hover:text-apple-text"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              复制
            </>
          )}
        </button>

        <button
          onClick={() => toggleFavorite(hook)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-100 ${
            isFavorited ? "text-amber-500" : "text-apple-secondary"
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${isFavorited ? "fill-current" : ""}`} />
          {isFavorited ? "已收藏" : "收藏"}
        </button>
      </div>
    </div>
  );
}
