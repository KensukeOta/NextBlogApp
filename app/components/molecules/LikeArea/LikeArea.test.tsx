import type { Post } from "@/app/types/Post";
import type { User } from "@/app/types/User";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";
import { LikeArea } from "./LikeArea";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { createLike, deleteLike } from "@/app/lib/actions";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});
vi.mock("@/app/lib/actions", () => ({
  createLike: vi.fn(),
  deleteLike: vi.fn(),
}));

const mockUser: User = {
  id: "user-1",
  name: "kensuke",
  email: "kensuke@example.com",
  image: "/dummy.png",
  provider: "github",
  posts: [],
  liked_posts: [],
};
const basePost: Post = {
  id: "post-1",
  title: "Post Title",
  content: "Post Content",
  user_id: "user-1",
  user: mockUser,
  likes: [],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("LikeArea", () => {
  test("shows unliked heart and alerts on click when not logged in", () => {
    (useSession as unknown as Mock).mockReturnValue({ data: null });
    (useActionState as unknown as Mock).mockImplementation((fn: unknown) => [undefined, fn, false]);
    window.alert = vi.fn();

    render(<LikeArea post={basePost} />);
    const button = screen.getAllByRole("button").at(-1)!;
    const icon = button.querySelector("i");

    expect(icon?.className).toContain("bi-heart");
    expect(icon?.className).not.toContain("bi-heart-fill");
    expect(screen.getAllByText("0").at(-1)).toBeInTheDocument();

    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith("ログインすると「いいね」をすることができます！");
  });

  test("calls createLike when logged in and not liked", () => {
    (useSession as unknown as Mock).mockReturnValue({ data: { user: mockUser } });
    (useActionState as unknown as Mock).mockImplementation((fn: unknown) => [undefined, fn, false]);
    render(<LikeArea post={basePost} />);
    const button = screen.getAllByRole("button").at(-1)!;

    fireEvent.click(button);

    expect(createLike).toHaveBeenCalledWith(basePost.id);
    expect(deleteLike).not.toHaveBeenCalled();
  });

  test("calls deleteLike when logged in and already liked", () => {
    (useSession as unknown as Mock).mockReturnValue({ data: { user: mockUser } });
    (useActionState as unknown as Mock).mockImplementation((fn: unknown) => [undefined, fn, false]);
    const likedPost = {
      ...basePost,
      likes: [
        { id: "like-1", user_id: mockUser.id, post_id: basePost.id },
        { id: "like-2", user_id: "another", post_id: basePost.id },
      ],
    };
    render(<LikeArea post={likedPost} />);
    const button = screen.getAllByRole("button").at(-1)!;

    fireEvent.click(button);

    expect(deleteLike).toHaveBeenCalledWith("like-1");
    expect(createLike).not.toHaveBeenCalled();
  });

  test("shows correct like count", () => {
    (useSession as unknown as Mock).mockReturnValue({ data: { user: mockUser } });
    (useActionState as unknown as Mock).mockImplementation((fn: unknown) => [undefined, fn, false]);
    const likedPost = {
      ...basePost,
      likes: [
        { id: "like-1", user_id: mockUser.id, post_id: basePost.id },
        { id: "like-2", user_id: "another", post_id: basePost.id },
      ],
    };
    render(<LikeArea post={likedPost} />);
    expect(screen.getAllByText("2").at(-1)).toBeInTheDocument();
  });

  test("disables button when isPending is true", () => {
    (useSession as unknown as Mock).mockReturnValue({ data: { user: mockUser } });
    (useActionState as unknown as Mock).mockImplementation((fn: unknown) => [undefined, fn, true]);
    render(<LikeArea post={basePost} />);
    const button = screen.getAllByRole("button").at(-1)!;
    expect(button).toBeDisabled();
  });
});
