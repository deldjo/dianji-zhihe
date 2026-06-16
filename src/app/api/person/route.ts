/**
 * 人物详情 API - 三源融合
 * CBDB 基础信息 + 上图古籍 + SPARQL 事件
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  searchPersonByName,
  getPersonRelations,
  getPersonLocations,
} from '@/lib/cbdb/client';
import {
  searchSHLIBPerson,
  searchSHLIBBooks,
  querySPARQLEvents,
  getCrossEraConnections,
} from '@/lib/shlib/client';

// 完整的融合人物画像
export interface PersonProfile {
  // 基础信息（来自 CBDB）
  id?: string;
  name: string;
  dynasty?: string;
  birthYear?: string;
  deathYear?: string;
  bio?: string;
  courtesyName?: string;
  pseudonym?: string;
  identity?: string[];

  // 上图古籍关联
  relatedBooks: Array<{
    title: string;
    author?: string;
    edition?: string;
  }>;

  // CBDB 关系网络
  relations: Array<{
    name: string;
    type: string;
    description: string;
  }>;

  // CBDB 时空轨迹
  trajectory: Array<{
    location: string;
    startYear?: string;
    endYear?: string;
  }>;

  // 跨时代连接
  crossEraConnections: Array<{
    ancientLocation: string;
    ancientYear?: number;
    connection: string;
    modernEvents: Array<{
      year?: number;
      location: string;
      description: string;
    }>;
  }>;

  // 数据来源
  sources: string[];

  // 是否真实数据
  hasRealData: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const id = searchParams.get('id') || '';

  if (!name.trim() && !id.trim()) {
    return NextResponse.json({ success: false, error: '参数错误' }, { status: 400 });
  }

  // 从 id 提取真实姓名（格式：cbdb-123 或 shlib-p-xxx）
  const personName = name || decodePersonName(id);

  try {
    // 并发拉取所有数据源
    const [cbdbPersons, shlibPersons, shlibBooks] = await Promise.allSettled([
      searchPersonByName(personName),
      searchSHLIBPerson(personName),
      searchSHLIBBooks(personName),
    ]);

    const cbdbData = cbdbPersons.status === 'fulfilled' ? cbdbPersons.value : [];
    const shlibData = shlibPersons.status === 'fulfilled' ? shlibPersons.value : [];
    const bookData = shlibBooks.status === 'fulfilled' ? shlibBooks.value : [];

    // 如果 CBDB 有数据，获取关系和地点
    let relations: Awaited<ReturnType<typeof getPersonRelations>> = [];
    let locations: Awaited<ReturnType<typeof getPersonLocations>> = [];

    if (cbdbData.length > 0) {
      const [rels, locs] = await Promise.all([
        getPersonRelations(cbdbData[0].c_personid),
        getPersonLocations(cbdbData[0].c_personid),
      ]);
      relations = rels;
      locations = locs;
    }

    // 获取跨时代连接
    let crossEraConnections: Awaited<ReturnType<typeof getCrossEraConnections>> = [];
    if (locations.length > 0) {
      const sparqlEvents = await querySPARQLEvents(
        personName,
        cbdbData[0]?.c_birthyear ? parseInt(cbdbData[0].c_birthyear) : undefined,
        cbdbData[0]?.c_deathyear ? parseInt(cbdbData[0].c_deathyear) : undefined
      );
      crossEraConnections = await getCrossEraConnections(locations, sparqlEvents);
    }

    // 构建融合画像
    const profile: PersonProfile = {
      name: personName,
      dynasty: cbdbData[0]?.c_dynasty || shlibData[0]?.dynasty || '未知',
      birthYear: cbdbData[0]?.c_birthyear,
      deathYear: cbdbData[0]?.c_deathyear,
      bio: cbdbData[0]?.c_notes,
      relatedBooks: bookData.slice(0, 10).map((b) => ({
        title: b.title,
        author: b.author,
        edition: b.edition,
      })),
      relations: relations.slice(0, 20).map((r) => ({
        name: r.c_name,
        type: r.c_rel_type || '关系',
        description: r.c_rel_desc || '',
      })),
      trajectory: locations.slice(0, 30).map((l) => ({
        location: l.c_name || '',
        startYear: l.c_start_year,
        endYear: l.c_end_year,
      })),
      crossEraConnections,
      sources: [
        ...(cbdbData.length > 0 ? ['CBDB哈佛'] : []),
        ...(shlibData.length > 0 ? ['上图人物'] : []),
        ...(bookData.length > 0 ? ['上图古籍'] : []),
      ],
      hasRealData: cbdbData.length > 0 || shlibData.length > 0 || bookData.length > 0,
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('人物详情获取失败:', error);
    return NextResponse.json(
      { success: false, error: '获取人物详情失败' },
      { status: 500 }
    );
  }
}

// 从 ID 解码姓名
function decodePersonName(id: string): string {
  // id 格式可能是 cbdb-123 或 shlib-p-xxx
  // 这里简化处理，实际从 CBDB 接口获取
  return decodeURIComponent(id.replace(/^(cbdb|shlib).*?-/, ''));
}
