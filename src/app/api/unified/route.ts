/**
 * 统一检索 API
 * 并发查询 CBDB + 上图人物 + 上图古籍，三源去重融合
 */
import { NextRequest, NextResponse } from 'next/server';
import { searchPersonByName } from '@/lib/cbdb/client';
import { searchSHLIBPerson, searchSHLIBBooks } from '@/lib/shlib/client';

// 统一结果格式
export interface UnifiedResult {
  id: string;
  name: string;
  source: 'cbdb' | 'shlib-person' | 'shlib-book' | 'merged';
  dynasty?: string;
  type: 'person' | 'book';
  // 人物字段
  birthYear?: string;
  deathYear?: string;
  aliases?: string[];
  works?: string;
  bio?: string;
  // 古籍字段
  author?: string;
  edition?: string;
  category?: string;
  abstract?: string;
  // 来源标记
  sources: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('name') || '';
  const type = searchParams.get('type') || 'all'; // all | person | book
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query.trim()) {
    return NextResponse.json({ success: false, error: '查询词不能为空' }, { status: 400 });
  }

  try {
    const results: UnifiedResult[] = [];

    // 并发请求
    const [cbdbPersons, shlibPersons, shlibBooks] = await Promise.allSettled([
      type !== 'book' ? searchPersonByName(query) : Promise.resolve([]),
      type !== 'book' ? searchSHLIBPerson(query) : Promise.resolve([]),
      type !== 'person' ? searchSHLIBBooks(query) : Promise.resolve([]),
    ]);

    // 处理 CBDB 结果
    if (cbdbPersons.status === 'fulfilled') {
      for (const p of cbdbPersons.value) {
        results.push({
          id: `cbdb-${p.c_personid}`,
          name: p.c_name,
          source: 'cbdb',
          type: 'person',
          dynasty: p.c_dynasty,
          birthYear: p.c_birthyear,
          deathYear: p.c_deathyear,
          bio: p.c_notes,
          sources: ['CBDB哈佛'],
        });
      }
    }

    // 处理上图人物结果
    if (shlibPersons.status === 'fulfilled') {
      for (const p of shlibPersons.value) {
        // 去重：如果 CBDB 已有同名人物，标记为 merged
        const existing = results.find(
          (r) => r.name === p.name && r.type === 'person'
        );
        if (existing) {
          existing.sources.push('上图');
          existing.aliases = p.aliases;
          existing.works = p.works;
          existing.source = 'merged';
        } else {
          results.push({
            id: `shlib-p-${p.id}`,
            name: p.name,
            source: 'shlib-person',
            type: 'person',
            dynasty: p.dynasty,
            aliases: p.aliases,
            works: p.works,
            sources: ['上图'],
          });
        }
      }
    }

    // 处理上图古籍结果
    if (shlibBooks.status === 'fulfilled') {
      for (const b of shlibBooks.value) {
        results.push({
          id: `shlib-b-${b.id}`,
          name: b.title,
          source: 'shlib-book',
          type: 'book',
          author: b.author,
          dynasty: b.dynasty,
          edition: b.edition,
          category: b.category,
          abstract: b.abstract,
          sources: ['上图古籍'],
        });
      }
    }

    // 限制返回数量
    const finalResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      query,
      total: finalResults.length,
      data: finalResults,
    });
  } catch (error) {
    console.error('统一检索失败:', error);
    return NextResponse.json(
      { success: false, error: '检索服务暂时不可用' },
      { status: 500 }
    );
  }
}
