import { useEffect } from "react";

const TITLE_ID = "confirm-dialog-title";

export interface ConfirmDialogProps {
  open: boolean;
  /** 宛先メールアドレス。未指定なら宛先を伏せた文言にする。 */
  email?: string;
  /** 送信中かどうか。閉じる操作と確定操作を無効化して二重送信を防ぐ。 */
  submitting: boolean;
  /** 表示するサーバーエラー。未指定 / null なら出さない。 */
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

/** 招待メール再送の確認ダイアログ (表示のみ)。 */
export function ConfirmDialog({
  open,
  email,
  submitting,
  errorMessage,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  // 送信中の意図しない close (backdrop click / ESC) を抑止する。
  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={handleClose}>
      {/* 背景クリックだけを閉じる操作にするため、内側のクリックは伝播させない */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={TITLE_ID} style={styles.title}>
          招待メールを再送
        </h2>
        {errorMessage && (
          <p role="alert" style={styles.alert}>
            {errorMessage}
          </p>
        )}
        <p style={styles.body}>
          {email ? `「${email}」宛に招待メールを再送します。` : "招待メールを再送します。"}
        </p>
        <div style={styles.actions}>
          <button type="button" onClick={handleClose} disabled={submitting}>
            キャンセル
          </button>
          <button type="button" onClick={onConfirm} disabled={submitting}>
            {submitting ? "再送中..." : "再送する"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: { background: "#fff", borderRadius: 8, padding: 24, minWidth: 360, maxWidth: 560 },
  title: { margin: "0 0 16px", fontSize: 18 },
  alert: { margin: "0 0 12px", padding: "8px 12px", borderRadius: 4, background: "#fdecea" },
  body: { margin: "0 0 20px" },
  actions: { display: "flex", gap: 8, justifyContent: "flex-end" },
} satisfies Record<string, React.CSSProperties>;
