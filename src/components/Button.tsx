import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** 見た目の種類。 */
  variant?: ButtonVariant;
  /** 大きさ。 */
  size?: ButtonSize;
  /** 処理中かどうか。押下を無効化して二重実行を防ぐ。 */
  loading?: boolean;
  /** loading 中に差し替える文言。未指定なら children のまま。 */
  loadingLabel?: ReactNode;
  /** 親要素の幅いっぱいに広げる。 */
  fullWidth?: boolean;
  /** 既定は "button"。form 内で暗黙に submit させない。 */
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: ReactNode;
}

/** 汎用のボタン。文言と挙動はすべて props で渡す。 */
export function Button({
  variant = "primary",
  size = "medium",
  loading = false,
  loadingLabel,
  fullWidth = false,
  type = "button",
  disabled = false,
  style,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(fullWidth ? { width: "100%" } : null),
        ...(isDisabled ? disabledStyle : null),
        ...style,
      }}
      {...rest}
    >
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}

const baseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "1px solid transparent",
  borderRadius: 6,
  fontFamily: "inherit",
  lineHeight: 1.2,
  cursor: "pointer",
};

const sizeStyles = {
  small: { padding: "4px 10px", fontSize: 13 },
  medium: { padding: "8px 16px", fontSize: 14 },
  large: { padding: "12px 24px", fontSize: 16 },
} satisfies Record<ButtonSize, CSSProperties>;

const variantStyles = {
  primary: { background: "#1a1a1a", color: "#fff" },
  secondary: { background: "#fff", color: "#1a1a1a", borderColor: "#c9c9c9" },
  danger: { background: "#c0392b", color: "#fff" },
} satisfies Record<ButtonVariant, CSSProperties>;

const disabledStyle: CSSProperties = { opacity: 0.5, cursor: "not-allowed" };
