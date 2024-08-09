import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';
import { usePathname, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Pagination Component', () => {
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/posts');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1'));
  });

  // 正しいページ数のリンクがレンダリングされるかを確認
  it('should render the correct number of pagination buttons', () => {
    render(<Pagination totalPages={5} />);
    const paginationButtons = screen.getAllByRole('link');
    expect(paginationButtons.length).toBe(5); // Expect 5 page links
  });

  // currentPage が正しく強調表示されているかどうかを確認
  it('should highlight the current page', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=3'));
    render(<Pagination totalPages={5} />);
    const currentPage = screen.getByText('3');
    expect(currentPage).toHaveClass('bg-blue-600');
  });

  // 最初のページでは左矢印が、最後のページでは右矢印が無効化されていることを確認
  it('should disable the left arrow on the first page', () => {
    render(<Pagination totalPages={5} />);
    const leftArrow = screen.getByTestId('arrow-left');
    expect(leftArrow).toHaveClass('pointer-events-none');
  });

  // 最初のページでは左矢印が、最後のページでは右矢印が無効化されていることを確認
  it('should disable the right arrow on the last page', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=5'));
    render(<Pagination totalPages={5} />);
    const rightArrow = screen.getByTestId('arrow-right');
    expect(rightArrow).toHaveClass('pointer-events-none');
  });

  // ページ数が多い場合に「...」が正しい位置に表示されるかを確認
  it('should render "..." when there are too many pages', () => {
    render(<Pagination totalPages={10} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  // 各ページリンクが正しいURLを生成しているかどうかを確認
  it('should create correct page URLs', () => {
    render(<Pagination totalPages={5} />);
    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/posts?page=2');
  });
});
