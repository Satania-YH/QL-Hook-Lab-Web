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
