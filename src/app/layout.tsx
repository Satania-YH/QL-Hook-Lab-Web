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
