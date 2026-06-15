import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '典籍智核·文脉探微',
    template: '%s | 典籍智核',
  },
  description:
    '典籍新生，数据里的文脉风华——用AI读懂数据里的人物命运。整合人物传记、历史地点、历史事件等多源数据，构建连接宏观历史与微观个体的关联叙事。',
  keywords: [
    '典籍智核',
    '文脉探微',
    '数字人文',
    '历史人物',
    '知识图谱',
    'CBDB',
    '诗词',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased bg-bg-dark text-text-primary min-h-screen">
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
