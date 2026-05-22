# AI Hook Lab — 产品与架构设计

## 概述

AI Hook Lab 是一个 AI 文案辅助工具。用户输入主题、选择平台和内容类型，AI 一次性生成 10 个不同风格的爆款开头 hook。每个 hook 附带风格标签、吸引力星级和推荐理由。支持复制、收藏、查看历史，纯前端存储，可部署到 Vercel。

## 技术栈

| 层 | 选型 |
|---|------|
| 框架 | Next.js 15+ (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| AI 模型 | DeepSeek (chat/completions, OpenAI 兼容) |
| AI SDK | `openai` npm 包 (baseURL 指向 api.deepseek.com) |
| 图标 | lucide-react |
| 状态管理 | React Context + useReducer |
| 持久化 | localStorage |
| 部署 | Vercel |

## 文件结构

```
ai-hook-lab/
├── .env.local              # DEEPSEEK_API_KEY=sk-xxx
├── next.config.ts
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 全局布局，字体
│   │   ├── page.tsx          # 主页面
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts  # POST /api/generate
│   ├── components/
│   │   ├── InputForm.tsx     # 主题输入+平台/类型选择器
│   │   ├── HookCard.tsx      # 单张结果卡片
│   │   ├── HookGrid.tsx      # 10张卡片网格布局
│   │   ├── SkeletonCard.tsx  # 骨架屏
│   │   ├── HistoryPanel.tsx  # 历史/收藏侧边面板
│   │   └── EmptyState.tsx    # 空状态/错误提示
│   ├── context/
│   │   └── AppContext.tsx    # 全局状态：当前结果、收藏、历史
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── deepseek.ts      # DeepSeek client 封装
│   │   ├── prompts.ts       # System prompt & style 定义
│   │   └── types.ts         # Hook, Batch, Platform 等类型
│   └── styles/
│       └── globals.css
```

## 数据流

```
用户输入主题 + 选择平台/类型
        │
        ▼
  POST /api/generate
  { topic, platform, contentType }
        │
        ▼
  DeepSeek API (chat/completions)
  System Prompt + 用户参数 → 10 hooks JSON
        │
        ▼
  解析 JSON → HookItem[]
        │
        ▼
  返回前端 → AppContext 存储当前批次
        │
        ▼
  展示 HookGrid → 用户可复制 / 收藏
        │
        ▼
  收藏/历史写入 localStorage
```

## API 设计

### POST /api/generate

- 服务端从 `process.env.DEEPSEEK_API_KEY` 读取 key，前端不可见
- 使用 `openai` SDK，baseURL 设为 `https://api.deepseek.com`
- 无 API Key 时返回 `401 { error: "API Key 未配置" }`
- 超时 60s，生成失败返回 `500 { error: "生成失败，请稍后重试" }`

请求体：
```json
{
  "topic": "如何提高工作效率",
  "platform": "xiaohongshu",
  "contentType": "article"
}
```

响应体：
```json
{
  "hooks": [
    {
      "id": "uuid",
      "style": "悬念式",
      "text": "你绝对想不到……",
      "stars": 4,
      "reason": "制造了强烈的好奇缺口，适合小红书图文前三行露出"
    }
  ]
}
```

### 核心类型

```ts
type Platform = 'xiaohongshu' | 'douyin' | 'bilibili' | 'youtube' | 'x'
type ContentType = 'video' | 'article' | 'ad' | 'tutorial' | 'opinion'

interface HookItem {
  id: string
  style: string
  text: string
  stars: number  // 1-5
  reason: string
  favorited: boolean
}

interface Batch {
  id: string
  topic: string
  platform: Platform
  contentType: ContentType
  hooks: HookItem[]
  createdAt: number
}
```

## 10 种预设风格

| # | 风格 | 核心逻辑 |
|---|------|---------|
| 1 | 悬念式 | 制造信息缺口 |
| 2 | 反问式 | 用问题勾起共鸣 |
| 3 | 数据式 | 用具体数字建立信任感 |
| 4 | 痛点式 | 直接命中目标受众的焦虑 |
| 5 | 对比式 | 前后/好坏对比制造冲突 |
| 6 | 故事式 | 一句话微型叙事开场 |
| 7 | 恐吓式 | "如果不…就会…"的警示 |
| 8 | 承诺式 | "学会这X招，轻松…" |
| 9 | 猎奇式 | 反常识/冷知识引发好奇 |
| 10 | 共鸣式 | "你是不是也…"的情绪认同 |

## System Prompt 结构

```
你是爆款文案专家。
根据 [主题、平台、内容类型]，为以下 10 种风格各写一条 hook。
要求：每条 15-40 字，符合平台调性，口语化有冲击力。

返回严格 JSON，格式：
{
  "hooks": [
    {
      "style": "悬念式",
      "text": "...",
      "stars": 4,
      "reason": "制造了强烈的好奇缺口，适合小红书图文前三行露出"
    }
  ]
}
```

## UI 设计

### 配色（Apple 极简风格）

| 用途 | 色值 |
|------|------|
| 背景 | `#f5f5f7` |
| 卡片 | `#ffffff` |
| 主文字 | `#1d1d1f` |
| 次要文字 | `#86868b` |
| 强调色 | `#0071e3` |
| 风格标签 | 低饱和彩色 |

### 响应式

| 区域 | 桌面 | 手机 |
|------|------|------|
| 整体宽度 | max-w-4xl 居中 | 全宽 px-4 |
| Hook 卡片 | 2 列 5 行 | 单列堆叠 |
| 平台选择 | 横向 pills | 可横向滚动 |
| 历史面板 | 右侧滑出抽屉 | 全屏覆盖 |

### 空状态 & 错误

- **初始态**: 输入区居中 + 引导文案
- **加载态**: 10 张骨架屏卡片 + 闪烁动画
- **错误态 (无 Key)**: 提示「请在 .env.local 中配置 DEEPSEEK_API_KEY」
- **错误态 (调用失败)**: 提示「生成失败，请稍后重试」

## 交互细节

- **复制**: 点击 → 剪贴板写入 → 按钮变为 ✓ 已复制，1.5s 恢复
- **收藏**: ☆ → ★ 切换，同步 localStorage，无确认弹窗
- **选择器**: 单选，至少选一个平台+类型才能点生成，未选择时按钮置灰
- **生成中**: 按钮禁用 + "生成中..."，输入区不可编辑
- **完成**: 骨架屏替换为卡片，自动滚动到结果区
- **卡片 hover**: translateY(-2px) + 阴影加深，200ms transition
- **历史面板**: 点击遮罩或 Esc 关闭

## 本地存储

```
ai-hook-lab-favorites  →  HookItem[]
ai-hook-lab-history    →  Batch[]
```

JSON 序列化，id 使用 `crypto.randomUUID()`。

## 部署

1. 推送 GitHub
2. Vercel 导入项目，自动识别 Next.js
3. Settings → Environment Variables 填入 `DEEPSEEK_API_KEY`
4. 部署

## 不做（明确边界）

- 不做登录 / 用户系统 / 数据库
- 不做暗色模式切换
- 不做导出图片 / PDF
- 不做分享链接
- 不使用 framer-motion 等动画库，CSS transition 足够
- 不记录任何数据到服务端
