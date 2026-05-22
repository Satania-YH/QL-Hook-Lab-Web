"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { AppProvider, useApp } from "@/context/AppContext";
import InputForm from "@/components/InputForm";
import HookGrid from "@/components/HookGrid";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import HistoryPanel from "@/components/HistoryPanel";

function HomeContent() {
  const { state, setView } = useApp();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.currentBatch && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.currentBatch]);

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-sm font-semibold text-apple-text">Hook Lab</div>
        <button
          onClick={() => setView("history")}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm text-apple-secondary shadow-sm ring-1 ring-black/10 transition-colors hover:text-apple-text"
        >
          <Clock className="h-4 w-4" />
          历史收藏
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24">
        {/* Input Section */}
        <section className="py-12 sm:py-20">
          <InputForm />
        </section>

        {/* Results Section */}
        <section ref={resultsRef} className="mt-4">
          {state.loading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {state.error && (
            <EmptyState
              variant={state.error.includes("API Key") ? "api-key-missing" : "error"}
              message={state.error}
            />
          )}

          {!state.loading && !state.error && !state.currentBatch && (
            <EmptyState variant="initial" />
          )}

          {!state.loading && !state.error && state.currentBatch && (
            <HookGrid hooks={state.currentBatch.hooks} />
          )}
        </section>
      </main>

      <HistoryPanel />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}
