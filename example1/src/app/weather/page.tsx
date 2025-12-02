'use client';

import { useState } from 'react';
import styles from './weather.module.css';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('都市名を入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      // OpenWeatherMap API (デモ用の公開APIキーを使用、本番環境では環境変数を使用)
      // 注: 実際の使用時はAPIキーを取得してください https://openweathermap.org/api
      const API_KEY = 'demo'; // 実際には環境変数 process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY を使用

      // デモモード: APIキーがdemoの場合はダミーデータを返す
      if (API_KEY === 'demo') {
        // デモ用のダミーデータ
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather({
          name: city,
          sys: { country: 'JP' },
          main: {
            temp: 22.5,
            feels_like: 21.8,
            humidity: 65,
            pressure: 1013,
          },
          weather: [{
            main: 'Clouds',
            description: '曇り',
            icon: '03d',
          }],
          wind: {
            speed: 3.5,
          },
        });
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric&lang=ja`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('都市が見つかりませんでした');
        }
        throw new Error('天気情報の取得に失敗しました');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherEmoji = (main: string) => {
    const emojiMap: { [key: string]: string } = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
    };
    return emojiMap[main] || '🌤️';
  };

  return (
    <div className={styles.container}>
      <div className={styles.weatherBox}>
        <h1 className={styles.title}>天気予報</h1>
        <p className={styles.subtitle}>都市名を入力して天気を確認</p>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            placeholder="都市名を入力 (例: Tokyo, London, Paris)"
            className={styles.input}
          />
          <button onClick={fetchWeather} disabled={loading} className={styles.searchButton}>
            {loading ? '検索中...' : '検索'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {weather && (
          <div className={styles.weatherCard}>
            <div className={styles.weatherHeader}>
              <div className={styles.location}>
                <h2 className={styles.cityName}>
                  {weather.name}, {weather.sys.country}
                </h2>
              </div>
              <div className={styles.weatherIcon}>
                <span className={styles.emoji}>{getWeatherEmoji(weather.weather[0].main)}</span>
              </div>
            </div>

            <div className={styles.mainWeather}>
              <div className={styles.temperature}>
                <span className={styles.temp}>{Math.round(weather.main.temp)}</span>
                <span className={styles.unit}>°C</span>
              </div>
              <p className={styles.description}>{weather.weather[0].description}</p>
              <p className={styles.feelsLike}>
                体感温度: {Math.round(weather.main.feels_like)}°C
              </p>
            </div>

            <div className={styles.weatherDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💧</span>
                <div>
                  <p className={styles.detailLabel}>湿度</p>
                  <p className={styles.detailValue}>{weather.main.humidity}%</p>
                </div>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>🌬️</span>
                <div>
                  <p className={styles.detailLabel}>風速</p>
                  <p className={styles.detailValue}>{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>🔽</span>
                <div>
                  <p className={styles.detailLabel}>気圧</p>
                  <p className={styles.detailValue}>{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>

            <div className={styles.apiNote}>
              <p>⚠️ デモモード: 実際のAPIを使用するには、OpenWeatherMapでAPIキーを取得してください</p>
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.apiLink}
              >
                OpenWeatherMap API →
              </a>
            </div>
          </div>
        )}

        <div className={styles.examples}>
          <p className={styles.examplesTitle}>試してみる:</p>
          <div className={styles.exampleButtons}>
            {['Tokyo', 'London', 'New York', 'Paris', 'Sydney'].map((cityName) => (
              <button
                key={cityName}
                onClick={() => {
                  setCity(cityName);
                  setTimeout(() => {
                    setCity(cityName);
                    fetchWeather();
                  }, 100);
                }}
                className={styles.exampleButton}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
