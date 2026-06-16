# 典籍智核·文脉探微

> 一个人物，一段历史，一种文明——用AI读懂数据里的人物命运

[![2026上海图书馆开放数据竞赛](https://img.shields.io/badge/Competition-2026%E4%B8%8A%E6%B5%B7%E5%9B%BE%E4%B9%A6%E9%A6%86-orange)](https://github.com/deldjo/dianji-zhihe)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

## 核心定位

**典籍智核·文脉探微**是面向数字人文研究者、公共图书馆和语文教师的 AI 增强数据平台。

核心目标：**用结构化数据 + AI 技术，激活古籍中的人物命运，让历史从孤立的文字变成可探索的关系网络。**

## 核心功能

| 功能 | 说明 |
|------|------|
| 🔍 **三源融合检索** | 同时查询 CBDB（64.9万人物）、上图古籍（130万+）、历史事件，自动去重 |
| 👤 **人物数字画像** | Multi-Agent 协作分析：生平轨迹、社会关系、文学风格、时空足迹 |
| 🕸️ **关系网络图谱** | D3.js 力导向图，可视化师友、亲属、政治、文学隐性关联 |
| 🗺️ **跨时代时空地图** | 历史轨迹叠加现代矢量地图，解决古今地名映射难题 |
| 💬 **GraphRAG 智能问答** | 自然语言多跳推理，例如"李白和苏轼的共同交集？" |

## 技术栈

- **前端框架**：Next.js 16 (App Router) + React 19 + TypeScript 5
- **UI组件**：shadcn/ui（基于 Radix UI） + Tailwind CSS 4
- **AI引擎**：LangGraph（Multi-Agent 协作） + GraphRAG（图检索增强生成） + SSE 流式输出
- **可视化**：D3.js（力导向关系图） + Leaflet/高德矢量地图 + Canvas 粒子动画
- **动画**：Framer Motion + CSS Animations

## 数据源

| 数据源 | 数据量 | 说明 |
|--------|--------|------|
| CBDB（中国历代人物传记数据库） | 64.9万人物 | 哈佛大学官方 API |
| 上海图书馆古籍联合目录 | 130万+ | 上图开放平台 REST API |
| 历史事件图谱 | 近现代事件 | 上图 SPARQL 端点 |
| 中文诗词 | 15.5万首 | chinese-poetry（MIT许可） |

## 界面预览

深蓝古籍美学 + 粒子星河背景 + 琥珀金强调色，沉浸式历史氛围。

详见 [DESIGN.md](DESIGN.md) 了解完整设计规范。

## 快速开始

```bash
# 克隆项目
git clone https://github.com/deldjo/dianji-zhihe.git
cd dianji-zhihe

# 安装依赖（必须使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

> 注意：必须使用 `pnpm` 作为包管理器。

## 赛道与荣誉

- 🏆 第十一届上海图书馆开放数据竞赛 — 参赛项目
- 🏆 2026"数据要素×"大赛浙江分赛丽水站 — 文化旅游赛道

## 开源许可

组件库部分遵循 MIT 许可。具体许可条款见各文件头部注释。

数据来源：
- CBDB © Harvard CBDB（哈佛大学官方开放 API）
- 上图古籍 © 上海图书馆（开放平台授权）
- 中文诗词 © chinese-poetry（MIT）
