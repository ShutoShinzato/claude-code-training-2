'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './gallery.module.css';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  description: string;
  likes: number;
}

// デモ用のダミー画像データ
const DEMO_IMAGES: UnsplashImage[] = [
  {
    id: '1',
    urls: {
      small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    },
    alt_description: '山の風景',
    user: { name: 'Demo User', username: 'demo' },
    description: '美しい山の風景',
    likes: 100,
  },
  {
    id: '2',
    urls: {
      small: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      regular: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    },
    alt_description: '森の風景',
    user: { name: 'Demo User', username: 'demo' },
    description: '緑豊かな森',
    likes: 85,
  },
  {
    id: '3',
    urls: {
      small: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
      regular: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      full: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    },
    alt_description: '自然の風景',
    user: { name: 'Demo User', username: 'demo' },
    description: '穏やかな自然',
    likes: 120,
  },
];

export default function GalleryPage() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);

  const searchImages = async () => {
    if (!query.trim()) {
      setError('検索キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Unsplash API (実際には API キーが必要)
      // const API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

      // デモモード: ダミー画像を表示
      await new Promise(resolve => setTimeout(resolve, 800));
      setImages(DEMO_IMAGES);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image: UnsplashImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>画像検索ギャラリー</h1>
        <p className={styles.subtitle}>Unsplash APIで高品質な画像を検索</p>

        <div className={styles.searchArea}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchImages()}
            placeholder="検索キーワードを入力 (例: nature, city, ocean)"
            className={styles.input}
          />
          <button onClick={searchImages} disabled={loading} className={styles.searchButton}>
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        <div className={styles.examples}>
          {['Nature', 'City', 'Ocean', 'Mountain', 'Architecture'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => {
                setQuery(keyword);
                setTimeout(() => searchImages(), 100);
              }}
              className={styles.exampleButton}
            >
              {keyword}
            </button>
          ))}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.apiNote}>
          <p>⚠️ デモモード: 実際のAPIを使用するには、Unsplash APIキーを取得してください</p>
          <a
            href="https://unsplash.com/developers"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.apiLink}
          >
            Unsplash API →
          </a>
        </div>
      </div>

      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((image) => (
            <div
              key={image.id}
              className={styles.imageCard}
              onClick={() => openModal(image)}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={image.urls.small}
                  alt={image.alt_description || 'Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.imageInfo}>
                <p className={styles.imageUser}>📷 {image.user.name}</p>
                <p className={styles.imageLikes}>❤️ {image.likes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ✕
            </button>
            <div className={styles.modalImageWrapper}>
              <Image
                src={selectedImage.urls.regular}
                alt={selectedImage.alt_description || 'Image'}
                fill
                sizes="90vw"
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalInfo}>
              <h3 className={styles.modalTitle}>
                {selectedImage.description || selectedImage.alt_description || '画像'}
              </h3>
              <p className={styles.modalUser}>
                撮影者: <strong>{selectedImage.user.name}</strong> (@{selectedImage.user.username})
              </p>
              <div className={styles.modalActions}>
                <span className={styles.modalLikes}>❤️ {selectedImage.likes} いいね</span>
                <a
                  href={selectedImage.urls.full}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  ダウンロード
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
