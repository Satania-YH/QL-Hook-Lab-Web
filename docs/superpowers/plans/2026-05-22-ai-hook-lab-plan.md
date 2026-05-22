# AI Hook Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build AI Hook Lab — an AI-powered web app that generates 10 viral hooks for content creation, with platform/style selection, favorites, and history.

**Architecture:** Next.js 15 App Router with a single `/api/generate` POST route calling DeepSeek. React Context manages client state (current batch, favorites, history) persisted to localStorage. Components are server-rendered with client interactivity where needed.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 3, DeepSeek API (via openai SDK), lucide-react, no external state library.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "ai-hook-lab",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "openai": "^4.73.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

- [ ] **Step 2: Write next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 3: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#f5f5f7",
          text: "#1d1d1f",
          secondary: "#86868b",
          accent: "#0071e3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Write postcss.config.mjs**

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 6: Write .gitignore**

```
node_modules/
.next/
.env.local
out/
```

- [ ] **Step 7: Write src/styles/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f5f5f7;
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 8: Write src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI Hook Lab — 爆款开头生成器",
  description: "AI 一次性生成 10 个不同风格的爆款 hook，适配小红书、抖音、B站等多个平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-apple-bg text-apple-text">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Install dependencies**

```bash
cd c:/Users/14127/Desktop/Test && npm install
```

- [ ] **Step 10: Verify scaffold with build**

```bash
cd c:/Users/14127/Desktop/Test && npx next build
```

Expected: build succeeds (may have lint warnings but no errors).

- [ ] **Step 11: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with Tailwind"
```

---

### Task 2: Types, Constants, and Platform Labels

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Write src/lib/types.ts**

```ts
export type Platform = "xiaohongshu" | "douyin" | "bilibili" | "youtube" | "x";

export type ContentType = "video" | "article" | "ad" | "tutorial" | "opinion";

export interface HookItem {
  id: string;
  style: string;
  text: string;
  stars: number;
  reason: string;
  favorited: boolean;
}

export interface Batch {
  id: string;
  topic: string;
  platform: Platform;
  contentType: ContentType;
  hooks: HookItem[];
  createdAt: number;
}

export interface GenerateRequest {
  topic: string;
  platform: Platform;
  contentType: ContentType;
}

export interface GenerateResponse {
  hooks: HookItem[];
}

export type AppView = "main" | "history";

export const PLATFORM_LABELS: Record<Platform, string> = {
  xiaohongshu: "小红书",
  douyin: "抖音",
  bilibili: "B站",
  youtube: "YouTube",
  x: "X",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: "视频",
  article: "图文",
  ad: "产品广告",
  tutorial: "教程",
  opinion: "观点贴",
};

export const PLATFORMS: Platform[] = ["xiaohongshu", "douyin", "bilibili", "youtube", "x"];

export const CONTENT_TYPES: ContentType[] = ["video", "article", "ad", "tutorial", "opinion"];

export interface StyleDefinition {
  name: string;
  description: string;
}

export const STYLES: StyleDefinition[] = [
  { name: "悬念式", description: "制造信息缺口，让读者忍不住点进去" },
  { name: "反问式", description: "用问题勾起共鸣，引发思考" },
  { name: "数据式", description: "用具体数字建立信任感和冲击力" },
  { name: "痛点式", description: "直接命中目标受众的焦虑和需求" },
  { name: "对比式", description: "前后/好坏对比制造冲突感" },
  { name: "故事式", description: "一句话微型叙事开场，引人入胜" },
  { name: "恐吓式", description: "警示如果不行动会带来的后果" },
  { name: "承诺式", description: "承诺具体可实现的收益或改变" },
  { name: "猎奇式", description: "用反常识或冷知识引发好奇心" },
  { name: "共鸣式", description: "用情绪认同拉近距离" },
];

