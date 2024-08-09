import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PostLinkButton } from "./PostLinkButton";

describe("PostLinkButton", () => {
  it("renders a Link button", () => {
    render(<PostLinkButton />);

    const element = screen.getByRole("link");

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("href", "/posts/create");
  });
  
  it("renders a component", () => {
    render(<PostLinkButton />);

    const element = screen.getByText("投稿する");

    expect(element).toBeInTheDocument();
  });
});
