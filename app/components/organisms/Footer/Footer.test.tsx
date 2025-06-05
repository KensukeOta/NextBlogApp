import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("<Footer />", () => {
  // Test that the footer is rendered and contains the copyright text
  test("renders footer with copyright text", () => {
    render(<Footer />);

    // <footer>要素であることを確認
    const footer = screen.getByRole("contentinfo");

    expect(footer).toBeInTheDocument();
    // テキスト内容を確認
    expect(footer).toHaveTextContent("© OtaKensuke");
  });
});
