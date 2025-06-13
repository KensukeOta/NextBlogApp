import { describe, it, expect } from "vitest";
import { generatePagination } from "@/app/lib/utils";

describe("generatePagination", () => {
  // ページ数が7以下なら全て表示
  it("全ページ数が7以下のとき全ページ番号を返す", () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  // 最初の3ページ以内
  it("現在ページが最初の3ページ以内なら [1,2,3,'...',n-1,n] を返す", () => {
    expect(generatePagination(1, 10)).toEqual([1, 2, 3, "...", 9, 10]);
    expect(generatePagination(2, 10)).toEqual([1, 2, 3, "...", 9, 10]);
    expect(generatePagination(3, 10)).toEqual([1, 2, 3, "...", 9, 10]);
  });

  // 最後の3ページ以内
  it("現在ページが最後の3ページ以内なら [1,2,'...',n-2,n-1,n] を返す", () => {
    expect(generatePagination(8, 10)).toEqual([1, 2, "...", 8, 9, 10]);
    expect(generatePagination(9, 10)).toEqual([1, 2, "...", 8, 9, 10]);
    expect(generatePagination(10, 10)).toEqual([1, 2, "...", 8, 9, 10]);
  });

  // 真ん中
  it("現在ページが真ん中なら [1,'...',c-1,c,c+1,'...',n] を返す", () => {
    expect(generatePagination(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    expect(generatePagination(6, 10)).toEqual([1, "...", 5, 6, 7, "...", 10]);
    expect(generatePagination(4, 8)).toEqual([1, "...", 3, 4, 5, "...", 8]);
  });

  // 境界値
  it("境界値チェック: ページ数1や現在ページが不正値の場合", () => {
    expect(generatePagination(1, 1)).toEqual([1]);
    expect(generatePagination(1, 0)).toEqual([]);
    expect(generatePagination(0, 5)).toEqual([1, 2, 3, 4, 5]); // currentPage=0でも全部出す
    expect(generatePagination(-1, 5)).toEqual([1, 2, 3, 4, 5]); // マイナスでも全部
  });
});
