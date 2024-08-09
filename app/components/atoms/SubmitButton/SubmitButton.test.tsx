import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./SubmitButton";
import * as ReactDom from "react-dom";

// useFormStatus をモック化し、戻り値を指定
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn(),
}));

describe("SubmitButton", () => {
  it("renders the button with children", () => {
    // モック化された useFormStatus の戻り値を設定
    (ReactDom.useFormStatus as jest.Mock).mockReturnValue({ pending: false });

    render(<SubmitButton>Submit</SubmitButton>);

    const buttonElement = screen.getByRole("button", { name: /submit/i });

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Submit");
  });

  it("applies default className", () => {
    (ReactDom.useFormStatus as jest.Mock).mockReturnValue({ pending: false });

    render(<SubmitButton>Submit</SubmitButton>);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toHaveClass("w-full mt-4 p-2 bg-black text-white hover:opacity-70");
  });

  it("applies custom className", () => {
    (ReactDom.useFormStatus as jest.Mock).mockReturnValue({ pending: false });

    const customClassName = "custom-class";
    render(<SubmitButton className={customClassName}>Submit</SubmitButton>);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toHaveClass(customClassName);
  });

  it("disables the button when pending is true", () => {
    (ReactDom.useFormStatus as jest.Mock).mockReturnValue({ pending: true });

    render(<SubmitButton>Submit</SubmitButton>);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toBeDisabled();
  });

  it("enables the button when pending is false", () => {
    (ReactDom.useFormStatus as jest.Mock).mockReturnValue({ pending: false });

    render(<SubmitButton>Submit</SubmitButton>);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).not.toBeDisabled();
  });
});