export const STORAGE_KEYS = {
  favorites: "ai-hook-lab-favorites",
  history: "ai-hook-lab-history",
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add types, constants, and platform labels"
```

---

### Task 3: System Prompt Builder

**Files:**
- Create: `src/lib/prompts.ts`

- [ ] **Step 1: Write src/lib/prompts.ts**

```ts
import type { Platform, ContentType } from "./types";
import { STYLES, PLATFORM_LABELS, CONTENT_TYPE_LABELS } from "./types";

const STYLE_LIST = STYLES.map((s, i) => `${i + 1}. ${s.name}：${s.description}`).join("\n");

export function buildSystemPrompt(): string {
  return `你是一个顶尖的爆款文案专家，擅长为各大内容平台撰写高点击率的开头 hook。

你会根据用户提供的【主题、平台、内容类型】，为以下 10 种风格分别写一条 hook：

${STYLE_LIST}

要求：
- 每条 hook 15-40 字
- 语言口语化、有冲击力、符合对应平台调性
- 不同风格的 hook 要有明显差异，不要重复

返回严格 JSON，不要带任何 markdown 标记：
{
  "hooks": [
    {
      "style": "悬念式",
      "text": "写了3年小红书，这条视频让我涨了10万粉...",
      "stars": 5,
      "reason": "用具体数据制造悬念，适合小红书信息流推荐的前三行"
    }
  ]
}`;
}

export function buildUserPrompt(
  topic: string,
  platform: Platform,
  contentType: ContentType
): string {
  const platformName = PLATFORM_LABELS[platform];
  const contentTypeName = CONTENT_TYPE_LABELS[contentType];
  return `主题：${topic}\n平台：${platformName}\n内容类型：${contentTypeName}\n\n请生成 10 条 hook。`;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add system prompt builder with 10 style definitions"
```

---

### Task 4: DeepSeek Client Wrapper

**Files:**
- Create: `src/lib/deepseek.ts`

- [ ] **Step 1: Write src/lib/deepseek.ts**

```ts
import OpenAI from "openai";
import type { GenerateResponse } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

export function getDeepSeekClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ baseURL: "https://api.deepseek.com", apiKey });
}

export async function generateHooks(
  topic: string,
  platform: Parameters<typeof buildUserPrompt>[1],
  contentType: Parameters<typeof buildUserPrompt>[2]
): Promise<GenerateResponse> {
  const client = getDeepSeekClient();

  if (!client) {
    throw new Error("API_KEY_MISSING");
  }

  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(topic, platform, contentType) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 3000,
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("EMPTY_RESPONSE");
  }

  const parsed = JSON.parse(raw) as { hooks: GenerateResponse["hooks"] };

  if (!parsed.hooks || !Array.isArray(parsed.hooks) || parsed.hooks.length === 0) {
    throw new Error("INVALID_RESPONSE");
  }

  return {
    hooks: parsed.hooks.map((hook, index) => ({
      id: crypto.randomUUID(),
      style: hook.style || `风格${index + 1}`,
      text: hook.text || "",
      stars: Math.min(5, Math.max(1, hook.stars || 3)),
      reason: hook.reason || "",
      favorited: false,
    })),
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add DeepSeek client wrapper with generateHooks"
```

---

### Task 5: useLocalStorage Hook

**Files:**
- Create: `src/hooks/useLocalStorage.ts`

- [ ] **Step 1: Write src/hooks/useLocalStorage.ts**

```ts
"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // If parse fails, keep initial value
    }
    setIsLoaded(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full or unavailable
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue, isLoaded] as const;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add useLocalStorage hook with SSR safety"
```

---

### Task 6: AppContext (State Management)

**Files:**
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: Write src/context/AppContext.tsx**

```tsx
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
        setHistory((prev) => [batch, ...prev].slice(0, 50)); // keep last 50 batches
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add AppContext with generate, favorites, and history state"
```

---

### Task 7: API Route — POST /api/generate

**Files:**
- Create: `src/app/api/generate/route.ts`

- [ ] **Step 1: Write src/app/api/generate/route.ts**

```ts
import { NextResponse } from "next/server";
import type { GenerateRequest } from "@/lib/types";
import { PLATFORMS, CONTENT_TYPES } from "@/lib/types";
import { generateHooks } from "@/lib/deepseek";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.topic || typeof body.topic !== "string" || body.topic.trim().length === 0) {
      return NextResponse.json({ error: "请输入主题" }, { status: 400 });
    }

    if (!PLATFORMS.includes(body.platform)) {
      return NextResponse.json({ error: "请选择有效的平台" }, { status: 400 });
    }

    if (!CONTENT_TYPES.includes(body.contentType)) {
      return NextResponse.json({ error: "请选择有效的内容类型" }, { status: 400 });
    }

    const result = await generateHooks(body.topic.trim(), body.platform, body.contentType);

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "API_KEY_MISSING") {
        return NextResponse.json(
          { error: "API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY" },
          { status: 401 }
        );
      }
    }
    console.error("Generate error:", error);
    return NextResponse.json({ error: "生成失败，请稍后重试" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add /api/generate POST route with validation and error handling"
```

---

### Task 8: EmptyState Component

**Files:**
- Create: `src/components/EmptyState.tsx`

- [ ] **Step 1: Write src/components/EmptyState.tsx**

```tsx
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  variant: "initial" | "api-key-missing" | "error";
  message?: string;
}

export default function EmptyState({ variant, message }: EmptyStateProps) {
  if (variant === "initial") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <Sparkles className="mx-auto h-10 w-10 text-apple-accent" />
        </div>
        <h2 className="text-xl font-semibold text-apple-text">准备好了吗？</h2>
        <p className="mt-2 max-w-sm text-sm text-apple-secondary">
          输入主题，选择平台和内容类型，AI 为你生成 10 个不同风格的爆款开头
        </p>
      </div>
    );
  }

  if (variant === "api-key-missing") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 rounded-2xl bg-red-50 p-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 text-lg font-bold">
            !
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-600">API Key 未配置</h2>
        <p className="mt-2 max-w-sm text-sm text-apple-secondary">
          请在项目根目录的 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">.env.local</code>{" "}
          文件中设置 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">DEEPSEEK_API_KEY</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 rounded-2xl bg-red-50 p-6">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 text-lg font-bold">
          !
        </div>
      </div>
      <h2 className="text-xl font-semibold text-apple-text">生成失败</h2>
      <p className="mt-2 max-w-sm text-sm text-apple-secondary">
        {message || "生成失败，请稍后重试"}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add EmptyState component for initial, error, and missing-key states"
