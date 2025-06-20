import type { User } from "@/app/types/User";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { UserProfileLayout } from "./UserProfileLayout";

// UserProfileとUserTabListを簡易モック
vi.mock("../../organisms/UserProfile", () => ({
  UserProfile: ({ user }: { user: User }) => <div data-testid="UserProfile">{user.name}</div>,
}));

vi.mock("../../molecules/UserTabList", () => ({
  UserTabList: ({ name }: { name: string }) => <nav data-testid="UserTabList">{name}</nav>,
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

describe("UserProfileLayout", () => {
  // プロフィール情報(UserProfile)が表示されること
  test("renders UserProfile with correct user", () => {
    render(<UserProfileLayout user={mockUser}>test</UserProfileLayout>);

    expect(screen.getByTestId("UserProfile")).toHaveTextContent("kensuke");
  });

  // タブリスト(UserTabList)が表示されること
  test("renders UserTabList with correct user name", () => {
    render(<UserProfileLayout user={mockUser}>test</UserProfileLayout>);

    expect(screen.getByTestId("UserTabList")).toHaveTextContent("kensuke");
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
});
