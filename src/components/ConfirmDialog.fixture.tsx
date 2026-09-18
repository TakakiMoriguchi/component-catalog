import { ConfirmDialog } from "./ConfirmDialog";

// react-cosmos の慣習に合わせ、素の React element を default export する。
// 将来 react-cosmos を導入する場合、このファイルは無改造で流用できる。
const noop = () => {};
const EMAIL = "pending@example.com";

export default {
  デフォルト: (
    <ConfirmDialog open email={EMAIL} submitting={false} onClose={noop} onConfirm={noop} />
  ),
  送信中: <ConfirmDialog open email={EMAIL} submitting onClose={noop} onConfirm={noop} />,
  エラー表示: (
    <ConfirmDialog
      open
      email={EMAIL}
      submitting={false}
      errorMessage="招待メールの再送に失敗しました"
      onClose={noop}
      onConfirm={noop}
    />
  ),
  宛先未指定: <ConfirmDialog open submitting={false} onClose={noop} onConfirm={noop} />,
};
