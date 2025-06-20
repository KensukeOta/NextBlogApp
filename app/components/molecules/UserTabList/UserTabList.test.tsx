import { cleanup, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UserTabList } from "./UserTabList";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("UserTabList", () => {
  const name = "kensuke";

  // タブが2つ表示されること、テキストとリンク先が正しいこと
  test("renders two tabs with correct labels and links", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(`/${name}`);
    render(<UserTabList name={name} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    expect(tabs[0]).toHaveTextContent("投稿した記事");
    expect(tabs[1]).toHaveTextContent("いいねした記事");

    expect(tabs[0]).toHaveAttribute("href", `/${encodeURIComponent(name)}`);
    expect(tabs[1]).toHaveAttribute("href", `/${encodeURIComponent(name)}/likes`);
  });

  // パス名が /[name] の場合、「投稿した記事」タブが選択中であること
  test("sets aria-selected=true on '投稿した記事' tab if path is /[name]", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(`/${name}`);
    render(<UserTabList name={name} />);

    const [tab1, tab2] = screen.getAllByRole("tab");

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");
  });

  // パス名が /[name]/likes の場合、「いいねした記事」タブが選択中であること
  test("sets aria-selected=true on 'いいねした記事' tab if path is /[name]/likes", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(`/${name}/likes`);
    render(<UserTabList name={name} />);

    const [tab1, tab2] = screen.getAllByRole("tab");

    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("aria-selected", "true");
  });

  // tablistがrole=tablistであること、子要素に2つのtabが含まれること
  test("parent container has role='tablist' and contains both tabs", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(`/${name}`);
    render(<UserTabList name={name} />);

    const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");

    expect(tablist).toBeInTheDocument();
    expect(tablist).toContainElement(tabs[0]);
    expect(tablist).toContainElement(tabs[1]);
  });
});
