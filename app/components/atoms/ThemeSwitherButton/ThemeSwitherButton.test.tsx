import { render, screen, fireEvent, act, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from "vitest";
import { ThemeSwitcherButton } from "./ThemeSwitherButton";

// setTheme をモック
vi.mock("@/app/lib/actions/theme", () => ({
  setTheme: vi.fn(),
}));
import * as themeActions from "@/app/lib/actions/theme";
const mockedSetTheme = vi.mocked(themeActions.setTheme);

// --- matchMedia モック ---
let systemPrefersDark = false;
let listener: ((e: MediaQueryListEvent) => void) | null = null;

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      return {
        get matches() {
          return systemPrefersDark;
        },
        media: query,
        onchange: null,
        addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
          listener = cb;
        },
        removeEventListener: () => {
          listener = null;
        },
        dispatchEvent: () => {
          if (listener) {
            listener({ matches: systemPrefersDark, media: query } as MediaQueryListEvent);
          }
          return true;
        },
      };
    }),
  });
});

describe("ThemeSwitcherButton", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-locked");
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // 初期状態で 🌞 ボタンが表示される
  it("renders with light mode initially", () => {
    render(<ThemeSwitcherButton />);
    expect(screen.getByText("🌞")).toBeInTheDocument();
  });

  // クリックすると 🌙 に切り替わり setTheme が呼ばれる
  it("toggles to dark mode and calls setTheme", async () => {
    render(<ThemeSwitcherButton />);
    const btn = screen.getByText("🌞");

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(screen.getByText("🌙")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(mockedSetTheme).toHaveBeenCalledWith("dark");
  });

  // system 変更時に unlocked 状態なら反映される
  it("follows system changes when unlocked", async () => {
    document.documentElement.removeAttribute("data-theme-locked");
    systemPrefersDark = false;

    render(<ThemeSwitcherButton />);

    // 初期は 🌞
    expect(screen.getByText("🌞")).toBeInTheDocument();

    // システムをダークに切り替え
    systemPrefersDark = true;
    act(() => {
      window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new Event("change"));
    });

    // 🌙 に変わるのを確認
    await waitFor(() => {
      expect(screen.getByText("🌙")).toBeInTheDocument();
    });
  });

  // system 変更時に locked 状態なら無視する
  it("ignores system changes when locked", async () => {
    // ロック状態にする
    document.documentElement.setAttribute("data-theme-locked", "true");

    // 初期はライト
    systemPrefersDark = false;
    render(<ThemeSwitcherButton />);
    expect(screen.getByText("🌞")).toBeInTheDocument();

    // システムをダークに切り替え
    systemPrefersDark = true;
    act(() => {
      window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new Event("change"));
    });

    // ロックされているので 🌞 のまま
    await waitFor(() => {
      expect(screen.getByText("🌞")).toBeInTheDocument();
    });
  });
});
