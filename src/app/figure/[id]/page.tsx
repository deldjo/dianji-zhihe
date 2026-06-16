'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  figures,
  relationships,
  figureTimelines,
  figurePoems,
  allTrajectories,
  type TimelineEvent,
  type Poem,
  type TrajectoryPoint,
  type Relation,
} from '@/lib/mock-data';
import CrossEraCard from '@/app/components/map/CrossEraCard';
import Footer from '@/components/Footer';

// ==================== Force-Directed Graph Component ====================
function RelationshipGraph({ relations, centerName }: { relations: Relation[]; centerName: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<{ id: string; x: number; y: number; vx: number; vy: number }[]>([]);
  const [edges, setEdges] = useState<{ source: string; target: string; type: string }[]>([]);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const uniqueNames = new Set<string>();
    relations.forEach((r) => {
      uniqueNames.add(r.source);
      uniqueNames.add(r.target);
    });

    const nameList = Array.from(uniqueNames);
    const cx = 400;
    const cy = 300;
    const radius = 180;

    const initialNodes = nameList.map((id, i) => {
      const angle = (2 * Math.PI * i) / nameList.length;
      const isCenter = id === centerName;
      return {
        id,
        x: cx + (isCenter ? 0 : radius * Math.cos(angle)),
        y: cy + (isCenter ? 0 : radius * Math.sin(angle)),
        vx: 0,
        vy: 0,
      };
    });

    const initialEdges = relations.map((r) => ({
      source: r.source,
      target: r.target,
      type: r.type,
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);

    // Simple force simulation
    let currentNodes = initialNodes.map((n) => ({ ...n }));
    let tick = 0;

    const simulate = () => {
      tick++;
      const alpha = Math.max(0.001, 1 - tick / 300);

      // Repulsion between all nodes
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const dx = currentNodes[j].x - currentNodes[i].x;
          const dy = currentNodes[j].y - currentNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (1200 * alpha) / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          currentNodes[i].vx -= fx;
          currentNodes[i].vy -= fy;
          currentNodes[j].vx += fx;
          currentNodes[j].vy += fy;
        }
      }

      // Attraction along edges
      for (const edge of initialEdges) {
        const s = currentNodes.find((n) => n.id === edge.source);
        const t = currentNodes.find((n) => n.id === edge.target);
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 160) * 0.02 * alpha;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        s.vx += fx;
        s.vy += fy;
        t.vx -= fx;
        t.vy -= fy;
      }

      // Center gravity
      for (const n of currentNodes) {
        if (n.id === centerName) {
          n.vx += (cx - n.x) * 0.05;
          n.vy += (cy - n.y) * 0.05;
        } else {
          n.vx += (cx - n.x) * 0.005;
          n.vy += (cy - n.y) * 0.005;
        }
        n.vx *= 0.6;
        n.vy *= 0.6;
        n.x += n.vx;
        n.y += n.vy;
        // Clamp
        n.x = Math.max(40, Math.min(760, n.x));
        n.y = Math.max(40, Math.min(560, n.y));
      }

      setNodes(currentNodes.map((n) => ({ ...n })));

      if (tick < 300) {
        animationRef.current = requestAnimationFrame(simulate);
      }
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [relations, centerName]);

  const typeColors: Record<string, string> = {
    师友: '#06b6d4',
    亲属: '#10b981',
    政治: '#8b5cf6',
    文学: '#d97706',
    对手: '#ef4444',
  };

  const connectedNodes = hoveredNode
    ? new Set([
        hoveredNode,
        ...edges
          .filter((e) => e.source === hoveredNode || e.target === hoveredNode)
          .flatMap((e) => [e.source, e.target]),
      ])
    : null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-dark/50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex gap-4">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              {type}
            </div>
          ))}
        </div>
        {/* Zoom controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-card border border-border-subtle text-text-secondary hover:text-cyan-tech hover:border-cyan-tech/50 transition-colors text-sm font-bold"
          >
            −
          </button>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-24 h-1 accent-cyan-tech cursor-pointer"
          />
          <button
            onClick={() => setScale(Math.min(2.5, scale + 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-bg-card border border-border-subtle text-text-secondary hover:text-cyan-tech hover:border-cyan-tech/50 transition-colors text-sm font-bold"
          >
            +
          </button>
          <span className="text-xs text-text-muted font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(1)}
            className="px-2 h-7 flex items-center justify-center rounded-md bg-bg-card border border-border-subtle text-text-secondary hover:text-cyan-tech hover:border-cyan-tech/50 transition-colors text-xs"
          >
            重置
          </button>
        </div>
      </div>
      <div className="overflow-auto" style={{ maxHeight: '600px' }}>
        <svg ref={svgRef} viewBox="0 0 800 600" className="w-full" style={{ minHeight: '400px', transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        {/* Edges */}
        {edges.map((edge, i) => {
          const s = nodes.find((n) => n.id === edge.source);
          const t = nodes.find((n) => n.id === edge.target);
          if (!s || !t) return null;
          const isHighlighted = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={typeColors[edge.type] || '#334155'}
              strokeWidth={isHighlighted ? 2.5 : 1}
              opacity={hoveredNode ? (isHighlighted ? 0.8 : 0.1) : 0.4}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((node) => {
          const isCenter = node.id === centerName;
          const isHovered = hoveredNode === node.id;
          const isConnected = connectedNodes?.has(node.id);
          const nodeOpacity = hoveredNode ? (isConnected ? 1 : 0.2) : 1;
          const nodeScale = isCenter ? 1.4 : isHovered ? 1.2 : 1;
          const r = (isCenter ? 30 : 22) * nodeScale;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer', opacity: nodeOpacity }}
            >
              {/* Glow effect */}
              {(isCenter || isHovered) && (
                <circle r={r + 8} fill="none" stroke={isCenter ? '#06b6d4' : '#d97706'} strokeWidth={1} opacity={0.3} />
              )}
              <circle
                r={r}
                fill={isCenter ? '#3a6a9e' : '#344a6e'}
                stroke={isCenter ? '#06b6d4' : '#5a7a9a'}
                strokeWidth={isCenter ? 2 : 1}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={isCenter ? '#06b6d4' : '#f8fafc'}
                fontSize={isCenter ? 18 : 15}
                fontFamily="'Noto Serif SC', serif"
                fontWeight={isCenter ? 700 : 500}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
      </div>
    </div>
  );
}

// ==================== Timeline Component ====================
function Timeline({ events }: { events: TimelineEvent[] }) {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const typeColors: Record<string, string> = {
    仕途: '#06b6d4',
    文学: '#d97706',
    生活: '#10b981',
    政治: '#8b5cf6',
  };

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border-subtle" />

      {events.map((event, i) => (
        <div
          key={i}
          className="relative mb-6 group"
          onMouseEnter={() => setActiveEvent(i)}
          onMouseLeave={() => setActiveEvent(null)}
        >
          {/* Node dot */}
          <div
            className="absolute left-[-20px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: typeColors[event.type] || '#06b6d4',
              backgroundColor: activeEvent === i ? typeColors[event.type] : '#2a3a5c',
              transform: activeEvent === i ? 'scale(1.3)' : 'scale(1)',
            }}
          />

          {/* Content */}
          <div
            className={`ml-4 p-4 rounded-lg border transition-all duration-300 ${
              activeEvent === i
                ? 'bg-bg-card-hover border-cyan-tech/30 shadow-lg'
                : 'bg-bg-card/60 border-border-subtle'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-sm text-text-muted">{event.year}年</span>
              <span className="text-text-muted">·</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: `${typeColors[event.type] || '#06b6d4'}20`,
                color: typeColors[event.type] || '#06b6d4',
              }}>
                {event.type}
              </span>
              {event.location && (
                <>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{event.location}</span>
                </>
              )}
            </div>
            <h4 className="font-serif text-lg text-text-primary font-semibold">{event.title}</h4>
            <p className="text-text-secondary text-sm mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== Trajectory Map Component ====================
function TrajectoryMap({ points }: { points: TrajectoryPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const container = containerRef.current;
    if (!container) return;
    const displayW = container.clientWidth * scale;
    const displayH = 650 * scale;

    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    ctx.scale(dpr, dpr);

    const w = displayW;
    const h = displayH;

    // China map bounds (simplified)
    const lngMin = 73;
    const lngMax = 135;
    const latMin = 18;
    const latMax = 54;

    const projectX = (lng: number) => ((lng - lngMin) / (lngMax - lngMin)) * w;
    const projectY = (lat: number) => ((latMax - lat) / (latMax - latMin)) * h;

    // Background
    ctx.fillStyle = '#2a3a5c';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#344a6e';
    ctx.lineWidth = 1;
    for (let lng = 80; lng <= 130; lng += 10) {
      ctx.beginPath();
      ctx.moveTo(projectX(lng), 0);
      ctx.lineTo(projectX(lng), h);
      ctx.stroke();
    }
    for (let lat = 20; lat <= 50; lat += 10) {
      ctx.beginPath();
      ctx.moveTo(0, projectY(lat));
      ctx.lineTo(w, projectY(lat));
      ctx.stroke();
    }

    // Coordinate labels
    ctx.font = `${12}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#5a7a9a';
    ctx.textAlign = 'center';
    for (let lng = 80; lng <= 130; lng += 10) {
      ctx.fillText(`${lng}°E`, projectX(lng), h - 6);
    }
    ctx.textAlign = 'left';
    for (let lat = 20; lat <= 50; lat += 10) {
      ctx.fillText(`${lat}°N`, 6, projectY(lat) - 6);
    }

    const typeColors: Record<string, string> = {
      仕途: '#06b6d4',
      流放: '#ef4444',
      游历: '#8b5cf6',
      故里: '#10b981',
      生活: '#d97706',
    };

    // Draw trajectory lines
    if (points.length > 1) {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const gradient = ctx.createLinearGradient(
          projectX(p1.lng), projectY(p1.lat),
          projectX(p2.lng), projectY(p2.lat)
        );
        gradient.addColorStop(0, typeColors[p1.type] || '#06b6d4');
        gradient.addColorStop(1, typeColors[p2.type] || '#06b6d4');
        ctx.beginPath();
        ctx.moveTo(projectX(p1.lng), projectY(p1.lat));
        ctx.lineTo(projectX(p2.lng), projectY(p2.lat));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow direction
        const midX = (projectX(p1.lng) + projectX(p2.lng)) / 2;
        const midY = (projectY(p1.lat) + projectY(p2.lat)) / 2;
        const angle = Math.atan2(projectY(p2.lat) - projectY(p1.lat), projectX(p2.lng) - projectX(p1.lng));
        const arrowSize = 5;
        ctx.beginPath();
        ctx.moveTo(midX + arrowSize * Math.cos(angle), midY + arrowSize * Math.sin(angle));
        ctx.lineTo(midX + arrowSize * Math.cos(angle + 2.5), midY + arrowSize * Math.sin(angle + 2.5));
        ctx.lineTo(midX + arrowSize * Math.cos(angle - 2.5), midY + arrowSize * Math.sin(angle - 2.5));
        ctx.closePath();
        ctx.fillStyle = typeColors[p2.type] || '#06b6d4';
        ctx.fill();
      }
    }

    // Draw points
    points.forEach((p, i) => {
      const x = projectX(p.lng);
      const y = projectY(p.lat);
      const color = typeColors[p.type] || '#06b6d4';

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = `${color}15`;
      ctx.fill();

      // Mid glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `${color}30`;
      ctx.fill();

      // Point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff80';
      ctx.fill();

      // Label
      ctx.font = `bold ${20}px "Noto Sans SC", sans-serif`;
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(p.location, x, y - 22);

      // Year
      ctx.font = `${14}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#cdd8e6';
      ctx.fillText(`${p.year}`, x, y + 26);
    });

    // Legend
    const legendItems = Object.entries(typeColors);
    legendItems.forEach(([type, color], i) => {
      const lx = 16;
      const ly = 16 + i * 24;
      ctx.beginPath();
      ctx.arc(lx + 6, ly + 6, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.font = `14px "Noto Sans SC", sans-serif`;
      ctx.fillStyle = '#cdd8e6';
      ctx.textAlign = 'left';
      ctx.fillText(type, lx + 18, ly + 10);
    });
  }, [points, scale]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div className="w-full">
      {/* Zoom controls */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-text-muted">缩放</span>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-primary transition-colors text-sm font-bold"
        >−</button>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-24 h-1 accent-cyan-tech cursor-pointer"
        />
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-primary transition-colors text-sm font-bold"
        >+</button>
        <span className="text-xs text-text-muted w-10 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs rounded-md border border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-secondary transition-colors"
        >重置</button>
      </div>
      {/* Canvas container with scroll */}
      <div
        ref={containerRef}
        className="rounded-xl border border-border-subtle bg-bg-dark/50 overflow-auto"
        style={{ maxHeight: '900px' }}
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => {
          e.preventDefault();
          setScale((s) => {
            const next = s + (e.deltaY < 0 ? 0.1 : -0.1);
            return Math.min(Math.max(next, 0.3), 3);
          });
        }}
      >
        <canvas
          ref={canvasRef}
        />
      </div>
    </div>
  );
}

// ==================== Poetry Section ====================
function PoetrySection({ poems }: { poems: Poem[] }) {
  const [expandedPoem, setExpandedPoem] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {poems.map((poem, i) => (
        <div
          key={i}
          className="bg-bg-card/60 border border-border-subtle rounded-xl overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => setExpandedPoem(expandedPoem === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg text-amber">{poem.title}</span>
              {poem.year && (
                <span className="font-mono text-xs text-text-muted">{poem.year}年</span>
              )}
              {poem.location && (
                <span className="text-xs text-text-muted">· {poem.location}</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-text-muted transition-transform duration-300 ${expandedPoem === i ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedPoem === i && (
            <div className="px-6 pb-6 border-t border-border-subtle pt-4">
              {/* Poem content */}
              <div className="font-serif text-lg leading-loose text-text-primary mb-4 whitespace-pre-line">
                {poem.content}
              </div>

              {/* Background */}
              {poem.background && (
                <div className="bg-bg-dark/50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-text-muted mb-1">创作背景</div>
                  <p className="text-text-secondary text-sm">{poem.background}</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {poem.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-amber/10 text-amber">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ==================== Main Figure Page ====================
export default function FigurePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const figureId = params.id as string;
  const initialTab = searchParams.get('tab') || 'bio';

  // 优先从 mock 数据查找
  const mockFigure = figures.find((f) => f.id === figureId);
  // 融合数据：优先真实 API 数据，fallback 到 mock
  const [apiData, setApiData] = useState<{
    name: string;
    bio?: string;
    dynasty?: string;
    birthYear?: string;
    deathYear?: string;
    crossEraConnections?: Array<{
      ancientLocation: string;
      ancientYear?: number;
      connection: string;
      modernEvents: Array<{ year?: number; location: string; description: string }>;
    }>;
  } | null>(null);

  // 从 ID 解析真实姓名（支持 cbdb-王勃、shlib-p-王勃 格式）
  // ID 由首页搜索生成：cbdb- + URL编码(姓名)
  function extractNameFromId(id: string): string {
    if (id.startsWith('cbdb-')) return decodeURIComponent(id.slice(5));
    if (id.startsWith('shlib-')) return decodeURIComponent(id.slice(7));
    if (id.startsWith('shlib-p-')) return decodeURIComponent(id.slice(9));
    return decodeURIComponent(id);
  }

  // 先找到 mock figure 的姓名，用于调用三源融合 API
  const mockById = figures.find((f) => f.id === figureId);
  const figureNameForApi = mockById?.name || extractNameFromId(figureId);

  // 尝试从 CBDB 直调获取真实数据（绕过服务端无法访问外网）
  useEffect(() => {
    if (!figureId || !figureNameForApi) return;
    const fetchData = async () => {
      try {
        // 前端直调 CBDB API
        const cbdbUrl = `https://cbdb.fas.harvard.edu/cbdbapi/person.php?name=${encodeURIComponent(figureNameForApi)}&output=json`;
        const res = await fetch(cbdbUrl, {
          headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) return;
        const text = await res.text();
        if (!text || text === 'null' || text === '[]') return;
        const cbdbData = JSON.parse(text);
        if (!Array.isArray(cbdbData) || cbdbData.length === 0) return;
        const p = cbdbData[0];
        setApiData({
          name: String(p.c_name_chn || p.c_name || figureNameForApi),
          dynasty: p.c_dynasty_chn ? String(p.c_dynasty_chn) : undefined,
          birthYear: p.c_birthyear ? String(p.c_birthyear) : undefined,
          deathYear: p.c_deathyear ? String(p.c_deathyear) : undefined,
          bio: p.c_notes ? String(p.c_notes).substring(0, 300) : undefined,
          crossEraConnections: [],
        });
      } catch {
        // 静默失败，用 mock 数据兜底
      }
    };
    fetchData();
  }, [figureId, figureNameForApi]);

  const figure = mockFigure || figures[0];
  // 如果 API 返回了真实数据，替换部分字段
  const displayName = apiData?.name || figure.name;
  const displayBio = apiData?.bio || figure.bio;
  const displayDynasty = apiData?.dynasty || figure.dynasty;
  const displayBirthYear = apiData?.birthYear ? parseInt(apiData.birthYear) : figure.birthYear;
  const displayDeathYear = apiData?.deathYear ? parseInt(apiData.deathYear) : figure.deathYear;

  const timeline = figureTimelines[figure.name] || figureTimelines['苏轼'] || [];
  const poems = figurePoems[figure.name] || [];
  const trajectory = allTrajectories[figure.name] || allTrajectories['苏轼'] || [];
  const figureRelations = relationships.filter(
    (r) => r.source === displayName || r.target === displayName
  );
  const crossEraConnections = apiData?.crossEraConnections || [];

  const [activeTab, setActiveTab] = useState(initialTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'bio', label: '生平分析', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'network', label: '关系网络', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'trajectory', label: '时空轨迹', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { id: 'crossera', label: '🌏跨时代', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', requiresData: true },
    { id: 'poetry', label: '诗词鉴赏', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Top navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/60 backdrop-blur-xl border-b border-border-subtle/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-text-secondary hover:text-cyan-tech transition-colors group"
            title="返回"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-sm">返回</span>
          </button>
          <span className="text-text-muted/40">|</span>
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="典籍智核"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-serif text-lg font-bold text-text-primary group-hover:text-cyan-tech transition-colors">典籍智核</span>
          </Link>
          <span className="text-text-muted/40">/</span>
          <span className="font-serif text-lg text-amber">{displayName}</span>
          <div className="flex-1" />
          <Link href="/figure/su-shi" className="text-sm text-text-secondary hover:text-cyan-tech transition-colors">
            人物画像
          </Link>
          <Link href="/qa" className="text-sm text-text-secondary hover:text-cyan-tech transition-colors">
            智能问答
          </Link>
        </div>
      </nav>

      {/* Hero header */}
      <div className="pt-16">
        <div className="relative h-56 bg-gradient-to-b from-primary-deep/50 via-primary-deep/20 to-bg-dark overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-8">
                {/* Avatar - square classical frame */}
                <div className="relative w-28 h-28 rounded-lg bg-bg-card border-2 border-amber/30 flex items-center justify-center shadow-xl shadow-amber/5">
                  <div className="absolute inset-1 border border-amber/10 rounded" />
                  <span className="font-serif text-5xl text-amber">{displayName[0]}</span>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-serif text-4xl font-bold text-text-primary">{displayName}</h1>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber/15 text-amber border border-amber/20">
                      {displayDynasty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm mb-3">
                    {figure.courtesyName && <span>字{figure.courtesyName}</span>}
                    {figure.pseudonym && <span>号{figure.pseudonym}</span>}
                    <span className="text-text-muted">·</span>
                    <span className="font-mono">{displayBirthYear}—{displayDeathYear}</span>
                  </div>
                  <div className="flex gap-2">
                    {figure.identity.map((id) => (
                      <span key={id} className="text-xs px-2.5 py-1 rounded-full bg-cyan-tech/10 text-cyan-tech border border-cyan-tech/10">
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-bg-dark/90 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-cyan-tech border-cyan-tech'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-16 flex-1">
        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bio summary */}
            <div className="lg:col-span-1">
              <div className="bg-bg-card/60 border border-border-subtle rounded-xl p-6">
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-4">人物简介</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{displayBio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {figure.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-amber/10 text-amber">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-bg-card/60 border border-border-subtle rounded-xl p-6 mt-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">数据概览</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-bg-dark/50 rounded-lg">
                    <div className="font-mono text-2xl text-cyan-tech font-bold">{figureRelations.length}</div>
                    <div className="text-text-muted text-xs mt-1">关联人物</div>
                  </div>
                  <div className="text-center p-3 bg-bg-dark/50 rounded-lg">
                    <div className="font-mono text-2xl text-amber font-bold">{poems.length}</div>
                    <div className="text-text-muted text-xs mt-1">代表诗词</div>
                  </div>
                  <div className="text-center p-3 bg-bg-dark/50 rounded-lg">
                    <div className="font-mono text-2xl text-primary-light font-bold">{timeline.length}</div>
                    <div className="text-text-muted text-xs mt-1">生平事件</div>
                  </div>
                  <div className="text-center p-3 bg-bg-dark/50 rounded-lg">
                    <div className="font-mono text-2xl text-cyan-tech font-bold">{trajectory.length}</div>
                    <div className="text-text-muted text-xs mt-1">足迹地点</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="lg:col-span-2">
              <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">生平时间轴</h3>
              <Timeline events={timeline} />
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <RelationshipGraph relations={figureRelations} centerName={displayName} />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-bg-card/60 border border-border-subtle rounded-xl p-6">
                <h3 className="font-serif text-lg font-semibold text-text-primary mb-4">关系详情</h3>
                <div className="space-y-3">
                  {figureRelations.map((rel, i) => {
                    const otherName = rel.source === displayName ? rel.target : rel.source;
                    const typeColors: Record<string, string> = {
                      师友: '#06b6d4',
                      亲属: '#10b981',
                      政治: '#8b5cf6',
                      文学: '#d97706',
                      对手: '#ef4444',
                    };
                    return (
                      <div key={i} className="p-3 bg-bg-dark/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[rel.type] }} />
                          <span className="font-serif text-text-primary">{otherName}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{
                            backgroundColor: `${typeColors[rel.type]}20`,
                            color: typeColors[rel.type],
                          }}>
                            {rel.type}
                          </span>
                        </div>
                        <p className="text-text-muted text-xs">{rel.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trajectory' && (
          <div className="-mx-6">
            <div className="mb-4 flex items-center justify-between px-6">
              <h3 className="font-serif text-xl font-semibold text-text-primary">时空轨迹</h3>
              <div className="flex gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-tech" /> 仕途</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> 流放</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> 游历</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 故里</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 生活</span>
              </div>
            </div>
            <TrajectoryMap points={trajectory} />

            {/* Timeline alongside map */}
            <div className="mt-8 px-6">
              <h4 className="font-serif text-2xl font-semibold text-text-primary mb-6">足迹详情</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trajectory.map((p, i) => {
                  const typeColors: Record<string, string> = {
                    仕途: '#06b6d4',
                    流放: '#ef4444',
                    游历: '#8b5cf6',
                    故里: '#10b981',
                    生活: '#d97706',
                  };
                  return (
                    <div key={i} className="flex items-start gap-4 p-6 bg-bg-card/60 border border-border-subtle rounded-xl hover:border-cyan-tech/30 transition-colors">
                      <div className="w-5 h-5 mt-1 rounded-full flex-shrink-0" style={{ backgroundColor: typeColors[p.type] }} />
                      <div>
                        <div className="font-mono text-sm text-text-muted">{p.year}年</div>
                        <div className="font-serif text-text-primary text-lg font-semibold mt-1">{p.location}</div>
                        <div className="text-text-secondary text-sm mt-2 leading-relaxed">{p.event}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crossera' && (
          <div>
            {crossEraConnections.length > 0 ? (
              <CrossEraCard connections={crossEraConnections} figureName={displayName} />
            ) : (
              <div className="bg-bg-card/60 border border-border-subtle rounded-xl p-12 text-center">
                <p className="text-text-muted">暂无跨时代连接数据（需 CBDB + 上图 SPARQL 同时返回结果）</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'poetry' && (
          <div>
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">代表诗词</h3>
            <PoetrySection poems={poems} />
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
