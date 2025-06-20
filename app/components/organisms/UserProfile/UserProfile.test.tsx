/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UserProfile } from "./UserProfile";
import type { User } from "@/app/types/User";

// next/imageのモック
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // alt属性とsrc属性、childrenをdivとして再現
    // 本番と同じような挙動になるようシンプルなimg要素に
    return <img {...props} />;
  },
}));

const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  posts: [],
};

afterEach(() => {
  cleanup();
});

describe("UserProfile", () => {
  // ユーザー画像が表示されること
  test("renders user image with correct src and alt", () => {
    render(<UserProfile user={mockUser} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockUser.image);
    expect(img).toHaveAttribute("alt", "ユーザー画像");
  });

  // ユーザー名が表示されること
  test("renders user name in heading", () => {
    render(<UserProfile user={mockUser} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(mockUser.name);
  });

  // 画像が未指定の場合はデフォルト画像が表示されること
  test("renders default image when user.image is undefined", () => {
    const userNoImage = { ...mockUser, image: undefined as unknown as string };
    render(<UserProfile user={userNoImage} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/noavatar.png");
  });
});
