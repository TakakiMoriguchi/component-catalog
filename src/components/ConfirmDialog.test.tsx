import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";
import fixtures from "./ConfirmDialog.fixture";

// bun test には global の afterEach が無く @testing-library/react の自動 cleanup が
// 走らないため、明示的に unmount する。
afterEach(cleanup);

const noop = () => {};
const EMAIL = "pending@example.com";

describe("ConfirmDialog", () => {
  test("ボタン連打: 送信中は両ボタンが disabled になり onConfirm が呼ばれない", async () => {
    const onConfirm = mock(noop);
    render(
      <ConfirmDialog open email={EMAIL} submitting onClose={noop} onConfirm={onConfirm} />,
    );

    const confirm = screen.getByRole("button", { name: "再送中..." });
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
      <ConfirmDialog
        open
        email={EMAIL}
        submitting={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test("ESC でダイアログが閉じる", async () => {
    const onClose = mock(noop);
    render(
      <ConfirmDialog open email={EMAIL} submitting={false} onClose={onClose} onConfirm={noop} />,
    );

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("送信中は ESC でダイアログが閉じない", async () => {
    const onClose = mock(noop);
    render(<ConfirmDialog open email={EMAIL} submitting onClose={onClose} onConfirm={noop} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  test("エラー表示: errorMessage がダイアログ内に表示される", () => {
    render(
      <ConfirmDialog
        open
        email={EMAIL}
        submitting={false}
        errorMessage="再送に失敗しました"
        onClose={noop}
        onConfirm={noop}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("再送に失敗しました");
  });

  test("宛先未指定: フォールバックの文言になる", () => {
    render(<ConfirmDialog open submitting={false} onClose={noop} onConfirm={noop} />);

    expect(screen.getByText("招待メールを再送します。")).toBeInTheDocument();
  });
});

describe("fixture", () => {
  // カタログに載せている fixture が全部描画できることのスモークテスト。
  test.each(Object.entries(fixtures))("%s が描画できる", (_name, element) => {
    render(element);
    expect(screen.getByRole("heading", { name: "招待メールを再送" })).toBeInTheDocument();
  });
});
