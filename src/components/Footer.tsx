'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle/50 bg-bg-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Brand */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="典籍智核"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <div className="font-serif text-lg font-bold text-text-primary">典籍智核</div>
              <div className="text-text-muted text-xs tracking-wider">文脉探微 · Ancient Wisdom Meets Modern AI</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="text-text-secondary hover:text-cyan-tech transition-colors">首页</Link>
            <Link href="/figure/su-shi" className="text-text-secondary hover:text-cyan-tech transition-colors">人物画像</Link>
            <Link href="/qa" className="text-text-secondary hover:text-cyan-tech transition-colors">智能问答</Link>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="text-text-muted text-xs">@高阔研究出品</div>
            <div className="text-text-muted/50 text-xs">第十一届上海图书馆开放数据竞赛</div>
          </div>
        </div>

        {/* Bottom divider + tagline */}
        <div className="mt-8 pt-6 border-t border-border-subtle/30 text-center">
          <p className="text-text-muted/50 text-xs tracking-widest font-serif">
            典籍新生，数据里的文脉风华
          </p>
        </div>
      </div>
    </footer>
  );
}
