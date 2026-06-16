'use client';

/**
 * 高德地图 - 时空轨迹可视化
 * 使用高德 JS API v2
 * 
 * 接入方式：在 .env.local 中设置 NEXT_PUBLIC_AMAP_KEY
 * 如无 Key，降级为 Canvas 投影地图
 */

import { useEffect, useRef, useState } from 'react';
import { TrajectoryPoint } from '@/lib/mock-data';

// 古代城市 → 现代经纬度映射表（fallback）
const CITY_COORDS: Record<string, [number, number]> = {
  '眉州': [103.85, 30.08],
  '汴京': [114.35, 34.80],
  '长安': [108.94, 34.26],
  '杭州': [120.15, 30.28],
  '黄州': [114.87, 30.45],
  '惠州': [114.42, 23.11],
  '儋州': [109.58, 19.52],
  '常州': [119.97, 31.77],
  '苏州': [120.62, 31.30],
  '凤翔': [107.40, 34.52],
  '密州': [119.41, 35.99],
  '徐州': [117.18, 34.26],
  '湖州': [120.10, 30.88],
  '白帝城': [109.54, 31.04],
  '当涂': [118.50, 31.57],
  '巩县': [112.97, 34.78],
  '洛阳': [112.45, 34.62],
  '庐山': [115.99, 29.56],
  '夔州': [109.47, 31.04],
  '湘江': [112.97, 28.23],
  '济南': [117.00, 36.67],
  '建康': [118.78, 32.06],
  '临安': [120.15, 30.28],
  '上饶': [117.97, 28.45],
  '福州': [119.30, 26.08],
  '绍兴': [120.58, 30.00],
  '铅山': [117.71, 28.55],
  '青州': [118.48, 36.69],
  '临川': [116.36, 27.95],
  '江宁': [118.78, 32.06],
  '新郑': [113.74, 34.40],
  '江州': [116.00, 29.71],
  '梓州': [105.09, 31.65],
  '郑州': [113.65, 34.76],
  '彭泽': [116.55, 29.90],
  '柴桑': [115.99, 29.71],
  '绵州': [104.73, 31.47],
  '滁州': [118.32, 32.30],
  '颖州': [115.81, 32.93],
  '夷陵': [111.28, 30.77],
  '山阴': [120.58, 30.00],
  '南郑': [107.03, 33.07],
  '盩厔': [108.33, 34.16],
  '碎叶城': [75.99, 42.78],
  '安陆': [113.69, 31.26],
  '江陵': [112.18, 30.35],
  '郓州': [116.58, 35.60],
  '河内': [112.93, 35.09],
};

const typeColors: Record<string, string> = {
  '仕途': '#06b6d4',
  '流放': '#ef4444',
  '游历': '#8b5cf6',
  '故里': '#10b981',
  '生活': '#d97706',
};

// 尝试获取经纬度
function getCoords(point: TrajectoryPoint): [number, number] | null {
  // 直接用已有坐标
  if (point.lat && point.lng) {
    return [point.lng, point.lat];
  }
  // 从城市名映射
  const mapped = CITY_COORDS[point.location];
  if (mapped) return mapped;
  // 模糊匹配
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (city.includes(point.location) || point.location.includes(city)) {
      return coords;
    }
  }
  return null;
}

interface AmapProps {
  points: TrajectoryPoint[];
  modernEvents?: Array<{ year?: number; location: string; description: string }>;
  figureName?: string;
}

