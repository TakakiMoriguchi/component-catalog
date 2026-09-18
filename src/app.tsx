import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AppProviders } from "@/providers";

// カタログの対になる「本体アプリ」。catalog.html とはエントリが分かれている。
// 中身は components/ の使用例を置くだけのプレースホルダー。
function App() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <div style={{ padding: 32 }}>
      <button type="button" onClick={() => setOpen(true)}>
        ダイアログを開く
      </button>
      <ConfirmDialog
        open={open}
        title="この操作を実行しますか？"
        description="実行後は元に戻せません。"
        submitting={submitting}
        submittingLabel="実行中..."
        confirmLabel="実行する"
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

const elem = document.getElementById("root")!;
createRoot(elem).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
