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
