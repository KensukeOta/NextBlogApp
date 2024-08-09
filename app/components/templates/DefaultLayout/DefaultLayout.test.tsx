import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { DefaultLayout } from "./DefaultLayout";

describe("DefaultLayout", () => {
  it("renders children correctly", () => {
    render(
      <DefaultLayout>
        <p>Test Child</p>
      </DefaultLayout>
    );

    const childElement = screen.getByText("Test Child");

    expect(childElement).toBeInTheDocument();
  });

  it("applies default className", () => {
    render(
      <DefaultLayout>
        <p>Test Child</p>
      </DefaultLayout>
    );

    const divElement = screen.getByText("Test Child").parentElement;

    expect(divElement).toHaveClass("bg-gray-100 h-full");
  });

  it("applies custom className", () => {
    const customClassName = "custom-class";

    render(
      <DefaultLayout className={customClassName}>
        <p>Test Child</p>
      </DefaultLayout>
    );

    const divElement = screen.getByText("Test Child").parentElement;

    expect(divElement).toHaveClass("bg-gray-100 h-full custom-class");
  });
});
