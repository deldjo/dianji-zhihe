import { NextRequest, NextResponse } from 'next/server';
import { figures, relationships } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dynasty = searchParams.get('dynasty');
  const query = searchParams.get('q');

  let result = figures;

  if (dynasty) {
    const dynastyMap: Record<string, string> = {
      tang: '唐',
      song: '宋',
      yuan: '元',
      ming: '明',
      qing: '清',
    };
    const dynastyName = dynastyMap[dynasty] || dynasty;
    result = result.filter((f) => f.dynasty.includes(dynastyName));
  }

  if (query) {
    result = result.filter(
      (f) =>
        f.name.includes(query) ||
        f.identity.some((i) => i.includes(query)) ||
        f.tags.some((t) => t.includes(query))
    );
  }

  return NextResponse.json({
    success: true,
    data: result.map((f) => ({
      id: f.id,
      name: f.name,
      dynasty: f.dynasty,
      identity: f.identity,
      birthYear: f.birthYear,
      deathYear: f.deathYear,
      tags: f.tags,
    })),
    total: result.length,
  });
}
