// happydom.ts が読み込む @testing-library/jest-dom のマッチャーを
// bun:test の `expect` に型として認識させる。
import type { expect } from "bun:test";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "bun:test" {
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<ReturnType<typeof expect.stringContaining>, T> {}
}
