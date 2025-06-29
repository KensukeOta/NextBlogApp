import { render, screen } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import { Backdrop } from "./Backdrop";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

describe("Backdrop", () => {
  // バックドロップが描画されること
  test("renders a div with correct class names", () => {
    render(<Backdrop />);

    const backdrop = screen.getByRole("presentation");

    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass("fixed", "inset-0", "z-1", "bg-black/32");
  });
});
