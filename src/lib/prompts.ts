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
