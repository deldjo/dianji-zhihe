'use client';

import { useState } from 'react';

interface ModernEvent {
  year?: number;
  location: string;
  description: string;
}

interface CrossEraConnection {
  ancientLocation: string;
  ancientYear?: number;
  connection: string;
  modernEvents: ModernEvent[];
}

interface CrossEraCardProps {
  connections: CrossEraConnection[];
  figureName?: string;
}

export default function CrossEraCard({ connections, figureName }: CrossEraCardProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (!connections || connections.length === 0) {
    return (
      <div className="bg-bg-card/60 border border-border-subtle rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">🌏</div>
        <h3 className="font-serif text-lg font-semibold text-text-primary mb-2">
          跨时代空间连接
        </h3>
        <p className="text-text-muted text-sm">
          暂无跨时代连接数据
        </p>
        <p className="text-text-muted/60 text-xs mt-2">
          连接 CBDB 古代地点与上图生命事件图谱即可发现跨时代联系
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-tech/10 flex items-center justify-center">
          <span className="text-lg">🌏</span>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-text-primary">
            跨时代空间连接
          </h3>
          <p className="text-text-muted text-xs">
            {figureName}的足迹 × 近现代历史事件 · {connections.length}个连接
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-tech" /> 古代
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full rotate-45 bg-amber" /> 现代
          </span>
        </div>
      </div>

      {/* 连接网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((conn, i) => (
          <div
            key={i}
            className="bg-bg-card/60 border border-border-subtle rounded-xl overflow-hidden hover:border-cyan-tech/30 transition-all duration-300"
          >
            {/* 连接头 */}
            <div className="px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-tech flex-shrink-0" />
                <span className="font-serif text-text-primary font-semibold">
                  {conn.ancientLocation}
                </span>
                {conn.ancientYear && (
                  <span className="font-mono text-xs text-text-muted">
                    {conn.ancientYear}年
                  </span>
                )}
                <span className="flex-1 h-px bg-gradient-to-r from-cyan-tech/40 to-transparent" />
                <span className="w-2.5 h-2.5 rounded-sm rotate-45 bg-amber flex-shrink-0" />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {conn.connection}
              </p>
            </div>

            {/* 现代事件列表 */}
            <div className="px-5 py-3">
              <div className="text-xs text-text-muted mb-2 font-medium">
                近现代历史事件
              </div>
              <div className="space-y-2">
                {conn.modernEvents.slice(0, 3).map((event, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="w-2 h-2 rounded-sm rotate-45 bg-amber/70 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        {event.year && (
                          <span className="font-mono text-xs text-amber">
                            {event.year}年
                          </span>
                        )}
                        <span className="text-text-secondary">
                          {event.location}
                        </span>
                      </div>
                      <p className="text-text-muted text-xs mt-0.5 leading-relaxed">
                        {event.description.substring(0, 60)}
                        {event.description.length > 60 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {conn.modernEvents.length > 3 && (
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="text-xs text-cyan-tech hover:text-cyan-tech/80 transition-colors"
                  >
                    查看全部 {conn.modernEvents.length} 个事件 →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 pt-2 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-tech" />
          CBDB 古代轨迹地点
        </span>
        <span>→</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm rotate-45 bg-amber" />
          上图生命事件图谱
        </span>
      </div>
    </div>
  );
}
