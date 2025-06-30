import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { TabList } from "./TabList";

// サンプルタブ配列
const tabs = [
  { label: "基本情報", value: "basic" },
  { label: "詳細", value: "detail" },
] as const;

afterEach(() => {
  cleanup();
});

describe("TabList", () => {
  // タブリスト・各タブが表示される
  test("renders all tabs with correct roles and labels", () => {
    render(<TabList tabs={tabs} activeTab="basic" onChange={() => {}} />);
    // tablistロール
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // 各タブ
    tabs.forEach((tab) => {
      const tabBtn = screen.getByRole("tab", { name: tab.label });
      expect(tabBtn).toBeInTheDocument();
      expect(tabBtn).toHaveAttribute("id", `edit-tab-${tab.value}`);
      expect(tabBtn).toHaveAttribute("aria-controls", `edit-panel-${tab.value}`);
    });
  });

  // activeTabのaria-selectedとクラス
  test("sets aria-selected and class on active tab", () => {
    render(<TabList tabs={tabs} activeTab="detail" onChange={() => {}} />);
    const active = screen.getByRole("tab", { name: "詳細" });
    const inactive = screen.getByRole("tab", { name: "基本情報" });

    expect(active).toHaveAttribute("aria-selected", "true");
    expect(active).toHaveClass("bg-white");
    expect(active).toHaveClass("font-bold");
    expect(inactive).toHaveAttribute("aria-selected", "false");
    expect(inactive).toHaveClass("bg-blue-50");
  });

  // クリックでonChangeが呼ばれる
  test("calls onChange when a tab is clicked", async () => {
    const handleChange = vi.fn();
    render(<TabList tabs={tabs} activeTab="basic" onChange={handleChange} />);
    const detailTab = screen.getByRole("tab", { name: "詳細" });
    await userEvent.click(detailTab);
    expect(handleChange).toHaveBeenCalledWith("detail");
  });

  // classNameが渡せる
  test("applies additional className", () => {
    render(<TabList tabs={tabs} activeTab="basic" onChange={() => {}} className="custom-class" />);
    expect(screen.getByRole("tablist")).toHaveClass("custom-class");
  });
});
