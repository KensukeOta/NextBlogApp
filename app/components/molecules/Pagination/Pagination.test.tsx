import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

// --- next/navigation のモックを整理 ---
const mockSearchParams = (params: Record<string, string> = {}) => {
  // 本物のURLSearchParamsで返す
  const usp = new URLSearchParams(params);
  return {
    get: (key: string) => usp.get(key),
    toString: () => usp.toString(),
    // 必要なら他のメソッドも追加
  } as unknown;
};

beforeEach(() => {
  vi.resetModules();
  // 必ず新しい値でモックする
  vi.mock("next/navigation", () => ({
    usePathname: () => "/posts",
    useSearchParams: () => mockSearchParams({ page: "2" }),
  }));
  vi.mock("@/app/lib/utils", () => ({
    generatePagination: () => [1, 2, 3],
  }));
});
afterEach(() => {
  vi.resetAllMocks();
});

describe("Paginationコンポーネント", () => {
  // ページ番号が正しく表示されること
  it("ページ番号を全て表示する", () => {
    render(<Pagination totalPages={3} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // 現在のページがアクティブ（スタイル上div）として表示されること
  it("現在のページ番号がアクティブ表示される", () => {
    render(<Pagination totalPages={3} />);
    // "2" のテキストを持つ全ての要素を取得
    const actives = screen.getAllByText("2");
    // bg-blue-600を持つdivだけに絞る
    const activeDiv = actives.find(
      (el) => el.tagName.toLowerCase() === "div" && el.className.includes("bg-blue-600"),
    );
    expect(activeDiv).toBeTruthy();
  });

  // 前のページボタンが有効であること
  it("前のページ矢印が有効な場合リンクとして表示される", () => {
    render(<Pagination totalPages={3} />);
    const leftArrow = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href")?.includes("page=1"));
    expect(leftArrow).toBeTruthy();
  });

  // 次のページボタンが有効であること
  it("次のページ矢印が有効な場合リンクとして表示される", () => {
    render(<Pagination totalPages={3} />);
    const rightArrow = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href")?.includes("page=3"));
    expect(rightArrow).toBeTruthy();
  });

  // 1ページ目の場合は左矢印が無効になる（disabledスタイルでdivになる）
  it("1ページ目では左矢印が無効化される", async () => {
    // 1ページ目をテストするためにモックをやり直し
    vi.resetModules();
    vi.doMock("next/navigation", () => ({
      usePathname: () => "/posts",
      useSearchParams: () => mockSearchParams({ page: "1" }),
    }));
    vi.doMock("@/app/lib/utils", () => ({
      generatePagination: () => [1, 2, 3],
    }));
    // importしなおし
    const { default: Pagination1 } = await import("./Pagination");
    render(<Pagination1 totalPages={3} />);
    // pointer-events-none（無効化クラス）を持つdivがある
    const left = Array.from(document.querySelectorAll("div")).find((el) =>
      el.className.includes("pointer-events-none"),
    );
    expect(left).toBeTruthy();
  });
});
