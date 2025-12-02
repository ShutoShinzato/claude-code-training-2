import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const features = [
  {
    title: 'TODOリスト',
    description: 'LocalStorage永続化付きのTODO管理',
    icon: '✅',
    href: '/todo',
    color: '#667eea',
  },
  {
    title: 'GitHubユーザー検索',
    description: 'GitHubのユーザー情報とリポジトリを検索',
    icon: '🐙',
    href: '/github',
    color: '#24292f',
  },
  {
    title: '通貨換算ツール',
    description: 'リアルタイムの為替レートで通貨を換算',
    icon: '💱',
    href: '/currency',
    color: '#764ba2',
  },
  {
    title: '天気予報',
    description: '世界中の都市の天気情報を検索',
    icon: '🌤️',
    href: '/weather',
    color: '#667eea',
  },
  {
    title: 'Markdownエディター',
    description: 'リアルタイムプレビュー付きエディター',
    icon: '📝',
    href: '/markdown',
    color: '#5a67d8',
  },
  {
    title: 'ジオコーディング',
    description: '住所から緯度経度を検索',
    icon: '🗺️',
    href: '/geocoding',
    color: '#43e97b',
  },
  {
    title: '画像検索ギャラリー',
    description: '高品質な画像を検索・閲覧',
    icon: '🖼️',
    href: '/gallery',
    color: '#1a202c',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.intro}>
          <h1>Claude Code トレーニングプロジェクト</h1>
          <p>Next.js 15とClaude Codeで作成された7つのサンプルアプリケーション</p>
        </div>

        <div className={styles.features}>
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={styles.featureCard}
              style={{ borderColor: feature.color }}
            >
              <div className={styles.featureIcon} style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureDescription}>{feature.description}</p>
            </Link>
          ))}
        </div>

        <div className={styles.footer}>
          <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
            Next.js Docs →
          </a>
          <a href="https://code.claude.ai" target="_blank" rel="noopener noreferrer">
            Claude Code →
          </a>
        </div>
      </main>
    </div>
  );
}
