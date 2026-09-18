import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import confirmDialog from "@/components/ConfirmDialog.fixture";
import { AppProviders } from "@/providers";

// fixture の登録リスト。`*.fixture.tsx` を足したらここに 1 行追加する
// (Bun に import.meta.glob が無く自動収集できないため手動)。
const FIXTURES: Record<string, Record<string, ReactElement>> = {
  ConfirmDialog: confirmDialog,
};

function fixtureUrl(component: string, fixture: string): string {
  return `/catalog.html?c=${encodeURIComponent(component)}&f=${encodeURIComponent(fixture)}`;
}

// クエリ未指定 (または該当なし) のときに出す一覧。
function CatalogIndex() {
  return (
    <ul style={{ fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
      {Object.entries(FIXTURES).flatMap(([component, fixtures]) =>
        Object.keys(fixtures).map((fixture) => (
          <li key={fixtureUrl(component, fixture)}>
            <a href={fixtureUrl(component, fixture)}>
              {component} / {fixture}
            </a>
          </li>
        )),
      )}
    </ul>
  );
}

const params = new URLSearchParams(window.location.search);
const component = params.get("c");
const fixture = params.get("f");
const selected = component && fixture ? FIXTURES[component]?.[fixture] : undefined;

// 実アプリと見た目を揃えるため、本体と同じ Provider でラップする。
const elem = document.getElementById("root")!;
createRoot(elem).render(<AppProviders>{selected ?? <CatalogIndex />}</AppProviders>);
