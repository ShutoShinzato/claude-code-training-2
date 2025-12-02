'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './github.module.css';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string;
  blog: string;
  company: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

export default function GitHubSearchPage() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);

    try {
      // ユーザー情報取得
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('ユーザーが見つかりませんでした');
        }
        throw new Error('ユーザー情報の取得に失敗しました');
      }
      const userData = await userRes.json();
      setUser(userData);

      // リポジトリ情報取得（最新5件）
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
      );
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setRepos(reposData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <h1 className={styles.title}>GitHub ユーザー検索</h1>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUser()}
            placeholder="GitHubユーザー名を入力..."
            className={styles.input}
          />
          <button onClick={searchUser} disabled={loading} className={styles.searchButton}>
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {user && (
          <div className={styles.userCard}>
            <div className={styles.userHeader}>
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={100}
                height={100}
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <h2 className={styles.userName}>{user.name || user.login}</h2>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.username}
                >
                  @{user.login}
                </a>
                {user.bio && <p className={styles.bio}>{user.bio}</p>}
              </div>
            </div>

            <div className={styles.userDetails}>
              {user.location && (
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>📍 場所:</span>
                  <span>{user.location}</span>
                </div>
              )}
              {user.company && (
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>🏢 所属:</span>
                  <span>{user.company}</span>
                </div>
              )}
              {user.blog && (
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>🔗 ブログ:</span>
                  <a href={user.blog} target="_blank" rel="noopener noreferrer">
                    {user.blog}
                  </a>
                </div>
              )}
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{user.public_repos}</span>
                <span className={styles.statLabel}>リポジトリ</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{user.followers}</span>
                <span className={styles.statLabel}>フォロワー</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{user.following}</span>
                <span className={styles.statLabel}>フォロー中</span>
              </div>
            </div>

            {repos.length > 0 && (
              <div className={styles.reposSection}>
                <h3 className={styles.reposTitle}>最近更新されたリポジトリ</h3>
                <div className={styles.reposList}>
                  {repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.repoCard}
                    >
                      <div className={styles.repoHeader}>
                        <h4 className={styles.repoName}>{repo.name}</h4>
                        <span className={styles.repoStars}>⭐ {repo.stargazers_count}</span>
                      </div>
                      {repo.description && <p className={styles.repoDesc}>{repo.description}</p>}
                      <div className={styles.repoFooter}>
                        {repo.language && <span className={styles.repoLang}>{repo.language}</span>}
                        <span className={styles.repoDate}>
                          更新: {new Date(repo.updated_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
