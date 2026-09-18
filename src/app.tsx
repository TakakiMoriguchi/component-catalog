import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AppProviders } from "@/providers";

// カタログの対になる「本体アプリ」。catalog.html とはエントリが分かれている。
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
        招待メールを再送
      </button>
      <ConfirmDialog
        open={open}
        email="pending@example.com"
        submitting={submitting}
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
