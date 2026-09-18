import { Button } from "./Button";

// react-cosmos の慣習に合わせ、素の React element を default export する。
// 将来 react-cosmos を導入する場合、このファイルは無改造で流用できる。
const noop = () => {};

export default {
  デフォルト: <Button onClick={noop}>保存する</Button>,
  セカンダリ: (
    <Button variant="secondary" onClick={noop}>
      キャンセル
    </Button>
  ),
  デンジャー: (
    <Button variant="danger" onClick={noop}>
      削除する
    </Button>
  ),
  処理中: (
    <Button loading loadingLabel="保存中..." onClick={noop}>
      保存する
    </Button>
  ),
  無効: (
    <Button disabled onClick={noop}>
      保存する
    </Button>
  ),
  小: (
    <Button size="small" onClick={noop}>
      保存する
    </Button>
  ),
  大: (
    <Button size="large" onClick={noop}>
      保存する
    </Button>
  ),
  幅いっぱい: (
    <Button fullWidth onClick={noop}>
      保存する
    </Button>
  ),
};
