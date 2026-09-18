import { useEffect, useId } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface ConfirmDialogProps {
  open: boolean;
  /** 見出し。ダイアログのアクセシブル名になる。 */
  title: string;
  /** 本文。未指定なら本文行を出さない。 */
  description?: ReactNode;
  /** 処理中かどうか。閉じる操作と確定操作を無効化して二重実行を防ぐ。 */
  submitting?: boolean;
  /** 表示するエラー。未指定 / null なら出さない。 */
  errorMessage?: string | null;
  /** 確定ボタンの文言。 */
  confirmLabel?: string;
  /** 取消ボタンの文言。 */
  cancelLabel?: string;
  /** submitting 中の確定ボタン文言。未指定なら confirmLabel のまま。 */
  submittingLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

/** 汎用の確認ダイアログ (表示のみ)。文言はすべて props で差し替える。 */
export function ConfirmDialog({
  open,
  title,
  description,
  submitting = false,
  errorMessage,
  confirmLabel = "OK",
  cancelLabel = "キャンセル",
  submittingLabel,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  // 同一ページに複数個置いても id が衝突しないようにする。
  const titleId = useId();
  const descriptionId = useId();

  // 処理中の意図しない close (backdrop click / ESC) を抑止する。
  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, submitting, onClose]);

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={handleClose}>
      {/* 背景クリックだけを閉じる操作にするため、内側のクリックは伝播させない */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} style={styles.title}>
          {title}
        </h2>
        {errorMessage && (
          <p role="alert" style={styles.alert}>
            {errorMessage}
          </p>
        )}
        {description && (
          <p id={descriptionId} style={styles.body}>
            {description}
          </p>
        )}
        <div style={styles.actions}>
          <button type="button" onClick={handleClose} disabled={submitting}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={submitting}>
            {submitting ? (submittingLabel ?? confirmLabel) : confirmLabel}
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
} satisfies Record<string, CSSProperties>;
