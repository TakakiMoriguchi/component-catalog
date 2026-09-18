import type { ReactNode } from "react";

// 本体アプリとカタログで共有するラッパー。実アプリではテーマやロケールの Provider が
// ここに入る。カタログも同じもので包むことで、見た目が本体とずれないようにする。
export function AppProviders({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 15 }}>{children}</div>;
}
