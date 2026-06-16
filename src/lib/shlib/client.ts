/**
 * 上海图书馆开放API客户端
 * https://data.library.sh.cn/
 * 
 * 已接入的API：
 * - 人物检索：/gj/webapi/instances（人物别名/字号）
 * - 古籍检索：/gj/webapi/instances（馆藏古籍）
 * - 生命事件 SPARQL：lifeevent 图谱
 * - CBDB SPARQL：哈佛CBDB镜像
 */

// 上图 API 基础 URL
const SHLIB_API = 'https://data.library.sh.cn';
const USER_AGENT = 'Ancient-Wisdom-App/1.0 (典籍智核/文脉探微)';

// 通用 fetch 包装
async function shFetch(path: string, params?: Record<string, string>) {
  const url = new URL(`${SHLIB_API}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json',
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

// 延迟函数（防限流）
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ========== 1. 人物检索（别名/字号搜索） ==========
export interface SHLIBPerson {
  id?: string;
  name: string;
  dynasty?: string;
  type?: string;
  works?: string;
  aliases?: string[];
}

export async function searchSHLIBPerson(name: string): Promise<SHLIBPerson[]> {
  try {
    const data = await shFetch('/gj/webapi/instances', {
      searchWord: name,
      searchType: '2', // 模糊检索
      pageSize: '10',
      page: '1',
    });
    if (!data) return [];
    
    // 上图返回格式：{ instances: [], total: number }
    const instances = data.instances || data.result || [];
    if (!Array.isArray(instances)) return [];
    
    return instances.slice(0, 8).map((item: Record<string, unknown>) => ({
      id: item.id as string || String(Math.random()),
      name: item.title as string || item.name as string || name,
      dynasty: item.dynasty as string || item.dynasty_chn as string,
      type: item.type as string || '人物',
      works: item.works as string || item.work as string,
      aliases: item.aliases as string[] || [],
    }));
  } catch {
    return [];
  }
}

// ========== 2. 古籍检索 ==========
export interface SHLIBBook {
  id?: string;
  title: string;
  author?: string;
  edition?: string;
  category?: string;
  dynasty?: string;
  abstract?: string;
}

export async function searchSHLIBBooks(keyword: string): Promise<SHLIBBook[]> {
  try {
    const data = await shFetch('/gj/webapi/instances', {
      searchWord: keyword,
      searchType: '1', // 题名检索
      pageSize: '15',
      page: '1',
    });
    if (!data) return [];
    
    const instances = data.instances || data.result || [];
    if (!Array.isArray(instances)) return [];
    
    return instances.slice(0, 10).map((item: Record<string, unknown>) => ({
      id: item.id as string || String(Math.random()),
      title: item.title as string || keyword,
      author: item.author as string,
      edition: item.edition as string || item.version as string,
      category: item.category as string || item.classification as string,
      dynasty: item.dynasty as string,
      abstract: item.abstract as string || item.desc as string,
    }));
  } catch {
    return [];
  }
}

// ========== 3. SPARQL 查询（生命事件图谱） ==========
export async function querySPARQLEvents(
  personName: string,
  birthYear?: number,
  deathYear?: number
): Promise<SPARQLEvent[]> {
  try {
    // 生命事件 SPARQL 端点
    const endpoint = 'http://data1.library.sh.cn:8890/sparql';
    
    const query = `
      PREFIX : <http://data1.library.sh.cn/lifeevent#>
      SELECT DISTINCT ?event ?person ?year ?location ?description
      WHERE {
        ?event :hasPerson ?person .
        ?event :year ?year .
        ?event :location ?location .
        ?event :description ?description .
        FILTER(CONTAINS(LCASE(STR(?person)), LCASE("${personName}")))
      }
      ORDER BY ASC(?year)
      LIMIT 30
    `;
    
    const formData = new URLSearchParams({
      query,
      format: 'json',
    });
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    const bindings = data?.results?.bindings || [];
    
    return bindings.map((b: Record<string, { value: string }>) => ({
      person: b.person?.value || personName,
      year: parseInt(b.year?.value || '0') || undefined,
      location: b.location?.value || '',
      description: b.description?.value || '',
      type: '历史事件' as const,
    }));
  } catch {
    return [];
  }
}

export interface SPARQLEvent {
  person: string;
  year?: number;
  location: string;
  description: string;
  type: '历史事件';
}

// ========== 4. 跨时代空间连接 ==========
// 将 CBDB 古代地点与 上图近现代事件叠加
export async function getCrossEraConnections(
  cbdbLocations: Array<{ c_name?: string; c_start_year?: string; c_end_year?: string }>,
  modernEvents: SPARQLEvent[]
) {
  const connections: CrossEraConnection[] = [];
  
  for (const loc of cbdbLocations) {
    const locName = loc.c_name || '';
    const startYear = parseInt(loc.c_start_year || '0') || undefined;
    const endYear = parseInt(loc.c_end_year || '9999') || undefined;
    
    // 找同一地点的近现代事件
    const relatedEvents = modernEvents.filter((e) => {
      const eYear = e.year;
      if (!eYear) return false;
      // 扩展时间范围：古代之后500年到现代
      return (
        eYear >= (startYear || 0) + 500 &&
        eYear <= Math.max(endYear + 1000, 1950)
      );
    });
    
    if (relatedEvents.length > 0) {
      connections.push({
        ancientLocation: locName,
        ancientYear: startYear,
        modernEvents: relatedEvents.slice(0, 5),
        connection: `古代${locName}（${startYear}年）→ ${
          relatedEvents[0].year
        }年近现代事件：${relatedEvents[0].description.substring(0, 30)}`,
      });
    }
  }
  
  return connections;
}

export interface CrossEraConnection {
  ancientLocation: string;
  ancientYear?: number;
  modernEvents: SPARQLEvent[];
  connection: string;
}
