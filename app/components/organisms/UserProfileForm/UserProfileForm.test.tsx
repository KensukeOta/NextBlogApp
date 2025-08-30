// UserProfileForm.test.tsx
import type { User } from "@/app/types/User";
import type { Mock } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import * as React from "react";
import { UserProfileForm } from "./UserProfileForm";

// UserDeleteButton をモック化
vi.mock("../../atoms/UserDeleteButton", () => ({
  UserDeleteButton: (props: { user: User }) => (
    <div data-testid="UserDeleteButton">{props.user.name}</div>
  ),
}));

// next/image を素直な <img> としてモック（unoptimized の検証用に data-unoptimized を追加）
vi.mock("next/image", () => ({
  __esModule: true,
  // ↓ any をやめ、正しい型を付ける
  // React.ComponentProps<'img'> なら alt などの必須プロップも型で担保できます
  default: (props: React.ComponentProps<"img"> & { unoptimized?: boolean }) => (
    // ↓ テスト用モックに限って <img> を許可（1行だけ）
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} data-unoptimized={props.unoptimized ? "true" : "false"} />
  ),
}));

// useActionState のグローバルモック
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

// updateUser のダミーモック
vi.mock("@/app/lib/actions/users", () => ({
  updateUser: vi.fn(),
}));

const mockFormAction = vi.fn();
const initialState = { message: null, errors: {}, values: {} };
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

// URL.createObjectURL / revokeObjectURL をモック
const createObjectURLSpy = vi.fn(() => "blob:mock-url");
const revokeObjectURLSpy = vi.fn();

beforeAll(() => {
  global.URL.createObjectURL = createObjectURLSpy;
  global.URL.revokeObjectURL = revokeObjectURLSpy;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  createObjectURLSpy.mockClear();
  revokeObjectURLSpy.mockClear();
});

beforeEach(() => {
  (React.useActionState as unknown as Mock).mockReturnValue([initialState, mockFormAction, false]);
});

