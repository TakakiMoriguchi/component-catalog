import { ConfirmDialog } from "./ConfirmDialog";

// react-cosmos の慣習に合わせ、素の React element を default export する。
// 将来 react-cosmos を導入する場合、このファイルは無改造で流用できる。
const noop = () => {};
const TITLE = "この操作を実行しますか？";
const DESCRIPTION = "実行後は元に戻せません。";

export default {
  デフォルト: (
    <ConfirmDialog
      open
      title={TITLE}
      description={DESCRIPTION}
      onClose={noop}
      onConfirm={noop}
    />
  ),
  処理中: (
    <ConfirmDialog
      open
      title={TITLE}
      description={DESCRIPTION}
      submitting
      submittingLabel="実行中..."
      onClose={noop}
      onConfirm={noop}
    />
  ),
  エラー表示: (
    <ConfirmDialog
      open
      title={TITLE}
      description={DESCRIPTION}
      errorMessage="処理に失敗しました"
      onClose={noop}
      onConfirm={noop}
    />
  ),
  本文なし: <ConfirmDialog open title={TITLE} onClose={noop} onConfirm={noop} />,
  文言差し替え: (
    <ConfirmDialog
      open
      title={TITLE}
      description={DESCRIPTION}
      confirmLabel="削除する"
      cancelLabel="やめる"
      onClose={noop}
      onConfirm={noop}
    />
  ),
};
