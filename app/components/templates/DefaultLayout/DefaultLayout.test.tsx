// DefaultLayout.test.tsx

import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DefaultLayout } from "./DefaultLayout";

describe("<DefaultLayout />", () => {
  // 子要素が正しく描画され、classNameが適用されていることをテスト
  test("renders children and applies className", () => {
    render(
      <DefaultLayout className="custom-class">
        <span>Child Content</span>
      </DefaultLayout>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
    const container = screen.getByText("Child Content").parentElement;
    expect(container).toHaveClass("h-full");
    expect(container).toHaveClass("bg-white");
    expect(container).toHaveClass("custom-class");
  });

  // classNameが未指定でもデフォルトクラスが付与されていることをテスト
  test("works without className", () => {
    render(
      <DefaultLayout>
        <span>no className</span>
      </DefaultLayout>,
    );
    const container = screen.getByText("no className").parentElement;
    expect(container).toHaveClass("h-full");
    expect(container).toHaveClass("bg-white");
  });
});