export default function Amap({ points, modernEvents = [], figureName }: AmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [hasAmap, setHasAmap] = useState(false);
  const [mapKey, setMapKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 检查是否有高德 Key
  useEffect(() => {
    const amapKey = process.env.NEXT_PUBLIC_AMAP_KEY;
    if (amapKey) {
      setMapKey(amapKey);
    }
  }, []);

  // 加载高德地图
  useEffect(() => {
    if (!mapKey || !containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;

    // 动态加载高德 JS API
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${mapKey}&plugin=AMap.Scale,AMap.InfoWindow`;
    script.async = true;
    script.onload = () => {
      if (!mounted) return;
      try {
        const AMap = (window as unknown as { AMap: unknown }).AMap;
        if (!AMap) return;

        // 计算中心点
        const coords = points.map(getCoords).filter(Boolean) as [number, number][];
        const center = coords.length > 0
          ? coords.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]], [0, 0])
              .map(v => v / coords.length) as [number, number]
          : [116.4, 39.9];

        const map = new (AMap as { new(opts: unknown): unknown })(
          Object.assign({}, {
            container,
            center,
            zoom: 4,
            mapStyle: 'amap://styles/darkblue',
          })
        );

        mapRef.current = map;

        // 绘制轨迹
        const amapPoints: unknown[] = [];
        coords.forEach((coord, i) => {
          const point = points[i];
          const color = typeColors[point.type] || '#06b6d4';

          // 标注点
          const marker = new (AMap as { new(opts: unknown): unknown }({
            position: coord,
            anchor: 'bottom-center',
            content: `<div style="
              background:${color}; width:12px; height:12px;
              border-radius:50%; border:2px solid white;
              box-shadow: 0 0 8px ${color}80;
            "></div>`,
            title: `${point.year}年 · ${point.location}`,
          }));
          (map as unknown as { add(m: unknown): void }).add(marker);
          amapPoints.push(marker);

          // 标签
          const text = new (AMap as { new(opts: unknown): unknown }({
            position: coord,
            anchor: 'top-center',
            content: `<div style="
              background:rgba(30,40,70,0.9); color:white; padding:2px 6px;
              border-radius:4px; font-size:11px; white-space:nowrap;
              border:1px solid ${color}40; font-family:sans-serif;
            ">${point.location} ${point.year}</div>`,
            offset: new (AMap as { new(x: number, y: number): unknown })(0, -14),
          }));
          (map as unknown as { add(t: unknown): void }).add(text);
        });

        // 绘制轨迹线
        if (coords.length > 1) {
          const line = new (AMap as { new(opts: unknown): unknown }({
            path: coords,
            strokeColor: '#06b6d4',
            strokeWeight: 2,
            strokeOpacity: 0.6,
            lineDash: [4, 4],
          }));
          (map as unknown as { add(l: unknown): void }).add(line);
        }

        // 绘制现代事件标记
        modernEvents.forEach((event) => {
          if (!event.location) return;
          const eventCoord = CITY_COORDS[event.location];
          if (!eventCoord) return;

          const marker = new (AMap as { new(opts: unknown): unknown }({
            position: eventCoord,
            anchor: 'center',
            content: `<div style="
              width:16px; height:16px;
              background:#d97706;
              border:2px solid white;
              transform:rotate(45deg);
              box-shadow:0 0 6px #d9770680;
            "></div>`,
            title: `${event.year} · ${event.description.substring(0, 30)}`,
          }));
          (map as unknown as { add(m: unknown): void }).add(marker);
        });

        setHasAmap(true);
      } catch (e) {
        console.error('高德地图初始化失败:', e);
        setError('地图加载失败，使用备选视图');
      }
    };
    script.onerror = () => setError('地图脚本加载失败');
    document.head.appendChild(script);

    return () => {
      mounted = false;
    };
  }, [mapKey, points, modernEvents]);

  // 无高德地图时显示说明
  if (!hasAmap && !error) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-dark/50 p-6 text-center">
        <div className="mb-3 text-text-muted text-sm">
          🗺️ 时空轨迹地图
        </div>
        <p className="text-text-secondary text-sm mb-3">
          配置 <code className="bg-bg-card px-1 rounded text-amber">NEXT_PUBLIC_AMAP_KEY</code> 以启用高德矢量地图
        </p>
        <p className="text-text-muted text-xs">
          当前显示 {points.length} 个轨迹点 · {modernEvents.length} 个近现代事件
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-dark/50 p-6">
        <p className="text-text-muted text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden" style={{ height: 600 }} />
  );
}
