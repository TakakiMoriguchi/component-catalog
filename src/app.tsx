import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/Button";
import { AppProviders } from "@/providers";

// カタログの対になる「本体アプリ」。catalog.html とはエントリが分かれている。
// 中身は components/ の使用例を置くだけのプレースホルダー。
function App() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCount((n) => n + 1);
    }, 1500);
  };

  return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Button loading={loading} loadingLabel="保存中..." onClick={handleClick}>
          保存する
        </Button>
        <Button variant="secondary" onClick={() => setCount(0)}>
          リセット
        </Button>
      </div>
      <p>保存した回数: {count}</p>
    </div>
  );
}

const elem = document.getElementById("root")!;
createRoot(elem).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
