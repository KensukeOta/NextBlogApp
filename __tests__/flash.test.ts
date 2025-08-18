import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { setFlash, clearFlash } from "@/app/lib/utils/flash";

// ---- モック用変数 ----
let setSpy: ReturnType<typeof vi.fn>;
let cookiesSpy: ReturnType<typeof vi.fn>;

// next/headers の cookies をモック
vi.mock("next/headers", () => {
  return {
    cookies: (...args: unknown[]) => cookiesSpy(...args),
  };
});

describe("flash utils", () => {
  beforeEach(() => {
    setSpy = vi.fn();
    cookiesSpy = vi.fn(async () => ({ set: setSpy }));
    // NODE_ENV を test に固定
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs(); // ← 必ず元に戻す
    vi.restoreAllMocks();
  });

  // 明示した id / type / message を保存する
  test("setFlash saves explicit id / type / message", async () => {
    await setFlash({
      id: "fixed-id",
      type: "info",
      message: "Hello",
    });

    expect(cookiesSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledTimes(1);

    const [name, value, options] = setSpy.mock.calls[0];
    expect(name).toBe("flash");

    const parsed = JSON.parse(value);
    expect(parsed).toEqual({
      id: "fixed-id",
      type: "info",
      message: "Hello",
    });

    expect(options).toMatchObject({
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      maxAge: 20,
    });
  });

  // id と type を省略した場合デフォルトが入る
  test("setFlash fills defaults when id and type are omitted", async () => {
    const uuidSpy = vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("uuid-xyz");

    await setFlash({ message: "Saved" });

    const [_, value] = setSpy.mock.calls[0];
    const parsed = JSON.parse(value);

    expect(parsed).toEqual({
      id: "uuid-xyz",
      type: "success",
      message: "Saved",
    });

    uuidSpy.mockRestore();
  });

  // flash Cookie を削除する
  test("clearFlash deletes flash cookie", async () => {
    await clearFlash();

    expect(cookiesSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledTimes(1);

    const [name, value, options] = setSpy.mock.calls[0];
    expect(name).toBe("flash");
    expect(value).toBe("");
    expect(options).toMatchObject({ path: "/", maxAge: 0 });
  });
});
