import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";
import fixtures from "./ConfirmDialog.fixture";

// bun test には global の afterEach が無く @testing-library/react の自動 cleanup が
// 走らないため、明示的に unmount する。
afterEach(cleanup);

const noop = () => {};
const TITLE = "この操作を実行しますか？";

describe("ConfirmDialog", () => {
  test("ボタン連打: 処理中は両ボタンが disabled になり onConfirm が呼ばれない", async () => {
    const onConfirm = mock(noop);
    render(
      <ConfirmDialog
        open
        title={TITLE}
        submitting
        submittingLabel="実行中..."
        onClose={noop}
        onConfirm={onConfirm}
      />,
    );

    const confirm = screen.getByRole("button", { name: "実行中..." });
    expect(confirm).toBeDisabled();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeDisabled();

    // disabled なボタンは pointer-events が無効なため click を素通りさせる。
    for (let i = 0; i < 3; i++) {
      await userEvent.click(confirm, { pointerEventsCheck: 0 });
    }
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test("キャンセル: onClose が呼ばれ onConfirm は呼ばれない", async () => {
    const onClose = mock(noop);
    const onConfirm = mock(noop);
    render(
      <ConfirmDialog open title={TITLE} onClose={onClose} onConfirm={onConfirm} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test("ESC でダイアログが閉じる", async () => {
    const onClose = mock(noop);
    render(<ConfirmDialog open title={TITLE} onClose={onClose} onConfirm={noop} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("処理中は ESC でダイアログが閉じない", async () => {
    const onClose = mock(noop);
    render(<ConfirmDialog open title={TITLE} submitting onClose={onClose} onConfirm={noop} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  test("エラー表示: errorMessage がダイアログ内に表示される", () => {
    render(
      <ConfirmDialog
        open
        title={TITLE}
        errorMessage="処理に失敗しました"
        onClose={noop}
        onConfirm={noop}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("処理に失敗しました");
  });

  test("文言は props で差し替えられる", () => {
    render(
      <ConfirmDialog
        open
        title={TITLE}
        description="実行後は元に戻せません。"
        confirmLabel="削除する"
        cancelLabel="やめる"
        onClose={noop}
        onConfirm={noop}
      />,
    );

    expect(screen.getByRole("heading", { name: TITLE })).toBeInTheDocument();
    expect(screen.getByText("実行後は元に戻せません。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "削除する" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "やめる" })).toBeInTheDocument();
  });

  test("description 未指定: aria-describedby を付けない", () => {
    render(<ConfirmDialog open title={TITLE} onClose={noop} onConfirm={noop} />);

    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
  });
});

describe("fixture", () => {
  // カタログに載せている fixture が全部描画できることのスモークテスト。
  test.each(Object.entries(fixtures))("%s が描画できる", (_name, element) => {
    render(element);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
