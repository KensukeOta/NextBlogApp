/**
 * Toastコンポーネントの動作テスト
 * - メッセージ表示、手動で閉じる、自動で閉じる、同じIDでは再表示されない
 */
import { render, screen, act, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";
import { beforeEach, describe, expect, it } from "vitest";

// AnimationEvent を JSDOM 用にモック
class MockAnimationEvent extends Event {
  constructor(type: string, eventInitDict?: EventInit) {
    super(type, eventInitDict);
  }
}
(globalThis as Record<string, unknown>).AnimationEvent = MockAnimationEvent;

describe("Toast component", () => {
  beforeEach(() => {
    cleanup();
  });

  // 初期表示時に initialFlash のメッセージが表示されることを確認
  it("renders the toast message when initialFlash is provided", () => {
    render(
      <Toast initialFlash={JSON.stringify({ id: 1, message: "Test message" })} duration={3000} />,
    );
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  // 閉じるボタンをクリックしたらトーストが非表示になることを確認
  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Toast initialFlash={JSON.stringify({ id: 1, message: "Close me" })} duration={3000} />);
    const closeButton = screen.getAllByRole("button", { name: /close/i })[0];
    await user.click(closeButton);
    act(() => {
      closeButton.parentElement?.dispatchEvent(new Event("animationend", { bubbles: true }));
    });
    expect(screen.queryByText("Close me")).not.toBeInTheDocument();
  });

  // 指定した時間経過後にトーストが自動的に閉じることを確認
  it("auto-closes after the given duration", async () => {
    render(<Toast duration={3000} initialFlash={JSON.stringify({ message: "Auto close" })} />);

    // 初期表示
    expect(screen.getByText("Auto close")).toBeInTheDocument();

    // DOMから消えるのを待つ（テストでは即閉じる）
    await waitFor(() => {
      expect(screen.queryByText("Auto close")).not.toBeInTheDocument();
    });
  });

  // 同じIDの initialFlash が再度渡されてもトーストが再描画されないことを確認
  it("does not re-render toast if same id is provided again", () => {
    const { rerender } = render(
      <Toast initialFlash={JSON.stringify({ id: 1, message: "First" })} duration={3000} />,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    rerender(<Toast initialFlash={JSON.stringify({ id: 1, message: "First" })} duration={3000} />);
    expect(screen.getByText("First")).toBeInTheDocument();
  });
});
