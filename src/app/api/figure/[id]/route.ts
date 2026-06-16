/**
 * 人物详情 API (by id) - 动态数据
 * 支持真实 API 调取，fallback 到 mock 数据
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  figures,
  figureTimelines,
  figurePoems,
  allTrajectories,
  relationships,
} from '@/lib/mock-data';
import { searchPersonByName } from '@/lib/cbdb/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const useReal = searchParams.get('real') === 'true';

  // 1. 先从 mock 数据找
  const mockFigure = figures.find((f) => f.id === id);

  // 2. 如果启用了真实数据，尝试从 CBDB 获取
  if (useReal && !mockFigure) {
    try {
      const cbdbResults = await searchPersonByName(id.replace(/-/g, ' '));
      if (cbdbResults.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'cbdb',
          data: {
            id: `cbdb-${cbdbResults[0].c_personid}`,
            name: cbdbResults[0].c_name,
            dynasty: cbdbResults[0].c_dynasty,
            birthYear: cbdbResults[0].c_birthyear,
            deathYear: cbdbResults[0].c_deathyear,
            bio: cbdbResults[0].c_notes,
            identity: [],
            tags: [],
            hasDetailedData: false,
          },
        });
      }
    } catch {
      // CBDB 查询失败，继续用 mock
    }
  }

  // 3. 返回 mock 数据作为兜底
  const figure = mockFigure || figures[0];
  const timeline = figureTimelines[figure.name] || figureTimelines['苏轼'] || [];
  const poems = figurePoems[figure.name] || [];
  const trajectory = allTrajectories[figure.name] || allTrajectories['苏轼'] || [];
  const rels = relationships.filter(
    (r) => r.source === figure.name || r.target === figure.name
  );

  return NextResponse.json({
    success: true,
    source: 'mock',
    data: {
      ...figure,
      timeline,
      poems,
      trajectory,
      relations: rels,
    },
  });
}
