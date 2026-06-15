import { NextRequest, NextResponse } from 'next/server';
import {
  figures,
  relationships,
  figureTimelines,
  figurePoems,
  allTrajectories,
} from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const figure = figures.find((f) => f.id === id);

  if (!figure) {
    return NextResponse.json({ error: '未找到该人物' }, { status: 404 });
  }

  const figureRelations = relationships.filter(
    (r) => r.source === figure.name || r.target === figure.name
  );

  const timeline = figureTimelines[figure.name] || figureTimelines['苏轼'] || [];
  const poems = figurePoems[figure.name] || [];
  const trajectory = allTrajectories[figure.name] || allTrajectories['苏轼'] || [];

  return NextResponse.json({
    success: true,
    data: {
      figure,
      relations: figureRelations,
      timeline,
      poems,
      trajectory,
    },
  });
}
