"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { Batch, HookItem, Platform, ContentType, GenerateResponse, AppView } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface AppState {
  currentBatch: Batch | null;
  loading: boolean;
  error: string | null;
  view: AppView;
}

type AppAction =
  | { type: "SET_LOADING" }
  | { type: "SET_RESULT"; payload: Batch }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_VIEW"; payload: AppView };

const initialAppState: AppState = {
  currentBatch: null,
  loading: false,
  error: null,
  view: "main",
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null, currentBatch: null };
    case "SET_RESULT":
      return { ...state, loading: false, error: null, currentBatch: action.payload };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload, currentBatch: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  history: Batch[];
  favorites: HookItem[];
  generate: (topic: string, platform: Platform, contentType: ContentType) => Promise<void>;
  toggleFavorite: (hook: HookItem) => void;
  setView: (view: AppView) => void;
  clearError: () => void;
  removeBatch: (batchId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [history, setHistory] = useLocalStorage<Batch[]>(STORAGE_KEYS.history, []);
  const [favorites, setFavorites] = useLocalStorage<HookItem[]>(STORAGE_KEYS.favorites, []);

  const generate = useCallback(
    async (topic: string, platform: Platform, contentType: ContentType) => {
      dispatch({ type: "SET_LOADING" });

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, platform, contentType }),
        });

        const data = await res.json();

        if (!res.ok) {
          dispatch({ type: "SET_ERROR", payload: data.error || "生成失败，请稍后重试" });
          return;
        }

        const hooks: HookItem[] = (data as GenerateResponse).hooks;
        const batch: Batch = {
          id: crypto.randomUUID(),
          topic,
          platform,
          contentType,
          hooks,
          createdAt: Date.now(),
        };

        dispatch({ type: "SET_RESULT", payload: batch });
        setHistory((prev) => [batch, ...prev].slice(0, 50));
      } catch {
        dispatch({ type: "SET_ERROR", payload: "网络请求失败，请检查网络连接" });
      }
    },
    [setHistory]
  );

  const toggleFavorite = useCallback(
    (hook: HookItem) => {
      setFavorites((prev) => {
        const exists = prev.find((f) => f.id === hook.id);
        if (exists) {
          return prev.filter((f) => f.id !== hook.id);
        }
        return [{ ...hook, favorited: true }, ...prev];
      });
    },
    [setFavorites]
  );

  const setView = useCallback((view: AppView) => {
    dispatch({ type: "SET_VIEW", payload: view });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const removeBatch = useCallback(
    (batchId: string) => {
      setHistory((prev) => prev.filter((b) => b.id !== batchId));
    },
    [setHistory]
  );

  const ctx: AppContextType = {
    state,
    history,
    favorites,
    generate,
    toggleFavorite,
    setView,
    clearError,
    removeBatch,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
