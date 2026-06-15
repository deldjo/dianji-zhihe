# 项目上下文

## 项目简介

**典籍智核·文脉探微** — 数字人文平台，为第十一届上海图书馆开放数据竞赛设计。

核心功能：整合历史人物传记、诗词、家谱等多源数据，通过 Multi-Agent + GraphRAG + 时空可视化，构建连接宏观历史与微观个体的关联叙事。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **AI 引擎**: coze-coding-dev-sdk (LLM Streaming)
- **可视化**: D3.js (力导向图) + Canvas (时空地图)
- **动画**: Framer Motion + CSS Animations

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/
│   │   ├── page.tsx        # 首页（粒子网络背景 + 搜索 + 朝代筛选）
│   │   ├── layout.tsx      # 全局布局（深色主题）
│   │   ├── globals.css     # 设计系统变量与动画
│   │   ├── figure/[id]/
│   │   │   └── page.tsx    # 人物详情页（4标签页）
│   │   ├── qa/
│   │   │   └── page.tsx    # 智能问答页（SSE流式输出）
│   │   └── api/
│   │       ├── chat/route.ts       # GraphRAG 问答接口（SSE）
│   │       ├── analyze/route.ts    # Multi-Agent 人物分析接口（SSE）
│   │       └── figures/
│   │           ├── route.ts        # 人物列表接口
│   │           └── [id]/route.ts   # 人物详情数据接口
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── lib/
│   │   ├── utils.ts        # 通用工具函数
│   │   └── mock-data.ts    # 历史人物 Mock 数据
│   └── server.ts           # 自定义服务端入口
├── DESIGN.md               # 设计规范
├── AGENTS.md               # 本文件
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 核心页面

1. **首页** `/` — 全屏粒子网络动画背景，搜索框（呼吸光效），朝代快捷筛选，三大功能卡片入口
2. **人物详情** `/figure/[id]` — 四标签页：生平时间轴、关系网络力导向图、时空轨迹地图、诗词鉴赏
3. **智能问答** `/qa` — SSE 流式输出，GraphRAG 多跳推理，推荐问题

## API 接口

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/figures` | GET | 人物列表，支持 dynasty/q 查询参数 |
| `/api/figures/[id]` | GET | 人物详情（含关系、时间线、诗词、轨迹） |
| `/api/chat` | POST | 智能问答，SSE 流式返回，body: { message } |
| `/api/analyze` | POST | Multi-Agent 人物分析，SSE 流式返回，body: { figureId } |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值、解构项应有明确类型

### 设计规范

- 深色主题：背景 `#0f172a`，卡片 `#1e293b`
- 主色：深靛蓝 `#1e3a5f`，强调色：琥珀金 `#d97706`，科技色：青色 `#06b6d4`
- 标题必须用衬线字体 `Noto Serif SC`
- 页面需有至少一个动态元素
- 参见 `DESIGN.md` 获取完整设计规范

### Hydration 问题防范

- 严禁在 JSX 渲染逻辑中直接使用 `typeof window`、`Date.now()`、`Math.random()`
- 必须使用 `use client` + `useEffect` + `useState` 确保动态内容仅在客户端渲染
