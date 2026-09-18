// bun test 用の DOM 環境セットアップ。`test` script から `--preload ./happydom.ts` で読み込む。
//
// bunfig.toml の `[test] preload` には置かない。そこに書くと Playwright を使う E2E
// (`bun test tests/e2e`) にも happy-dom が適用され、実ブラウザとグローバルが衝突するため。
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// jest-dom のマッチャーは register 後に読み込む。@testing-library/dom はモジュール評価時に
// document を参照するため、静的 import だと register() より先に評価されて落ちる。
await import("@testing-library/jest-dom");
