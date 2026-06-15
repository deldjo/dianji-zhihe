import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { figures, figureTimelines, figurePoems, relationships } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { figureId } = await request.json();

    const figure = figures.find((f) => f.id === figureId);
    if (!figure) {
      return NextResponse.json({ error: '未找到该人物' }, { status: 404 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // Build context from mock data
    const figureRelations = relationships.filter(
      (r) => r.source === figure.name || r.target === figure.name
    );
    const relationContext = figureRelations
      .map((r) => `${r.source} —[${r.type}]— ${r.target}: ${r.description}`)
      .join('\n');

    const timeline = figureTimelines[figure.name] || [];
    const timelineContext = timeline
      .map((e) => `${e.year}年（${e.age}岁）【${e.type}】${e.title}：${e.description}（${e.location || ''}）`)
      .join('\n');

    const poems = figurePoems[figure.name] || [];
    const poemContext = poems
      .map((p) => `《${p.title}》(${p.year ? p.year + '年' : ''}) ${p.tags.join('、')}`)
      .join('\n');

    const systemPrompt = `你是"典籍智核"的历史学者Agent，负责生成历史人物的多维数字画像报告。

请基于提供的人物数据，从以下四个维度生成详细的分析报告：

1. **生平轨迹分析**：关键转折点、仕途沉浮
2. **文学风格鉴赏**：核心风格特征、代表作品分析
3. **社会关系网络**：主要关系人、关系类型、影响
4. **时空活动特征**：活动范围、迁徙规律

报告格式要求：
- 使用Markdown格式
- 每个维度使用二级标题
- 关键信息使用**加粗**
- 适当使用引用块标注史料
- 总结部分使用表格概括`;

    const userPrompt = `请为以下历史人物生成多维数字画像：

## 基本信息
- 姓名：${figure.name}
- 字号：${figure.courtesyName ? '字' + figure.courtesyName : ''}${figure.pseudonym ? '，号' + figure.pseudonym : ''}
- 朝代：${figure.dynasty}
- 生卒：${figure.birthYear}-${figure.deathYear}
- 身份：${figure.identity.join('、')}
- 简介：${figure.bio}

## 生平时间轴
${timelineContext || '暂无时间轴数据'}

## 关系数据
${relationContext || '暂无关系数据'}

## 代表作品
${poemContext || '暂无诗词数据'}

## 标签
${figure.tags.join('、')}

请生成详细的多维数字画像报告。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ];

    const stream = client.stream(messages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.6,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              const data = JSON.stringify({ content: text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Analyze stream error:', error);
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: '分析服务暂时不可用' }, { status: 500 });
  }
}
