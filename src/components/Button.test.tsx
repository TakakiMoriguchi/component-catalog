import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import fixtures from "./Button.fixture";

// bun test には global の afterEach が無く @testing-library/react の自動 cleanup が
// 走らないため、明示的に unmount する。
afterEach(cleanup);

const noop = () => {};

describe("Button", () => {
  test("クリックで onClick が呼ばれる", async () => {
    const onClick = mock(noop);
    render(<Button onClick={onClick}>保存する</Button>);

    await userEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("disabled のときは onClick が呼ばれない", async () => {
    const onClick = mock(noop);
    render(
      <Button disabled onClick={onClick}>
        保存する
      </Button>,
    );

    const button = screen.getByRole("button", { name: "保存する" });
    expect(button).toBeDisabled();
    // disabled なボタンは pointer-events が無効なため click を素通りさせる。
    await userEvent.click(button, { pointerEventsCheck: 0 });
    expect(onClick).not.toHaveBeenCalled();
  });

  test("ボタン連打: loading 中は disabled になり onClick が呼ばれない", async () => {
    const onClick = mock(noop);
    render(
      <Button loading loadingLabel="保存中..." onClick={onClick}>
        保存する
      </Button>,
    );

    const button = screen.getByRole("button", { name: "保存中..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    for (let i = 0; i < 3; i++) {
      await userEvent.click(button, { pointerEventsCheck: 0 });
    }
    expect(onClick).not.toHaveBeenCalled();
  });

  test("loadingLabel 未指定なら loading 中も children のまま", () => {
    render(
      <Button loading onClick={noop}>
        保存する
      </Button>,
    );

    expect(screen.getByRole("button", { name: "保存する" })).toBeDisabled();
  });

  test("type の既定は button で form を submit しない", async () => {
    const onSubmit = mock((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button onClick={noop}>保存する</Button>
      </form>,
    );

    expect(screen.getByRole("button", { name: "保存する" })).toHaveAttribute("type", "button");
    await userEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("未知の props は button 要素にそのまま渡る", () => {
    render(
      <Button aria-label="保存" data-testid="save" onClick={noop}>
        保存する
      </Button>,
    );

    const button = screen.getByTestId("save");
    expect(button).toHaveAttribute("aria-label", "保存");
  });
});

describe("fixture", () => {
  // カタログに載せている fixture が全部描画できることのスモークテスト。
  test.each(Object.entries(fixtures))("%s が描画できる", (_name, element) => {
    render(element);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
