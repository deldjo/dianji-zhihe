'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dynasties, figures, searchSuggestions } from '@/lib/mock-data';
import Footer from '@/components/Footer';

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
    const palette = [
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
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setApiSearchResults([]); return; }
    setIsLoadingApi(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const url = `https://cbdb.fas.harvard.edu/cbdbapi/person.php?name=${encodeURIComponent(val)}&output=json`;
        const res = await fetch(url, { headers: { 'User-Agent': 'Ancient-Wisdom-App/1.0' }, signal: controller.signal as any });
        clearTimeout(timeout);
        if (res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            setApiSearchResults(json && json.c_personid ? [json] : []);
          } catch { setApiSearchResults([]); }
        } else { setApiSearchResults([]); }
      } catch { setApiSearchResults([]); }
      finally { setIsLoadingApi(false); }
    }, 450);
  };

  const filteredSuggestions = searchSuggestions.filter((s) => {
    const matchesQuery = s.name.includes(searchQuery) || s.identity.includes(searchQuery);
    const matchesDynasty = !selectedDynasty || s.dynasty.includes(
      selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' : selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清'
    );
    return matchesQuery && matchesDynasty;
  });

  const filteredFigures = figures.filter((f) => {
    const matchesDynasty = !selectedDynasty || f.dynasty.includes(
      selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' : selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清'
    );
    return matchesDynasty;
  });

  const dynastyNameMap: Record<string, string> = { tang: '唐', song: '宋', yuan: '元', ming: '明', qing: '清' };

  const displayResults = apiSearchResults.length > 0
    ? apiSearchResults.map((p) => ({ type: 'cbdb' as const, person: p, name: p.c_name_chn, label: 'CBDB哈佛', sublabel: `${p.c_dynasty_chn || ''} · ${p.c_birthyear || '?'}-${p.c_deathyear || '?'}` }))
    : filteredSuggestions.slice(0, 6).map((s) => ({ type: 'mock' as const, name: s.name, label: s.dynasty, sublabel: s.identity }));

  const handleResultClick = (item: typeof displayResults[0]) => {
    setShowSuggestions(false);
    if (item.type === 'cbdb') router.push(`/figure/cbdb-${encodeURIComponent(item.person.c_name_chn || searchQuery)}`);
    else router.push(`/figure/${item.name}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NetworkBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-bg-dark/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-serif font-bold text-cyan-tech">典籍智核</span>
          <span className="text-text-muted text-sm">文脉探微 · 人物画像 · 智能问答</span>
        </div>
      </nav>
      <main className="relative z-10 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-tech/30 to-purple-accent/30 flex items-center justify-center shadow-2xl shadow-cyan-tech/20 backdrop-blur-sm border border-cyan-tech/40">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <text x="50" y="38" textAnchor="middle" fontSize="18" fill="url(#logoGrad)" fontFamily="serif">典</text>
                <text x="50" y="60" textAnchor="middle" fontSize="18" fill="url(#logoGrad)" fontFamily="serif">籍</text>
                <text x="50" y="82" textAnchor="middle" fontSize="18" fill="url(#logoGrad)" fontFamily="serif">智</text>
              </svg>
            </div>
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-tech/40 via-purple-accent/40 to-pink-primary/40 blur-2xl opacity-60 animate-pulse" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-tech via-purple-accent to-pink-primary">典籍智核</span>
            <span className="text-text-primary ml-4">文脉探微</span>
          </h1>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
            一个人物，一段历史，一种文明——用AI读懂数据里的人物命运<br />
            <span className="text-cyan-tech/80">Ancient Wisdom Meets Modern AI</span>
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-12" ref={searchRef}>
            <div className="relative">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" value={searchQuery} onChange={handleSearchChange} onFocus={() => setShowSuggestions(true)}
                placeholder="搜索历史人物，如：苏轼、李白、杜甫..."
                className="w-full px-6 py-4 pl-14 bg-bg-card/90 backdrop-blur-sm border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary/50 text-lg focus:outline-none focus:border-cyan-tech transition-colors"
              />
              {isLoadingApi && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-cyan-tech border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {showSuggestions && searchQuery && displayResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card/95 backdrop-blur-md border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
                {displayResults.map((item, idx) => (
                  <div key={idx} onClick={() => handleResultClick(item)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-bg-warm/50 cursor-pointer transition-colors border-b border-border-subtle last:border-0">
                    <div className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${item.type === 'cbdb' ? 'bg-cyan-tech/20 text-cyan-tech border border-cyan-tech/30' : 'bg-purple-accent/20 text-purple-accent border border-purple-accent/30'}`}>
                      {item.label}
                    </div>
                    <div><div className="text-text-primary font-medium">{item.name}</div><div className="text-text-muted text-sm">{item.sublabel}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynasty filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {dynasties.map((d) => (
              <button key={d.id} onClick={() => setSelectedDynasty(selectedDynasty === d.id ? null : d.id)}
                className={`relative px-6 py-2.5 rounded-lg font-serif text-lg font-semibold transition-all duration-300 ${selectedDynasty === d.id ? 'bg-amber/25 text-amber border-amber border shadow-lg shadow-amber/20' : 'bg-bg-card/70 text-text-primary border border-border-subtle hover:border-cyan-tech/60 hover:text-cyan-tech hover:shadow-lg hover:shadow-cyan-tech/10'}`}>
                {selectedDynasty === d.id && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber rounded-full animate-pulse" />}
                {d.name} {d.period}
              </button>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl p-6 hover:border-cyan-tech/50 transition-all hover:shadow-lg hover:shadow-cyan-tech/10 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-tech to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">人物数字画像</h3>
              <p className="text-text-muted text-sm">Multi-Agent协作分析，生成历史人物多维画像——生平轨迹、文学风格、社会关系、时空足迹</p>
            </div>
            <div className="bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl p-6 hover:border-purple-accent/50 transition-all hover:shadow-lg hover:shadow-purple-accent/10 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-accent to-pink-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">关系网络图谱</h3>
              <p className="text-text-muted text-sm">可视化人物社会关系网络，师友、亲属、政治、文学——多维关联，一目了然</p>
            </div>
            <div className="bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl p-6 hover:border-amber/50 transition-all hover:shadow-lg hover:shadow-amber/10 group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">智能问答系统</h3>
              <p className="text-text-muted text-sm">GraphRAG复杂推理，自然语言查询历史人物事件，多跳关联发现隐藏联系</p>
            </div>
          </div>

          {selectedDynasty && (
            <div className="bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl p-8">
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-6">{dynastyNameMap[selectedDynasty]}代人物</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredFigures.map((f) => (
                  <Link key={f.name} href={`/figure/${f.name}`} className="group bg-bg-warm/50 border border-border-subtle rounded-lg p-4 hover:border-cyan-tech/50 transition-all">
                    <div className="text-4xl font-serif mb-2 group-hover:scale-110 transition-transform">{f.name[0]}</div>
                    <div className="text-text-primary font-medium">{f.name}</div>
                    <div className="text-text-muted text-sm">{f.identity[0]}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
