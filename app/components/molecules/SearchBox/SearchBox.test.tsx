import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// next/navigationをモック
vi.mock("next/navigation", () => {
  const replace = vi.fn();
  let searchParams = new URLSearchParams();

  return {
    useRouter: () => ({ replace }),
    usePathname: () => "/posts",
    useSearchParams: () => searchParams,
    __mock: {
      replace,
      setSearchParams: (params: URLSearchParams) => (searchParams = params),
    },
  };
});

type NavigationMock = {
  replace: ReturnType<typeof vi.fn>;
  setSearchParams: (params: URLSearchParams) => void;
};

import { SearchBox } from "./SearchBox";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("<SearchBox />", () => {
  // 検索ボタンが表示される
  test("renders search button", () => {
    render(<SearchBox />);
    expect(screen.getByRole("button", { name: "検索ボックスを開く" })).toBeInTheDocument();
  });

  // 検索ボタンがクリックされたときに検索入力欄を表示する
  test("shows search input when search button is clicked", async () => {
    render(<SearchBox />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "検索ボックスを開く" }));

    expect(screen.getByRole("search", { name: "検索" })).toBeVisible();
    expect(screen.getByPlaceholderText("タイトル・ユーザー名・タグ名で検索")).toHaveFocus();
  });

  // 入力時に正しいクエリでreplace関数が呼び出される
  test("calls replace with correct query on input", async () => {
    render(<SearchBox />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "検索ボックスを開く" }));

    const input = screen.getByPlaceholderText("タイトル・ユーザー名・タグ名で検索");
    await user.type(input, "React");

    const { __mock } = (await import("next/navigation")) as unknown as {
      __mock: NavigationMock;
    };

    // debounce待ち
    await waitFor(() => {
      expect(__mock.replace).toHaveBeenCalled();
    });

    expect(__mock.replace.mock.lastCall?.[0]).toContain("/posts?");
    expect(__mock.replace.mock.lastCall?.[0]).toContain("query=React");
  });

  // 入力がクリアされたときにクエリパラメータを削除する
  test("removes query param when input is cleared", async () => {
    const { __mock } = (await import("next/navigation")) as unknown as {
      __mock: NavigationMock;
    };
    __mock.setSearchParams(new URLSearchParams({ query: "React" }));

    render(<SearchBox />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "検索ボックスを開く" }));

    const input = screen.getByPlaceholderText("タイトル・ユーザー名・タグ名で検索");
    await user.clear(input);

    await waitFor(() => {
      expect(__mock.replace).toHaveBeenCalled();
    });

    expect(__mock.replace.mock.lastCall?.[0]).not.toContain("query=React");
  });

  // 検索入力の前後の空白をクエリ送信前に除去する
  test("trims whitespace from search input before querying", async () => {
    render(<SearchBox />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "検索ボックスを開く" }));

    const input = screen.getByPlaceholderText("タイトル・ユーザー名・タグ名で検索");
    await user.type(input, "  React  "); // 前後に空白

    const { __mock } = (await import("next/navigation")) as unknown as {
      __mock: NavigationMock;
    };

    await waitFor(() => {
      expect(__mock.replace).toHaveBeenCalled();
    });

    // クエリパラメータに余計なスペースが含まれない
    expect(__mock.replace.mock.lastCall?.[0]).toContain("query=React");
  });
});
