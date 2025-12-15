'use client';

import { useState } from 'react';
import styles from './geocoding.module.css';

interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
  };
}

interface SearchHistory {
  id: string;
  query: string;
  result: GeocodingResult;
  timestamp: number;
}

export default function GeocodingPage() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const searchAddress = async () => {
    if (!address.trim()) {
      setError('住所を入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Nominatim API (OpenStreetMap の無料ジオコーディングAPI)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'NextJS-Geocoding-App',
          },
        },
      );

      if (!response.ok) {
        throw new Error('ジオコーディングに失敗しました');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error('住所が見つかりませんでした');
      }

      const geoResult = data[0];
      setResult(geoResult);

      // 検索履歴に追加（LocalStorage）
      const newHistory: SearchHistory = {
        id: Date.now().toString(),
        query: address,
        result: geoResult,
        timestamp: Date.now(),
      };

      const updatedHistory = [newHistory, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('geocoding-history', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 履歴をロード
  useState(() => {
    const saved = localStorage.getItem('geocoding-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  });

  const loadFromHistory = (item: SearchHistory) => {
    setAddress(item.query);
    setResult(item.result);
    setError('');
  };

  const clearHistory = () => {
    if (confirm('検索履歴を削除しますか?')) {
      setHistory([]);
      localStorage.removeItem('geocoding-history');
    }
  };

  const copyCoordinates = () => {
    if (result) {
      const coords = `${result.lat}, ${result.lon}`;
      navigator.clipboard.writeText(coords);
      alert(`座標をコピーしました: ${coords}`);
    }
  };

  const openInGoogleMaps = () => {
    if (result) {
      window.open(`https://www.google.com/maps?q=${result.lat},${result.lon}`, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainBox}>
        <h1 className={styles.title}>ジオコーディング検索</h1>
        <p className={styles.subtitle}>住所から緯度経度を検索</p>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
            placeholder="住所を入力 (例: 東京タワー、東京駅)"
            className={styles.input}
          />
          <button onClick={searchAddress} disabled={loading} className={styles.searchButton}>
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {result && (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>検索結果</h2>

            <div className={styles.resultInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>📍 住所:</span>
                <span className={styles.value}>{result.display_name}</span>
              </div>

              <div className={styles.coordinates}>
                <div className={styles.coordItem}>
                  <span className={styles.coordLabel}>緯度 (Latitude)</span>
                  <span className={styles.coordValue}>{result.lat}</span>
                </div>
                <div className={styles.coordItem}>
                  <span className={styles.coordLabel}>経度 (Longitude)</span>
                  <span className={styles.coordValue}>{result.lon}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button onClick={copyCoordinates} className={styles.actionButton}>
                  📋 座標をコピー
                </button>
                <button onClick={openInGoogleMaps} className={styles.actionButton}>
                  🗺️ Google Mapsで開く
                </button>
              </div>
            </div>

            <div className={styles.mapEmbed}>
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  parseFloat(result.lon) - 0.01
                },${parseFloat(result.lat) - 0.01},${
                  parseFloat(result.lon) + 0.01
                },${parseFloat(result.lat) + 0.01}&layer=mapnik&marker=${result.lat},${result.lon}`}
                title="Map"
                className={styles.map}
              />
              <small className={styles.mapCredit}>
                Map data ©{' '}
                <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
                  OpenStreetMap
                </a>{' '}
                contributors
              </small>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3 className={styles.historyTitle}>検索履歴</h3>
              <button onClick={clearHistory} className={styles.clearHistoryButton}>
                クリア
              </button>
            </div>

            <div className={styles.historyList}>
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={styles.historyItem}
                >
                  <div className={styles.historyQuery}>{item.query}</div>
                  <div className={styles.historyCoords}>
                    {item.result.lat.slice(0, 8)}, {item.result.lon.slice(0, 8)}
                  </div>
                  <div className={styles.historyTime}>
                    {new Date(item.timestamp).toLocaleString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.examples}>
          <p className={styles.examplesTitle}>試してみる:</p>
          <div className={styles.exampleButtons}>
            {['東京タワー', '東京駅', '富士山', '大阪城', '札幌時計台'].map((place) => (
              <button
                key={place}
                onClick={() => {
                  setAddress(place);
                  setTimeout(() => searchAddress(), 100);
                }}
                className={styles.exampleButton}
              >
                {place}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
