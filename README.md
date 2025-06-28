# p5.js Music Video

TypeScript + Vite + Biome v2を使用したp5.jsによるmusic videoプロジェクトです。

## 特徴

- **p5.js**: クリエイティブなビジュアライゼーション
- **TypeScript**: 型安全な開発環境
- **Vite**: 高速な開発サーバーとビルド
- **Biome v2**: モダンなlinter/formatter
- **静的音声ファイル**: 音楽に合わせたビジュアル表現

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## スクリプト

- `pnpm dev` - 開発サーバーを起動
- `pnpm build` - プロダクション用にビルド
- `pnpm preview` - ビルド結果をプレビュー
- `pnpm lint` - コードをlint
- `pnpm lint:fix` - lint問題を自動修正
- `pnpm format` - コードをフォーマット
- `pnpm check` - lint + format をチェック

## 使用方法

1. ページが読み込まれたら、「Play」ボタンをクリックして音楽を再生
2. 音楽に合わせてビジュアライゼーションが変化します
3. マウスクリックでパーティクルを生成できます
4. 「Pause」ボタンで一時停止

## ファイル構成

```
├── src/
│   ├── main.ts      # メインアプリケーション、オーディオ制御
│   └── sketch.ts    # p5.jsビジュアライゼーション
├── index.html       # HTMLエントリーポイント
├── vite.config.ts   # Vite設定
├── tsconfig.json    # TypeScript設定
├── biome.json       # Biome設定
└── ttttt.mp3        # 音声ファイル
```

## カスタマイズ

### 音声ファイルの変更

`src/main.ts`の12行目で音声ファイルのパスを変更できます：

```typescript
audioElement = new Audio('/your-audio-file.mp3')
```

### ビジュアルエフェクトの変更

`src/sketch.ts`でp5.jsのビジュアライゼーションをカスタマイズできます。

### 色の変更

`src/sketch.ts`の50-56行目でカラーパレットを変更できます。

## 技術スタック

- [p5.js](https://p5js.org/) - クリエイティブコーディング
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- [Vite](https://vitejs.dev/) - ビルドツール
- [Biome](https://biomejs.dev/) - linter/formatter 
