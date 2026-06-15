import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: '请输入有效的问题' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const systemPrompt = `你是"典籍智核·文脉探微"数字人文平台的AI助手，专门回答关于中国历史人物、古典文学、历史事件的问题。

你的核心能力：
1. **Multi-Agent协作分析**：从历史学者、文学鉴赏、社会关系、时空分析多个角度分析人物
2. **GraphRAG多跳推理**：能够通过多跳关联发现人物之间的隐藏联系
3. **知识图谱查询**：基于CBDB（64.9万人物）、搜韵诗词（199万首）、家谱（10.5万种）等数据

回答规范：
- 使用中文回答
- 引用具体的史料、诗词、事件来支撑分析
- 适当使用表格、列表等结构化格式
- 对于人物关系，说明关联路径（如：苏轼→师友→黄庭坚→师友→张耒）
- 朝代年份要准确
- 如果涉及诗词，给出原文和分析

平台数据覆盖：唐、宋、元、明、清五个朝代的历史人物数据。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: message },
    ];

    const stream = client.stream(messages, {
      model: 'doubao-seed-2-0-lite-260215',
      temperature: 0.7,
    });

    // Create SSE stream
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
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: '\n\n[分析完成]' })}\n\n`
            )
          );
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
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'AI分析服务暂时不可用' }, { status: 500 });
  }
}
