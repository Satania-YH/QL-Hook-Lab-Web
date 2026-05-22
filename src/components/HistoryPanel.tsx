"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Clock, Star, Trash2, Copy, Check } from "lucide-react";
import type { Batch } from "@/lib/types";
import { PLATFORM_LABELS, CONTENT_TYPE_LABELS } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function HistoryPanel() {
  const { state, history, favorites, setView, removeBatch } = useApp();
  const [activeTab, setActiveTab] = useState<"history" | "favorites">("history");
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isOpen = state.view === "history";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setView("main");
    },
    [isOpen, setView]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setView("main")} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl sm:max-w-lg">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-apple-text">历史与收藏</h2>
            <button
              onClick={() => setView("main")}
              className="rounded-lg p-1.5 text-apple-secondary transition-colors hover:bg-gray-100 hover:text-apple-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            <button
              onClick={() => setActiveTab("history")}
              className={`mr-6 border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "border-apple-accent text-apple-accent"
                  : "border-transparent text-apple-secondary hover:text-apple-text"
              }`}
            >
              <Clock className="mr-1.5 inline h-4 w-4" />
              历史
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === "favorites"
                  ? "border-apple-accent text-apple-accent"
                  : "border-transparent text-apple-secondary hover:text-apple-text"
              }`}
            >
              <Star className="mr-1.5 inline h-4 w-4" />
              收藏夹
              {favorites.length > 0 && (
                <span className="ml-1.5 rounded-full bg-apple-accent px-1.5 py-0.5 text-xs text-white">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeTab === "history" && history.length === 0 && (
              <p className="py-12 text-center text-sm text-apple-secondary">还没有生成记录</p>
            )}

            {activeTab === "history" &&
              history.map((batch: Batch) => (
                <div key={batch.id} className="mb-3 rounded-xl border border-gray-100 bg-gray-50">
                  <button
                    onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-apple-text">{batch.topic}</p>
                      <p className="mt-0.5 text-xs text-apple-secondary">
                        {PLATFORM_LABELS[batch.platform]} · {CONTENT_TYPE_LABELS[batch.contentType]} ·{" "}
                        {new Date(batch.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBatch(batch.id);
                      }}
                      className="rounded p-1 text-apple-secondary hover:bg-gray-200 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </button>

                  {expandedBatch === batch.id && (
                    <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                      {batch.hooks.map((hook) => (
                        <div key={hook.id} className="rounded-lg bg-white p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-medium text-blue-500">{hook.style}</span>
                              <p className="mt-1 text-apple-text">{hook.text}</p>
                            </div>
                            <button
                              onClick={() => handleCopy(hook.text, hook.id)}
                              className="flex-shrink-0 rounded p-1 text-apple-secondary hover:bg-gray-100"
                            >
                              {copiedId === hook.id ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {activeTab === "favorites" && favorites.length === 0 && (
              <p className="py-12 text-center text-sm text-apple-secondary">还没有收藏的 hook</p>
            )}

            {activeTab === "favorites" &&
              favorites.map((hook) => (
                <div key={hook.id} className="mb-3 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-blue-500">{hook.style}</span>
                      <p className="mt-1 text-sm text-apple-text">{hook.text}</p>
                      <p className="mt-1 text-xs text-apple-secondary">{hook.reason}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(hook.text, hook.id)}
                      className="flex-shrink-0 rounded p-1 text-apple-secondary hover:bg-gray-100"
                    >
                      {copiedId === hook.id ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
