import { serve } from "bun";
import catalog from "./catalog.html";
import index from "./index.html";

// コンポーネントカタログ (単体の見た目確認用) は本番ビルド・本番起動では配信しない。
// `BUN_PUBLIC_USE_CATALOG=true` のときだけルートに登録する。
const useCatalog = process.env.BUN_PUBLIC_USE_CATALOG === "true";

const catalogRoutes = useCatalog ? { "/catalog.html": catalog } : {};

const server = serve({
  port: Number(process.env.PORT ?? 4000),
  // @ts-expect-error: Bun.serve の `routes` 型は `catalogRoutes` を条件付きスプレッドした際の
  // 「キーが optional になる union 型」を許容しない (現行の Bun 型定義の既知の制約)。
  // ランタイムでは Bun が optional キーを正しく扱うため動作には影響しない。
  routes: {
    ...catalogRoutes,
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`🚀 Server running at ${server.url}`);
if (useCatalog) console.log(`📚 Catalog at ${server.url}catalog.html`);
