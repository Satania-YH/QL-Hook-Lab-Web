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
