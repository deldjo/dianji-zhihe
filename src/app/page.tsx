'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dynasties, figures, searchSuggestions } from '@/lib/mock-data';
import Footer from '@/components/Footer';

// Canvas particle network background
function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = searchSuggestions.filter((s) => {
    const matchesQuery = s.name.includes(searchQuery) || s.identity.includes(searchQuery);
    const matchesDynasty = !selectedDynasty || s.dynasty.includes(selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' : selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清');
    return matchesQuery && matchesDynasty;
  });

  const filteredFigures = figures.filter((f) => {
    const matchesDynasty = !selectedDynasty || f.dynasty.includes(selectedDynasty === 'tang' ? '唐' : selectedDynasty === 'song' ? '宋' : selectedDynasty === 'yuan' ? '元' : selectedDynasty === 'ming' ? '明' : '清');
    return matchesDynasty;
  });

  const dynastyNameMap: Record<string, string> = {
    tang: '唐',
    song: '宋',
    yuan: '元',
    ming: '明',
    qing: '清',
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay flex flex-col">
      <NetworkBackground />

      {/* Top nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/60 backdrop-blur-xl border-b border-border-subtle/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="典籍智核"
                width={36}
                height={36}
                className="rounded-md"
                priority
              />
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold text-text-primary group-hover:text-cyan-tech transition-colors">典籍智核</span>
                <span className="font-serif text-sm text-text-muted">文脉探微</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/figure/su-shi" className="text-sm text-text-secondary hover:text-cyan-tech transition-colors">
              人物画像
            </Link>
            <Link href="/qa" className="text-sm text-text-secondary hover:text-cyan-tech transition-colors">
              智能问答
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
        {/* Hero section */}
        <div className={`text-center mb-14 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Glow ring behind logo */}
              <div className="absolute inset-[-12px] rounded-2xl bg-cyan-tech/5 blur-xl" />
              <Image
                src="/logo.png"
                alt="典籍智核 Logo"
                width={120}
                height={120}
                className="relative rounded-2xl shadow-2xl shadow-cyan-tech/10"
                priority
              />
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 tracking-wider">
            <span className="gradient-text">典籍智核</span>
          </h1>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-secondary/90 mb-5 tracking-[0.3em]">
            文脉探微
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
            一个人物，一段历史，一种文明——用AI读懂数据里的人物命运
          </p>
          <p className="text-text-muted/80 text-sm mt-2 italic font-serif">
            Ancient Wisdom Meets Modern AI
          </p>
        </div>

        {/* Search bar */}
        <div className={`w-full max-w-2xl mb-16 transition-all duration-1000 delay-300 relative z-40 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div ref={searchRef} className="relative">
            <div className="relative breathing-glow rounded-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="搜索历史人物，如：苏轼、李白、杜甫..."
                className="w-full px-6 py-4 pl-14 bg-bg-card/90 backdrop-blur-sm border border-border-subtle rounded-xl text-text-primary placeholder:text-text-secondary/50 text-lg focus:outline-none focus:border-cyan-tech transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card/95 backdrop-blur-md border border-border-subtle rounded-xl overflow-hidden shadow-2xl z-50">
                {filteredSuggestions.slice(0, 6).map((s) => (
                  <Link
                    key={s.id}
                    href={`/figure/${s.id}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-bg-card-hover transition-colors"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <span className="text-amber font-serif text-lg">{s.name}</span>
                    <span className="text-text-muted text-sm">{s.dynasty} · {s.identity}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynasty filters */}
        <div className={`flex gap-3 mb-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {dynasties.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDynasty(selectedDynasty === d.id ? null : d.id)}
              className={`relative px-6 py-2.5 rounded-lg font-serif text-lg transition-all duration-300 ${
                selectedDynasty === d.id
                  ? 'bg-amber/20 text-amber border-amber/50 border'
                  : 'bg-bg-card/60 text-text-secondary border border-border-subtle hover:border-cyan-tech/50 hover:text-text-primary'
              }`}
            >
              {selectedDynasty === d.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber rounded-full" />
              )}
              {d.name}
              <span className="text-xs ml-1 opacity-60">{d.period}</span>
            </button>
          ))}
        </div>

        {/* Feature cards */}
        <div className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/figure/su-shi" className="card-hover block p-8 bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl group">
            <div className="w-14 h-14 rounded-lg bg-primary-deep/60 flex items-center justify-center mb-5 border border-cyan-tech/20">
              <svg className="w-7 h-7 text-cyan-tech" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-3 group-hover:text-cyan-tech transition-colors">人物数字画像</h3>
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              Multi-Agent协作分析，生成历史人物多维画像——生平轨迹、文学风格、社会关系、时空足迹
            </p>
            <div className="mt-4 text-cyan-tech text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              探索更多
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          <Link href="/figure/su-shi?tab=network" className="card-hover block p-8 bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl group">
            <div className="w-14 h-14 rounded-lg bg-amber/10 flex items-center justify-center mb-5 border border-amber/20">
              <svg className="w-7 h-7 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-3 group-hover:text-amber transition-colors">关系网络图谱</h3>
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              可视化人物社会关系网络，师友、亲属、政治、文学——多维关联，一目了然
            </p>
            <div className="mt-4 text-amber text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              探索更多
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          <Link href="/qa" className="card-hover block p-8 bg-bg-card/70 backdrop-blur-sm border border-border-subtle rounded-xl group">
            <div className="w-14 h-14 rounded-lg bg-cyan-tech/10 flex items-center justify-center mb-5 border border-cyan-tech/20">
              <svg className="w-7 h-7 text-cyan-tech" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-3 group-hover:text-cyan-tech transition-colors">智能问答系统</h3>
            <p className="text-text-secondary/80 text-sm leading-relaxed">
              GraphRAG复杂推理，自然语言查询历史人物事件，多跳关联发现隐藏联系
            </p>
            <div className="mt-4 text-cyan-tech text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              探索更多
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        </div>

        {/* Featured figures */}
        {selectedDynasty && (
          <div className="w-full max-w-5xl mt-14 px-4">
            <h3 className="font-serif text-xl text-text-secondary/90 mb-6 text-center">
              {dynastyNameMap[selectedDynasty]}代人物
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {filteredFigures.map((f) => (
                <Link
                  key={f.id}
                  href={`/figure/${f.id}`}
                  className="card-hover p-5 bg-bg-card/60 backdrop-blur-sm border border-border-subtle rounded-lg text-center group"
                >
                  <div className="w-14 h-14 mx-auto rounded-lg bg-primary-deep/40 flex items-center justify-center mb-3 border border-border-subtle">
                    <span className="font-serif text-xl text-amber">{f.name[0]}</span>
                  </div>
                  <div className="font-serif text-lg text-text-primary group-hover:text-cyan-tech transition-colors">{f.name}</div>
                  <div className="text-text-secondary/70 text-xs mt-1">{f.identity[0]}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
