'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface QuestionCategory {
  name: string;
  icon: string;
  questions: string[];
}

const questionCategories: QuestionCategory[] = [
  {
    name: '人物生平',
    icon: '📖',
    questions: [
      '苏轼一生经历了哪些重大转折？',
      '李白为何被称为"诗仙"？',
      '杜甫的"诗史"之称从何而来？',
      '辛弃疾从武将到词人的转变',
      '李清照晚年的流离生涯',
    ],
  },
  {
    name: '关系网络',
    icon: '🕸️',
    questions: [
      '苏轼与黄庭坚的师友关系如何？',
      '李白与杜甫见过几次面？',
      '欧阳修与苏轼的师承关系',
      '王安石与苏轼的政见之争',
      '苏门四学士各自的特点',
    ],
  },
  {
    name: '时空轨迹',
    icon: '🗺️',
    questions: [
      '苏轼被贬黄州期间的生活状态',
      '李白的漫游路线经过哪些地方？',
      '杜甫为何多次入蜀？',
      '陆游在蜀地的从军经历',
      '白居易在杭州的政绩',
    ],
  },
  {
    name: '文学鉴赏',
    icon: '🎨',
    questions: [
      '苏轼《水调歌头》的创作背景',
      '李清照词风的转变与人生经历',
      '辛弃疾豪放词与苏轼的区别',
      '杜甫律诗的艺术成就',
      '陶渊明田园诗的哲学内涵',
    ],
  },
  {
    name: '历史关联',
    icon: '🔗',
    questions: [
      '北宋新旧党争对文人的影响',
      '安史之乱如何改变了杜甫的创作？',
      '南宋偏安局势下词人的心态',
      '唐代科举制度与文人命运',
      '牛李党争与李商隐的悲剧',
    ],
  },
  {
    name: '深度分析',
    icon: '🔬',
    questions: [
      '比较苏轼和辛弃疾的豪放词风格',
      '找出与苏轼有过交集的北宋文人，分析他们的共同特征',
      '唐宋八大家的文学主张有何异同？',
      '从诗词看宋代文人的贬谪心态',
      '中晚唐诗人对宋词发展的影响',
    ],
  },
];

export default function QAPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!res.ok) {
        throw new Error('请求失败');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('无法读取响应');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m
                  )
                );
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: '抱歉，AI分析服务暂时不可用，请稍后再试。' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

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
          <span className="font-serif text-lg text-cyan-tech">智能问答</span>
          <div className="flex-1" />
          <Link href="/figure/su-shi" className="text-sm text-text-secondary hover:text-cyan-tech transition-colors">
            人物画像
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            GraphRAG 就绪
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 pt-16 flex">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.length === 0 ? (
                <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="mb-6">
                    <Image
                      src="/logo.png"
                      alt="典籍智核"
                      width={72}
                      height={72}
                      className="rounded-xl opacity-80"
                    />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold text-text-primary mb-2">文脉智能问答</h2>
                  <p className="text-text-muted text-sm mb-8 text-center max-w-md">
                    基于 GraphRAG 的多跳推理引擎，支持复杂历史人物关联分析
                  </p>

                  {/* Category tabs */}
                  <div className="w-full max-w-2xl">
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {questionCategories.map((cat, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCategory(i)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                            activeCategory === i
                              ? 'bg-cyan-tech/20 text-cyan-tech border border-cyan-tech/40'
                              : 'bg-bg-card/40 text-text-secondary border border-border-subtle hover:border-cyan-tech/30 hover:text-text-primary'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Questions for active category */}
                    <div className="space-y-2.5">
                      {questionCategories[activeCategory].questions.map((q, i) => (
                        <button
                          key={`${activeCategory}-${i}`}
                          onClick={() => sendMessage(q)}
                          className="w-full text-left px-5 py-3.5 bg-bg-card/60 border border-border-subtle rounded-xl text-text-secondary hover:border-cyan-tech/50 hover:text-text-primary hover:bg-bg-card-hover transition-all duration-200 text-sm group"
                        >
                          <span className="text-cyan-tech mr-2 group-hover:scale-110 inline-block transition-transform">Q</span>
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Quick input hint */}
                    <div className="mt-6 text-center">
                      <p className="text-text-muted text-xs">
                        选择分类问题快速开始，或在下方输入框自由提问
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] ${
                          msg.role === 'user'
                            ? 'bg-primary-deep text-text-primary rounded-2xl rounded-tr-sm px-5 py-3'
                            : 'bg-bg-card/60 border border-border-subtle rounded-2xl rounded-tl-sm px-5 py-4'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-cyan-tech font-medium">文脉智核</span>
                            <span className="text-xs text-text-muted">· GraphRAG分析</span>
                          </div>
                        )}
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content || (
                            <span className="inline-flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-cyan-tech animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 rounded-full bg-cyan-tech animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 rounded-full bg-cyan-tech animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-border-subtle bg-bg-dark/80 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {/* Quick suggestions when in conversation */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {questionCategories.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const q = cat.questions[Math.floor(Math.random() * cat.questions.length)];
                        sendMessage(q);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-bg-card/40 border border-border-subtle rounded-full text-xs text-text-secondary hover:border-cyan-tech/30 hover:text-cyan-tech transition-all"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题，如：苏轼与黄庭坚的文学交流..."
                  rows={1}
                  className="flex-1 px-4 py-3 bg-bg-card/80 border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-cyan-tech transition-colors overflow-hidden"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="px-5 py-3 bg-cyan-tech text-bg-dark font-medium rounded-xl hover:bg-cyan-glow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-[44px] flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                <span>按 Enter 发送，Shift+Enter 换行</span>
                <span className="text-text-muted/60">@高阔研究出品</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