describe("UserProfileForm", () => {
  // 入力欄・ラベル・初期値が正しく表示される
  test("renders all fields with correct initial values and labels", () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("kensuke");
    expect(screen.getByPlaceholderText("表示名を入力")).toBeInTheDocument();
    expect(screen.getByLabelText("自己紹介")).toHaveValue("hello");
    expect(
      screen.getByPlaceholderText("あなたのスキルや目標、好きな言語などを書いてみましょう。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeInTheDocument();

    // aria 属性
    expect(screen.getByLabelText("表示名")).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getByLabelText("自己紹介")).toHaveAttribute("aria-describedby", "bio-error");

    // 画像ラベルと初期画像
    expect(screen.getByText("プロフィール画像")).toBeInTheDocument();
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/avatar.png");
    expect(img.getAttribute("data-unoptimized")).toBe("false");
  });

  // バリデーションエラーが表示される
  test("displays validation errors from state", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([
      {
        message: "バリデーションエラー",
        errors: {
          name: ["表示名を入力してください"],
          bio: ["自己紹介は200文字以内で入力してください"],
        },
        values: {},
      },
      mockFormAction,
      false,
    ]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
    expect(screen.getByText("表示名を入力してください")).toBeInTheDocument();
    expect(screen.getByText("自己紹介は200文字以内で入力してください")).toBeInTheDocument();
  });

  // state.values が存在する場合、その値で初期表示される
  test("prefills fields with values from state if present", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([
      {
        message: null,
        errors: {},
        values: { name: "newname", bio: "newbio" },
      },
      mockFormAction,
      false,
    ]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByLabelText("表示名")).toHaveValue("newname");
    expect(screen.getByLabelText("自己紹介")).toHaveValue("newbio");
  });

  // 入力欄に値を入力できる
  test("allows typing into name and bio fields", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    const nameInput = screen.getByLabelText("表示名") as HTMLInputElement;
    const bioTextarea = screen.getByLabelText("自己紹介") as HTMLTextAreaElement;

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "newname");
    expect(nameInput).toHaveValue("newname");

    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, "new bio text");
    expect(bioTextarea).toHaveValue("new bio text");
  });

  // キャンセルボタンで onCloseModal が呼ばれる
  test("calls onCloseModal when cancel button is clicked", async () => {
    const handleClose = vi.fn();
    render(<UserProfileForm user={mockUser} onCloseModal={handleClose} />);
    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(handleClose).toHaveBeenCalled();
  });

  // isPending=true のとき保存ボタンが disabled
  test("disables submit button when isPending is true", () => {
    (React.useActionState as unknown as Mock).mockReturnValue([initialState, mockFormAction, true]);
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeDisabled();
  });

  // UserDeleteButton がレンダリングされる
  test("renders UserDeleteButton", () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    expect(screen.getByTestId("UserDeleteButton")).toHaveTextContent("kensuke");
  });

  // 画像アップロード：有効なサイズでプレビューされ、取り消すボタンが表示される
  test("previews image when a valid file is selected and shows cancel button", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);

    const fileInput = screen.getByLabelText("画像をアップロード") as HTMLInputElement;
    const validFile = new File([new Uint8Array(1024 * 10)], "avatar.jpg", { type: "image/jpeg" }); // 10KB

    await userEvent.upload(fileInput, validFile);

    // createObjectURL が呼ばれている
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    // 画像が blob: に差し替わる & unoptimized が true
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("blob:mock-url");
    expect(img.getAttribute("data-unoptimized")).toBe("true");

    // 取り消すボタンが出現
    expect(screen.getByRole("button", { name: "取り消す" })).toBeInTheDocument();
  });

  // 画像アップロード：2MB超はプレビューされず、取り消すボタンも出ない
  test("does not preview when file is over 2MB and hides cancel button", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);

    const fileInput = screen.getByLabelText("画像をアップロード") as HTMLInputElement;
    const tooLargeSize = 2 * 1024 * 1024 + 1;
    const largeFile = new File([new Uint8Array(tooLargeSize)], "big.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, largeFile);

    // プレビューされない（元画像のまま）
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("/avatar.png");
    expect(img.getAttribute("data-unoptimized")).toBe("false");

    // 取り消すボタンは表示されない
    expect(screen.queryByRole("button", { name: "取り消す" })).not.toBeInTheDocument();
  });

  // 取り消すボタンでプレビュー解除＆revokeObjectURL が呼ばれる
  test("clicking cancel clears preview and revokes object URL", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);

    const fileInput = screen.getByLabelText("画像をアップロード") as HTMLInputElement;
    const validFile = new File([new Uint8Array(2048)], "avatar.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, validFile);
    expect(screen.getByAltText("ユーザー画像")).toHaveAttribute(
      "src",
      expect.stringContaining("blob:mock-url"),
    );

    await userEvent.click(screen.getByRole("button", { name: "取り消す" }));

    // 元画像に戻る & unoptimized=false
    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("/avatar.png");
    expect(img.getAttribute("data-unoptimized")).toBe("false");

    // revoke が呼ばれる（プレビュー解除時）
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
  });

  // ファイル選択ダイアログで取り消した場合（files=[]）はプレビューをクリア
  test("clears preview when file dialog is canceled (no files)", async () => {
    render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    const fileInput = screen.getByLabelText("画像をアップロード") as HTMLInputElement;

    // まずはプレビューを作る
    const validFile = new File([new Uint8Array(1024)], "a.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, validFile);
    expect(screen.getByAltText("ユーザー画像")).toHaveAttribute(
      "src",
      expect.stringContaining("blob:mock-url"),
    );

    // その後キャンセル発生（選択なし）
    fireEvent.change(fileInput, { target: { files: [] } });

    const img = screen.getByAltText("ユーザー画像") as HTMLImageElement;
    expect(img.src).toContain("/avatar.png");
    expect(screen.queryByRole("button", { name: "取り消す" })).not.toBeInTheDocument();
  });

  // アンマウント時に blob URL を revoke する
  test("revokes object URL on unmount cleanup when preview exists", async () => {
    const { unmount } = render(<UserProfileForm user={mockUser} onCloseModal={() => {}} />);
    const fileInput = screen.getByLabelText("画像をアップロード") as HTMLInputElement;

    const validFile = new File([new Uint8Array(1024)], "a.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, validFile);

    // アンマウントで cleanup 実行
    unmount();

    // revoke が呼ばれている（クリーンアップ）
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
  });
});
