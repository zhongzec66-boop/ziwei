'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

const palaceNames = [
  '夫妻', '兄弟', '命宫', '父母',
  '子女', '福德',
  '财帛', '田宅',
  '疾厄', '迁移', '交友', '官禄',
];

export default function HomePage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="ziwei-home">
      <header className="ziwei-header">
        <div className="ziwei-wrap ziwei-navigation">
          <Link href="/" className="ziwei-brand">紫微研究</Link>
          <nav aria-label="主导航">
            <Link href="/knowledge">星曜</Link>
            <Link href="/library">古籍</Link>
            <button type="button" onClick={toggle}>
              {theme === 'dark' ? '浅色' : '深色'}
            </button>
          </nav>
        </div>
      </header>

      <main className="ziwei-wrap">
        <section className="ziwei-hero">
          <div>
            <h1>紫微斗数<span>命盘</span></h1>
            <p>输入出生日期与时间，查看十二宫、十四主星和四化。填写出生地，还可以按真太阳时校正时辰。</p>
            <div className="ziwei-actions">
              <Link href="/chart" className="ziwei-action">开始排盘 <span aria-hidden="true">↗</span></Link>
              <Link href="/heming" className="ziwei-text-link">双人合盘</Link>
            </div>
          </div>
          <figure className="ziwei-preview">
            <div className="ziwei-palaces" aria-hidden="true">
              <div className="ziwei-plate-center">
                <div className="ziwei-plate-symbol">✦</div>
                <span>十二宫</span>
              </div>
              {palaceNames.map(name => <span key={name}>{name}</span>)}
            </div>
            <figcaption>十二宫布局示意</figcaption>
          </figure>
        </section>

        <section className="ziwei-resources" aria-label="学习资料">
          <Link href="/knowledge">
            <h2>星曜知识库 <span aria-hidden="true">↗</span></h2>
            <p>查阅十四主星的特性、庙旺与四化。</p>
          </Link>
          <Link href="/library">
            <h2>紫微古籍 <span aria-hidden="true">↗</span></h2>
            <p>阅读《紫微斗数全书》等古籍原文。</p>
          </Link>
        </section>
      </main>

      <footer className="ziwei-wrap ziwei-footer">
        <span>紫微斗数 · 传统术数研究</span>
        <div><a href="https://github.com/Renhuai123/ziwei-doushu">源码出处</a><Link href="/terms">服务条款</Link><Link href="/privacy">隐私政策</Link></div>
      </footer>
    </div>
  );
}
