import { generatePagination } from '@/app/lib/utils';

describe('generatePagination', () => {
  // totalPagesが7以下の場合、ページ番号がすべてリストに含まれるかどうかを確認
  it('should return all pages if totalPages is less than or equal to 7', () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  // currentPageが3以下の場合、「...」が正しくリストに含まれているか、最後の2ページが含まれているかを確認
  it('should include "..." for pages in the middle when currentPage is less than or equal to 3', () => {
    expect(generatePagination(1, 10)).toEqual([1, 2, 3, '...', 9, 10]);
    expect(generatePagination(2, 10)).toEqual([1, 2, 3, '...', 9, 10]);
    expect(generatePagination(3, 10)).toEqual([1, 2, 3, '...', 9, 10]);
  });

  // currentPageがtotalPages - 2 以上の場合、「...」が正しくリストに含まれているか、最初の2ページが含まれているかを確認
  it('should include "..." for pages in the middle when currentPage is greater than totalPages - 2', () => {
    expect(generatePagination(8, 10)).toEqual([1, 2, '...', 8, 9, 10]);
    expect(generatePagination(9, 10)).toEqual([1, 2, '...', 8, 9, 10]);
    expect(generatePagination(10, 10)).toEqual([1, 2, '...', 8, 9, 10]);
  });

  // currentPageが4からtotalPages - 3の間の場合、「...」が正しくリストに含まれているか、中間のページが正しくリストに含まれているかを確認
  it('should include "..." for pages in the middle when currentPage is between 4 and totalPages - 3', () => {
    expect(generatePagination(4, 10)).toEqual([1, '...', 3, 4, 5, '...', 10]);
    expect(generatePagination(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(generatePagination(6, 10)).toEqual([1, '...', 5, 6, 7, '...', 10]);
  });
});
