# component-catalog

Bun + React で、コンポーネントカタログと単体テストを**追加の依存なし**で用意する最小サンプル。

Storybook / react-cosmos / Ladle を検討したうえで、いずれも採用せずに同等の目的を満たした構成を、動く形で切り出したものです。

## 何ができるか

- **コンポーネント単体の見た目を専用 URL で確認できる**（`/catalog.html?c=<コンポーネント名>&f=<fixture 名>`）
- **コンポーネントの単体テストが書ける**（happy-dom + @testing-library/react）
- カタログ用の `*.fixture.tsx` を**テストからそのまま再利用できる**

カタログは開発サーバーでのみ配信され、本番ビルドには含まれません。

## 動かす

```shell
bun install

bun run catalog    # カタログ付きで起動 → http://localhost:4000/catalog.html
bun run dev        # 本体アプリのみ
bun run test       # 単体テスト
bun run typecheck  # tsc --noEmit
bun run build      # 本番ビルド (./dist)
```

`PORT` で待ち受けポートを変えられます。

```shell
PORT=4321 bun run catalog
```

## 構成

```
component-catalog/
├── happydom.ts              # bun test 用の DOM セットアップ (--preload で読む)
├── testing-library.d.ts     # jest-dom のマッチャーを bun:test の expect に型で認識させる
├── tsconfig.json
├── package.json
└── src/
    ├── index.ts             # Bun.serve() エントリ。catalog.html を env gate で登録
    ├── index.html           # 本体アプリ (HTML)
    ├── app.tsx              # 本体アプリ (React)
    ├── catalog.html         # カタログ (HTML)
    ├── catalog.tsx          # カタログ (fixture の登録リスト・選択・一覧)
    ├── providers.tsx        # カタログと本体アプリで共有するラッパー
    └── components/
        ├── ConfirmDialog.tsx          # 対象コンポーネント (汎用の確認ダイアログ)
        ├── ConfirmDialog.fixture.tsx  # カタログ用の表示パターン
        └── ConfirmDialog.test.tsx     # 単体テスト
```

fixture とテストは対象コンポーネントと同じディレクトリに置きます（コロケーション）。

## 設計上の判断

### カタログに専用ツールを使わない

Storybook / react-cosmos / Ladle は、いずれもバンドラーとして vite か webpack を必要とします。ビルドが `bun build` の場合、ビルド経路が2本立てになり、path alias や環境変数の扱いを2箇所で揃え続けることになります。

クリーンな環境での実測は以下でした（macOS arm64、`node_modules` 配下の `package.json` の実数）。

| 方式 | パッケージ数 | サイズ |
| ------------- | ------------- | ------------- |
| このリポジトリの構成 | 0 | 0 |
| react-cosmos + vite + plugin | 174 | 60MB |
| Storybook + @storybook/react-vite + vite | 199 | 146MB |
| Ladle | 428 | 121MB |

「全体を俯瞰する UI が欲しい」なら専用ツールに分があります。「見たいコンポーネントを1つ開きたい」だけなら、`catalog.tsx` の40行で足ります。

なお単体テスト用の4パッケージ（`@happy-dom/global-registrator`、`@testing-library/*` 3つ）は、どのツールを選んでも別途必要になる分です。

### fixture は react-cosmos の形式に合わせる

`*.fixture.tsx` は素の React element を default export します。

```tsx
export default {
  デフォルト: <ConfirmDialog open title={TITLE} description={DESCRIPTION} onClose={noop} onConfirm={noop} />,
  処理中: <ConfirmDialog open title={TITLE} submitting submittingLabel="実行中..." onClose={noop} onConfirm={noop} />,
};
```

react-cosmos の慣習に合わせてあるため、将来 react-cosmos を導入する場合、fixture ファイルは無改造で流用できます。捨てるのは `catalog.tsx` 内の登録リストだけです。

Storybook / Ladle の CSF（`export const 送信中 = { args: { ... } }`）は、props を JSX ではなくデータとして書きます。Controls パネルや props テーブル自動生成のために必要な形式ですが、その機能を使わないなら、素の JSX のほうが単純でテストにも流用しやすくなります。

### UI ライブラリに依存しない

サンプルの `ConfirmDialog` は素の DOM と inline style だけで書いてあります。この構成は特定の UI ライブラリに依存しません。

`ConfirmDialog` 自体もドメインを持たない汎用コンポーネントです。見出し・本文・ボタン文言はすべて props で渡し、既定値以外の文言はコンポーネントに埋め込みません。

実アプリでは、カタログと本体アプリの両方を同じ Provider（テーマ、ロケールなど）でラップしてください。カタログだけラップし忘れると、見た目が本体とずれます。このサンプルでは `src/providers.tsx` がその位置づけです。

### カタログは env gate で dev 限定にする

```ts
const useCatalog = process.env.BUN_PUBLIC_USE_CATALOG === "true";
const catalogRoutes = useCatalog ? { "/catalog.html": catalog } : {};
```

本番ビルドは `bun build ./src/index.html` でエントリを名指しするため、`catalog.html` から到達するコードはバンドルに含まれません。

### fixture の自動収集はしていない

Bun には `import.meta.glob` がないため、`catalog.tsx` の `FIXTURES` に手動で1行追加します。

登録を忘れてもテストは通ります（テストは fixture を直接 import するため）。カタログに出ないだけです。

## 実装時に引っかかった点

- **`bun test` には global の `afterEach` が無い。** `@testing-library/react` の自動 cleanup が走らないため、各テストファイルで `afterEach(cleanup)` を明示する
- **disabled なボタンは `pointer-events` が無効。** `userEvent.click` に `{ pointerEventsCheck: 0 }` を渡して素通りさせる
- **`@testing-library/jest-dom` は `GlobalRegistrator.register()` の後に読み込む。** `@testing-library/dom` がモジュール評価時に `document` を参照するため、静的 import だと `register()` より先に評価されて `a global document has to be available` で落ちる
- **`happydom.ts` は `bunfig.toml` の `[test] preload` に置かない。** そこに書くと Playwright を使う E2E（`bun test tests/e2e`）にも happy-dom が適用され、実ブラウザとグローバルが衝突する
- **`happydom.ts` は typecheck の対象外にしている。** `@testing-library/jest-dom` の types エントリが module ではなく `tsc` が解決できないため。実行時にしか使わないファイルなので `tsconfig.json` の `exclude` に入れている
- **`Bun.serve` の `routes` に条件付きスプレッドを渡すと型が合わない。** 「キーが optional になる union 型」を現行の Bun 型定義が許容しないため、`@ts-expect-error` で抑制している。ランタイムでは正しく動く

## ライセンス

MIT
