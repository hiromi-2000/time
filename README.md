# p5.js Music Video
おためし

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
## 技術スタック

- [p5.js](https://p5js.org/) - クリエイティブコーディング
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- [Vite](https://vitejs.dev/) - ビルドツール
- [Biome](https://biomejs.dev/) - linter/formatter 
