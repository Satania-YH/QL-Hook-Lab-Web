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
