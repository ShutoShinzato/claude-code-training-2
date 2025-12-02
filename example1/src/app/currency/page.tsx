'use client';

import { useState } from 'react';
import styles from './currency.module.css';

interface ExchangeRates {
  [key: string]: number;
}

const CURRENCIES = [
  { code: 'USD', name: '米ドル', symbol: '$' },
  { code: 'JPY', name: '日本円', symbol: '¥' },
  { code: 'EUR', name: 'ユーロ', symbol: '€' },
  { code: 'GBP', name: '英ポンド', symbol: '£' },
  { code: 'AUD', name: '豪ドル', symbol: 'A$' },
  { code: 'CAD', name: 'カナダドル', symbol: 'C$' },
  { code: 'CHF', name: 'スイスフラン', symbol: 'Fr' },
  { code: 'CNY', name: '中国元', symbol: '¥' },
  { code: 'KRW', name: '韓国ウォン', symbol: '₩' },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('JPY');
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const convertCurrency = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('有効な金額を入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ExchangeRate-API (無料、認証不要)
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );

      if (!response.ok) {
        throw new Error('為替レートの取得に失敗しました');
      }

      const data = await response.json();
      const rate = data.rates[toCurrency];

      if (!rate) {
        throw new Error('指定された通貨ペアが見つかりません');
      }

      const convertedAmount = parseFloat(amount) * rate;
      setResult(convertedAmount);
      setRates(data.rates);
      setLastUpdate(new Date().toLocaleString('ja-JP'));
    } catch (err) {
      setError(err instanceof Error ? err.message : '変換に失敗しました');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // 数字とドットのみ許可
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.converterBox}>
        <h1 className={styles.title}>通貨換算ツール</h1>
        <p className={styles.subtitle}>リアルタイムの為替レートで換算</p>

        <div className={styles.inputSection}>
          <div className={styles.amountInput}>
            <label className={styles.label}>金額</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="金額を入力"
              className={styles.input}
            />
          </div>

          <div className={styles.currencyRow}>
            <div className={styles.currencySelect}>
              <label className={styles.label}>換算元</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={styles.select}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={swapCurrencies} className={styles.swapButton}>
              ⇄
            </button>

            <div className={styles.currencySelect}>
              <label className={styles.label}>換算先</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={styles.select}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convertCurrency}
            disabled={loading}
            className={styles.convertButton}
          >
            {loading ? '変換中...' : '換算する'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {result !== null && (
          <div className={styles.resultSection}>
            <div className={styles.resultBox}>
              <div className={styles.resultFrom}>
                <span className={styles.resultAmount}>{parseFloat(amount).toLocaleString()}</span>
                <span className={styles.resultCurrency}>{fromCurrency}</span>
              </div>
              <div className={styles.resultEquals}>=</div>
              <div className={styles.resultTo}>
                <span className={styles.resultAmount}>{result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</span>
                <span className={styles.resultCurrency}>{toCurrency}</span>
              </div>
            </div>
            {lastUpdate && (
              <p className={styles.updateTime}>最終更新: {lastUpdate}</p>
            )}
          </div>
        )}

        {rates && (
          <div className={styles.ratesSection}>
            <h3 className={styles.ratesTitle}>
              主要通貨レート (1 {fromCurrency} =)
            </h3>
            <div className={styles.ratesGrid}>
              {CURRENCIES.filter(c => c.code !== fromCurrency).map((currency) => (
                <div key={currency.code} className={styles.rateCard}>
                  <span className={styles.rateCurrency}>
                    {currency.symbol} {currency.code}
                  </span>
                  <span className={styles.rateValue}>
                    {rates[currency.code]?.toFixed(4) || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
