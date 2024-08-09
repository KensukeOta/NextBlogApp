import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders a footer", () => {
    render(<Footer />);

    const element = screen.getByRole("contentinfo");

    expect(element).toBeInTheDocument();
  });

  it("renders a component", () => {
    render(<Footer />);

    const element = screen.getByText("© OtaKensuke");

    expect(element).toBeInTheDocument();
  });
});
