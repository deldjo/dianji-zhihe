/**
 * CBDB API Client - 哈佛大学中国历代人物数据库
 * https://cbdb.fas.harvard.edu/cbdbapi/
 */

// 人物基本信息
export interface CBDBPerson {
  c_personid: string;
  c_name: string;
  c_name_chs?: string;
  c_dynasty?: string;
  c_birthyear?: string;
  c_deathyear?: string;
  c_notes?: string;
}

// 关系数据
export interface CBDBRelation {
  c_person_id: string;
  c_name: string;
  c_rel_type?: string;
  c_rel_desc?: string;
}

// 地点/时空轨迹
export interface CBDBLocation {
  c_loc_id?: string;
  c_name?: string;
  c_lat?: string;
  c_lng?: string;
  c_addr?: string;
  c_start_year?: string;
  c_end_year?: string;
}

// CBDB API 响应
export interface CBDBResponse {
  ERROR?: string;
  [key: string]: unknown;
}

// CBDB REST API 基础 URL
const CBDB_API = 'https://cbdb.fas.harvard.edu/cbdbapi';

// 延迟函数（防限流）
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 获取人物基本信息（by name）
export async function searchPersonByName(name: string): Promise<CBDBPerson[]> {
  try {
    const url = `${CBDB_API}/person.php?name=${encodeURIComponent(name)}&output=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' },
      next: { revalidate: 3600 }, // 缓存1小时
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || text === 'null' || text === '[]') return [];
    
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return [];
    return data.slice(0, 5).map((p: Record<string, unknown>) => ({
      c_personid: String(p.c_personid || ''),
      c_name: String(p.c_name_chn || p.c_name || name),
      c_dynasty: p.c_dynasty_chn ? String(p.c_dynasty_chn) : undefined,
      c_birthyear: p.c_birthyear ? String(p.c_birthyear) : undefined,
      c_deathyear: p.c_deathyear ? String(p.c_deathyear) : undefined,
      c_notes: p.c_notes ? String(p.c_notes).substring(0, 200) : undefined,
    }));
  } catch {
    return [];
  }
}

// 获取人物关系网络
export async function getPersonRelations(personId: string): Promise<CBDBRelation[]> {
  try {
    const url = `${CBDB_API}/ego.php?pid=${personId}&output=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' },
      next: { revalidate: 7200 },
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || text === 'null' || text === '[]') return [];
    
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return [];
    return data.slice(0, 20).map((r: Record<string, unknown>) => ({
      c_person_id: String(r.c_person_id || ''),
      c_name: String(r.c_name_chn || r.c_name || ''),
      c_rel_type: r.c_rel_type ? String(r.c_rel_type) : undefined,
      c_rel_desc: r.c_rel_desc ? String(r.c_rel_desc).substring(0, 100) : undefined,
    }));
  } catch {
    return [];
  }
}

// 获取人物时空轨迹（任职/居住地点）
export async function getPersonLocations(personId: string): Promise<CBDBLocation[]> {
  try {
    const url = `${CBDB_API}/addr.php?pid=${personId}&output=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' },
      next: { revalidate: 7200 },
    });
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || text === 'null' || text === '[]') return [];
    
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return [];
    return data.slice(0, 30).map((l: Record<string, unknown>) => ({
      c_loc_id: l.c_loc_id ? String(l.c_loc_id) : undefined,
      c_name: l.c_addr_name ? String(l.c_addr_name) : undefined,
      c_lat: l.c_lat ? String(l.c_lat) : undefined,
      c_lng: l.c_lng ? String(l.c_lng) : undefined,
      c_start_year: l.c_start_year ? String(l.c_start_year) : undefined,
      c_end_year: l.c_end_year ? String(l.c_end_year) : undefined,
    }));
  } catch {
    return [];
  }
}

// 完整人物画像（聚合所有数据）
export async function getFullPersonProfile(name: string) {
  const persons = await searchPersonByName(name);
  if (persons.length === 0) return null;
  
  const primary = persons[0];
  const [relations, locations] = await Promise.all([
    getPersonRelations(primary.c_personid),
    getPersonLocations(primary.c_personid),
  ]);
  
  await delay(200); // 防限流
  
  return {
    ...primary,
    relations,
    locations,
  };
}
