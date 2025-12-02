'use client';

import { useState } from 'react';
import styles from './markdown.module.css';

const SAMPLE_MARKDOWN = `# Markdown プレビューエディター

このエディターでMarkdownをリアルタイムでプレビューできます。

## 機能

- **リアルタイムプレビュー**: 入力と同時にプレビューが更新されます
- **基本的なMarkdown構文**: 見出し、リスト、リンク、コードブロックなど
- **エクスポート機能**: Markdownファイルとしてダウンロード可能

## 使い方

1. 左側のエディターにMarkdownを入力
2. 右側でリアルタイムプレビュー
3. 「エクスポート」ボタンでダウンロード

### サポートされる構文

- **太字**: \`**太字**\`
- *斜体*: \`*斜体*\`
- [リンク](https://example.com): \`[テキスト](URL)\`
- \`インラインコード\`: \`\\\`コード\\\`\`

#### リスト

- 項目1
- 項目2
  - サブ項目

1. 番号付き項目1
2. 番号付き項目2

#### コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

---

> 引用文
> 複数行の引用も可能

**お試しください！**
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);

  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('エディターの内容をクリアしますか?')) {
      setMarkdown('');
    }
  };

  // シンプルなMarkdownパーサー（基本的な構文のみサポート）
  const parseMarkdown = (md: string): string => {
    let html = md;

    // コードブロック（```で囲まれた部分）
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code)}</code></pre>`;
    });

    // インラインコード
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 見出し
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

    // 太字
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 斜体
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // リンク
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // 水平線
    html = html.replace(/^---$/gim, '<hr>');

    // 引用
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // 番号付きリスト
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

    // 箇条書きリスト
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^ {2}- (.+)$/gim, '<li class="indent">$1</li>');

    // 段落
    html = html
      .split('\n\n')
      .map((para) => {
        if (para.match(/^<(h[1-6]|pre|hr|blockquote|li)/)) {
          return para;
        }
        return `<p>${para}</p>`;
      })
      .join('\n');

    return html;
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Markdown エディター</h1>
        <div className={styles.actions}>
          <button onClick={handleClear} className={styles.clearButton}>
            クリア
          </button>
          <button onClick={handleExport} className={styles.exportButton}>
            エクスポート
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span>📝 エディター</span>
            <span className={styles.charCount}>{markdown.length} 文字</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={styles.textarea}
            placeholder="ここにMarkdownを入力してください..."
          />
        </div>

        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <span>👁️ プレビュー</span>
          </div>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>
      </div>

      <div className={styles.tips}>
        <h3>💡 Markdownのヒント</h3>
        <ul>
          <li>
            <code>#</code> 見出し (# H1, ## H2, ### H3)
          </li>
          <li>
            <code>**太字**</code> または <code>*斜体*</code>
          </li>
          <li>
            <code>[リンク](URL)</code> でリンク作成
          </li>
          <li>
            <code>`コード`</code> でインラインコード
          </li>
          <li>
            <code>```言語名</code> でコードブロック
          </li>
          <li>
            <code>- </code> または <code>1. </code> でリスト
          </li>
        </ul>
      </div>
    </div>
  );
}
