'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dynasties, figures, searchSuggestions } from '@/lib/mock-data';
import Footer from '@/components/Footer';

// CBDB API 返回的数据类型
interface CBDBPerson {
  c_personid: string;
  c_name: string;
  c_name_chn?: string;
  c_dynasty_chn?: string;
  c_birthyear?: string;
  c_deathyear?: string;
  c_notes?: string;
}

interface UnifiedResult {
  id: string;
  name: string;
  source: 'cbdb' | 'mock' | 'shlib' | 'shlib-person';
  type: 'person' | 'ancient_book';
  dynasty?: string;
  birthYear?: string;
  deathYear?: string;
  aliases: string[];
  works?: string;
  bio?: string;
  author?: string;
  edition?: string;
  category?: string;
  abstract?: string;
  sources: string[];
}

// Canvas particle network background
function NetworkBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number; twinkle: number; twinkleSpeed: number; hue: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const count = Math.min(140, Math.floor((canvas.width * canvas.height) / 11000));
    const palette: { rgb: string }[] = [
      { rgb: '6, 182, 212' }, { rgb: '6, 182, 212' }, { rgb: '6, 182, 212' },
      { rgb: '217, 119, 6' }, { rgb: '139, 92, 246' }, { rgb: '236, 72, 153' },
    ];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.5 + 1.8, opacity: Math.random() * 0.45 + 0.55,
        twinkle: Math.random() * Math.PI * 2, twinkleSpeed: 0.015 + Math.random() * 0.025,
        hue: Math.floor(Math.random() * palette.length),
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.twinkle += p.twinkleSpeed;
        const flicker = 0.7 + Math.sin(p.twinkle) * 0.3;
        const opacity = p.opacity * flicker;
        const rgb = palette[p.hue].rgb;
        const glowRadius = p.r * 4;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `rgba(${rgb}, ${opacity * 0.55})`);
        grad.addColorStop(0.4, `rgba(${rgb}, ${opacity * 0.15})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(1, opacity * 1.2)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`; ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 170) * 0.28})`;
            ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  // CBDB 真实搜索结果
  const [apiSearchResults, setApiSearchResults] = useState<UnifiedResult[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  // CBDB 前端直调（绕过服务端无法访问外网）
  useEffect(() => {
    if (!searchQuery.trim()) { setApiSearchResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const cbdbUrl = `https://cbdb.fas.harvard.edu/cbdbapi/person.php?name=${encodeURIComponent(searchQuery)}&output=json`;
        const res = await fetch(cbdbUrl, {
          headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) { setApiSearchResults([]); return; }
        const text = await res.text();
        if (!text || text === 'null' || text === '[]') { setApiSearchResults([]); return; }
        const cbdbData: CBDBPerson[] = JSON.parse(text);
        if (!Array.isArray(cbdbData) || cbdbData.length === 0) { setApiSearchResults([]); return; }
        const cbdbResults: UnifiedResult[] = cbdbData.slice(0, 6).map((p) => ({
          id: `cbdb-${p.c_personid}`,
          name: String(p.c_name_chn || p.c_name || searchQuery),
          source: 'cbdb',
          type: 'person',
          dynasty: p.c_dynasty_chn ? String(p.c_dynasty_chn) : undefined,
          birthYear: p.c_birthyear ? String(p.c_birthyear) : undefined,
          deathYear: p.c_deathyear ? String(p.c_deathyear) : undefined,
          aliases: [],
          works: undefined,
          bio: p.c_notes ? String(p.c_notes).substring(0, 100) : undefined,
          sources: ['CBDB哈佛'],
        }));
        setApiSearchResults(cbdbResults);
      } catch { setApiSearchResults([]); }
    }, 450);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !(searchRef.current as HTMLElement).contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = searchSuggestions.filter((s) => {
    const matchesQuery = s.name.includes(searchQuery) || s.identity.includes(searchQuery);
    const matchesDynasty = !selectedDynasty || s.dynasty.includes(
      selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' :
      selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清'
    );
    return matchesQuery && matchesDynasty;
  });

  const filteredFigures = figures.filter((f) => {
    const matchesDynasty = !selectedDynasty || f.dynasty.includes(
      selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' :
      selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清'
    );
    return matchesDynasty;
  });

  const dynastyNameMap: Record<string, string> = { tang: '唐', song: '宋', yuan: '元', ming: '明', qing: '清' };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary relative">
      <NetworkBackground />
      {/* Top nav bar */}
      <nav className="relative z-10 w-full px-8 py-5 flex items-center justify-between border-b border-border-subtle/40 bg-bg-primary/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-tech/30 to-amber/20 border border-cyan-tech/40 flex items-center justify-center">
            <span className="text-amber font-serif font-bold text-lg">典</span>
          </div>
          <span className="text-text-primary font-serif text-xl font-bold tracking-wide">典籍智核</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">文脉探微</span>
          <div className="flex items-center gap-1 ml-4 px-4 py-2 rounded-lg bg-bg-card/50 border border-border-subtle/50 text-sm text-text-secondary hover:text-text-primary hover:border-cyan-tech/40 transition-colors cursor-pointer">
            人物画像
          </div>
          <div className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
            智能问答
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 px-8 py-16 max-w-6xl mx-auto">

        {/* Hero section */}
        <div className="text-center mb-16 pt-8">
          {/* Logo */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute w-28 h-28 rounded-full bg-amber/20 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber/40 to-amber/10 border-2 border-amber/50 flex items-center justify-center shadow-2xl shadow-amber/20">
              <span className="text-amber font-serif text-4xl font-bold">典</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-primary mb-4">
            典籍智核 <span className="text-amber/90">文脉探微</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            一个人物，一段历史，一种文明——用AI读懂数据里的人物命运
          </p>
          <p className="text-cyan-tech/80 text-sm mt-2 italic">Ancient Wisdom Meets Modern AI</p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-12" ref={searchRef}>
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="搜索历史人物，如：苏轼、李白、杜甫..."
              className="w-full px-6 py-4 pl-14 bg-bg-card/90 backdrop-blur-sm border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary/50 text-lg focus:outline-none focus:border-cyan-tech transition-colors"
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && searchQuery && (
            <div className="mt-3 bg-bg-card/95 backdrop-blur-md border border-border-subtle/50 rounded-xl shadow-2xl overflow-hidden">
              {/* CBDB 真实数据 */}
              {apiSearchResults.length > 0 && (
                <div>
                  <div className="px-6 py-2 text-xs text-cyan-tech/80 font-medium border-b border-border-subtle/30">
                    🔍 真实数据（CBDB哈佛）
                  </div>
                  {apiSearchResults.map((r, i) => {
                    const figureId = `cbdb-${encodeURIComponent(r.name)}`;
                    return (
                      <Link
                        key={`api-${i}`}
                        href={`/figure/${figureId}`}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-bg-card-hover transition-colors border-b border-border-subtle/30"
                        onClick={() => { setShowSuggestions(false); setApiSearchResults([]); }}
                      >
                        <span className="text-cyan-tech font-serif text-lg">{r.name}</span>
                        <span className="text-text-muted text-xs">
                          {r.dynasty || ''}
                          {r.birthYear ? ` · ${r.birthYear}—${r.deathYear || '?'}` : ''}
                          <span className="ml-1 text-amber/60">· CBDB哈佛</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {/* Mock 兜底 */}
              {filteredSuggestions.length > 0 && (
                <div>
                  {apiSearchResults.length > 0 && (
                    <div className="px-6 py-2 text-xs text-text-muted/60 font-medium border-b border-border-subtle/30">
                      示例人物
                    </div>
                  )}
                  {filteredSuggestions.slice(0, 6).map((s) => (
                    <Link
                      key={s.id}
                      href={`/figure/${encodeURIComponent(s.name)}`}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-bg-card-hover transition-colors border-b border-border-subtle/30 last:border-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <span className="text-amber/80 font-serif text-lg">{s.name}</span>
                      <span className="text-text-muted text-xs">{s.dynasty} · {s.identity}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynasty filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {dynasties.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDynasty(selectedDynasty === d.id ? null : d.id)}
              className={`relative px-6 py-2.5 rounded-lg font-serif text-lg font-semibold transition-all duration-300 ${
                selectedDynasty === d.id
                  ? 'bg-amber/25 text-amber border border-amber shadow-lg shadow-amber/20'
                  : 'bg-bg-card/70 text-text-primary border border-border-subtle hover:border-cyan-tech/60 hover:text-cyan-tech hover:shadow-lg hover:shadow-cyan-tech/10'
              }`}
            >
              {selectedDynasty === d.id && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber rounded-full animate-pulse" />
              )}
              {d.name} {d.period}
            </button>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="group p-8 rounded-2xl bg-bg-card/60 border border-border-subtle/40 hover:border-cyan-tech/50 hover:shadow-xl hover:shadow-cyan-tech/10 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-tech/30 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-xl">👤</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-text-primary mb-3">人物数字画像</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Multi-Agent协作分析，生成历史人物多维画像——生平轨迹、文学风格、社会关系、时空足迹
            </p>
            <div className="mt-5 text-cyan-tech text-sm font-medium group-hover:underline cursor-pointer">探索更多 →</div>
          </div>
          <div className="group p-8 rounded-2xl bg-bg-card/60 border border-border-subtle/40 hover:border-amber/50 hover:shadow-xl hover:shadow-amber/10 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber/30 to-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-xl">🕸️</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-text-primary mb-3">关系网络图谱</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              可视化人物社会关系网络，师友、亲属、政治、文学——多维关联，一目了然
            </p>
            <div className="mt-5 text-amber/80 text-sm font-medium group-hover:underline cursor-pointer">探索更多 →</div>
          </div>
          <div className="group p-8 rounded-2xl bg-bg-card/60 border border-border-subtle/40 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-text-primary mb-3">智能问答系统</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              GraphRAG复杂推理，自然语言查询历史人物事件，多跳关联发现隐藏联系
            </p>
            <div className="mt-5 text-purple-400 text-sm font-medium group-hover:underline cursor-pointer">探索更多 →</div>
          </div>
        </div>

        {/* Featured figures */}
        {selectedDynasty && (
          <div className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-amber rounded-full" />
              {dynastyNameMap[selectedDynasty]}代人物
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredFigures.map((f) => (
                <Link
                  key={f.id}
                  href={`/figure/${encodeURIComponent(f.name)}`}
                  className="group p-5 rounded-xl bg-bg-card/50 border border-border-subtle/40 hover:border-cyan-tech/50 hover:shadow-lg hover:shadow-cyan-tech/10 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber/30 to-amber/10 flex items-center justify-center text-amber font-serif font-bold text-lg group-hover:scale-110 transition-transform">
                      {f.name[0]}
                    </span>
                    <span className="text-text-primary font-serif font-bold">{f.name}</span>
                  </div>
                  <p className="text-text-muted text-xs">{f.identity}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