```

---

### Task 9: SkeletonCard Component

**Files:**
- Create: `src/components/SkeletonCard.tsx`

- [ ] **Step 1: Write src/components/SkeletonCard.tsx**

```tsx
export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
      <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
      <div className="mb-3 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="h-4 w-2/3 rounded bg-gray-100" />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add SkeletonCard loading placeholder"
```

---

### Task 10: HookCard Component

**Files:**
- Create: `src/components/HookCard.tsx`

- [ ] **Step 1: Write src/components/HookCard.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add HookCard with copy, favorite, and star rating"
```

---

### Task 11: HookGrid Component

**Files:**
- Create: `src/components/HookGrid.tsx`

- [ ] **Step 1: Write src/components/HookGrid.tsx**

```tsx
import type { HookItem } from "@/lib/types";
import HookCard from "./HookCard";

interface HookGridProps {
  hooks: HookItem[];
}

export default function HookGrid({ hooks }: HookGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {hooks.map((hook, index) => (
        <HookCard key={hook.id} hook={hook} index={index} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add HookGrid with responsive 2-column layout"
```

---

### Task 12: InputForm Component

**Files:**
- Create: `src/components/InputForm.tsx`

- [ ] **Step 1: Write src/components/InputForm.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add InputForm with topic, platform, and content type selectors"
```

---

### Task 13: HistoryPanel Component

**Files:**
- Create: `src/components/HistoryPanel.tsx`

- [ ] **Step 1: Write src/components/HistoryPanel.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add HistoryPanel with history/favorites tabs and slide-out drawer"
```

---

### Task 14: Main Page — Wiring Everything Together

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write src/app/page.tsx**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles and build**

```bash
cd c:/Users/14127/Desktop/Test && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: wire main page with all components, provider, and auto-scroll"
```

---

### Task 15: Environment Configuration

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Write .env.local.example**

```
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
```

- [ ] **Step 2: Write actual .env.local**

```bash
echo "DEEPSEEK_API_KEY=your-key-here" > c:/Users/14127/Desktop/Test/.env.local
```

Note: the user must replace `your-key-here` with their actual DeepSeek API key.

- [ ] **Step 3: Commit**

```bash
git add .env.local.example && git commit -m "chore: add .env.local.example template"
```

---

### Task 16: Final Build Verification

- [ ] **Step 1: Run production build**

```bash
cd c:/Users/14127/Desktop/Test && npm run build
```

Expected: build succeeds with no errors. There may be lint warnings about unescaped entities in JSX — these are acceptable for Chinese text and can be suppressed if desired.

- [ ] **Step 2: Verify all files present**

```bash
cd c:/Users/14127/Desktop/Test && ls -la src/components/ src/context/ src/hooks/ src/lib/ src/app/api/generate/
```

Expected: all directories exist with their respective files.

- [ ] **Step 3: Verify git log**

```bash
cd c:/Users/14127/Desktop/Test && git log --oneline
```

Expected: clean commit history with all 15 commits.

- [ ] **Step 4: Commit any remaining changes**

```bash
git add -A && git commit -m "chore: final verification and cleanup"
```
