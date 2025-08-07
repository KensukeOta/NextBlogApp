import type { Mock } from "vitest";
import { expect, vi, afterEach, test } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FollowButton } from "./FollowButton";

// --- cleanupで毎回リセット
afterEach(cleanup);

// --- followsをモック
vi.mock("@/app/lib/actions/follows", async () => {
  return {
    createFollow: vi.fn().mockResolvedValue({ message: null }),
    deleteFollow: vi.fn().mockResolvedValue({ message: null }),
    FollowState: {},
  };
});
import { createFollow, deleteFollow } from "@/app/lib/actions/follows";

// --- サンプルユーザー
const user = {
  id: "1",
  name: "testuser",
  email: "test@example.com",
  image: "",
  provider: "credentials",
  bio: "",
  posts: [],
  liked_posts: [],
  user_social_profiles: [],
  tags: [],
  following: [],
  followers: [],
};

// フォローしていない場合
// フォローしていない場合は「フォロー」ボタンが表示され、クリックでcreateFollowが呼ばれる
test('shows "フォロー" button and calls createFollow when clicked (when not following)', async () => {
  render(<FollowButton user={user} isFollowing={false} />);
  expect(screen.getByRole("button", { name: "フォロー" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "フォロー" }));
  expect(createFollow).toHaveBeenCalledWith(user.id, { message: null }, expect.any(FormData));
});

// フォロー済みの場合
// フォロー中の場合は「フォロー中」ボタンが表示され、クリックでdeleteFollowが呼ばれる
test('shows "フォロー中" button and calls deleteFollow when clicked (when following)', async () => {
  render(<FollowButton user={user} isFollowing={true} followId="follow-123" />);
  expect(screen.getByRole("button", { name: "フォロー中" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "フォロー中" }));
  expect(deleteFollow).toHaveBeenCalledWith("follow-123", { message: null }, expect.any(FormData));
});

// isPending時はボタンがdisabledになる
// ボタン押下時はisPendingになり、ボタンがdisabledになることを確認
test("disables the button when pending", async () => {
  // 型安全なコールバック型
  let resolvePromise: ((value: { message: string | null }) => void) | undefined;

  // 型キャストしてmockImplementation
  (createFollow as Mock).mockImplementation(
    () =>
      new Promise<{ message: string | null }>((resolve) => {
        resolvePromise = resolve;
      }),
  );

  render(<FollowButton user={user} isFollowing={false} />);
  const button = screen.getByRole("button", { name: "フォロー" });

  userEvent.click(button);

  await waitFor(() => {
    expect(button).toBeDisabled();
  });

  resolvePromise!({ message: null });
});

// state.messageがある場合はエラーメッセージが表示される
// エラーメッセージが表示される場合のテスト
test("displays error message when state.message is set", async () => {
  (
    createFollow as typeof createFollow & { mockResolvedValue: (val: { message: string }) => void }
  ).mockResolvedValue({ message: "エラーが発生しました" });

  render(<FollowButton user={user} isFollowing={false} />);
  const button = screen.getByRole("button", { name: "フォロー" });

  await userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });
});

// nameのhidden inputが存在し、ユーザー名が設定されている
// 隠しinputが正しい値を持つか確認
test("renders hidden input with user's name", () => {
  render(<FollowButton user={user} isFollowing={false} />);
  // hidden inputはgetByRole/getByLabelTextが効かないためquerySelectorで直接取得
  const input = document.querySelector('input[type="hidden"][name="name"]');
  expect(input).not.toBeNull();
  expect((input as HTMLInputElement).value).toBe(user.name);
});
