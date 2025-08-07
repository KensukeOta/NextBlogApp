import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UserProfileLayout } from "./UserProfileLayout";

// UserProfileとUserTabListを簡易モック
vi.mock("../../organisms/UserProfile", () => ({
  UserProfile: ({ user }: { user: User }) => <div data-testid="UserProfile">{user.name}</div>,
}));

vi.mock("../../molecules/UserSNSProfile", () => ({
  UserSNSProfile: ({ name }: { name: string }) => <div data-testid="UserSNSProfile">{name}</div>,
}));

vi.mock("../../organisms/UserInfoProfile", () => ({
  UserInfoProfile: ({ name }: { name: string }) => <div data-testid="UserInfoProfile">{name}</div>,
}));

const mockUser: User = {
  id: "1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/avatar.png",
  provider: "github",
  bio: "hello",
  posts: [],
  liked_posts: [],
};

afterEach(() => {
  cleanup();
});

describe("UserProfileLayout", () => {
  // プロフィール情報(UserProfile)が表示されること
  test("renders UserProfile with correct user", () => {
    render(<UserProfileLayout user={mockUser}>test</UserProfileLayout>);

    expect(screen.getByTestId("UserProfile")).toHaveTextContent("kensuke");
  });

  // childrenがレイアウト内に描画されること
  test("renders children inside layout", () => {
    render(
      <UserProfileLayout user={mockUser}>
        <p>ChildrenContent</p>
      </UserProfileLayout>,
    );

    expect(screen.getByText("ChildrenContent")).toBeInTheDocument();
  });

  // classNameが適用されること
  test("applies additional className to root div", () => {
    render(
      <UserProfileLayout user={mockUser} className="custom-class">
        <div />
      </UserProfileLayout>,
    );

    const rootDiv = screen.getByTestId("UserProfileLayoutRoot");
    expect(rootDiv).toHaveClass("custom-class");
  });

  // 一覧に戻るリンクが表示され、hrefが"/"であること
  test('renders "一覧に戻る" link with correct href', () => {
    render(<UserProfileLayout user={mockUser}>test</UserProfileLayout>);
    // Link(Next.js)はa要素としてレンダリングされる
    const link = screen.getByRole("link", { name: "一覧に戻る" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
