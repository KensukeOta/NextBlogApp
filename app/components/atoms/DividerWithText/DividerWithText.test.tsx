import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { DividerWithText } from "./DividerWithText";

afterEach(() => {
  cleanup();
});

describe("<DividerWithText />", () => {
  // 区切り線が2つ（role="separator"）あり、「または」というテキストが表示されることをテスト
  test("renders two separators and the text", () => {
    render(<DividerWithText />);

    // 2つのseparator(role)が存在すること
    const separators = screen.getAllByRole("separator");

    expect(separators).toHaveLength(2);
    // 「または」というテキストが存在すること
    expect(screen.getByText("または")).toBeInTheDocument();
  });

  // 区切り線(hr)がspanテキストを挟む構造になっていることをテスト
  test("renders separators before and after the text", () => {
    render(<DividerWithText />);

    const container = screen.getByText("または").parentElement!;
    const children = Array.from(container.children);

    expect(children[0].tagName).toBe("HR");
    expect(children[1].textContent).toBe("または");
    expect(children[2].tagName).toBe("HR");
  });
});
