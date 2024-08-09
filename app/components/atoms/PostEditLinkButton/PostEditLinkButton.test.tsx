import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PostEditLinkButton } from "./PostEditLinkButton";

describe("PostEditLinkButton", () => {
  const mockPost = {
    id: "1",
    title: "Test Title",
    body: "Test Body",
    user_id: "1",
    user: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      image: "profile.jpg",
      posts: [],
    },
  };
  
  it("renders a Link button", () => {
    render(<PostEditLinkButton post={mockPost} />);

    const element = screen.getByRole("link");

    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("href", "/John Doe/posts/1/edit");
  });

  it("renders a component", () => {
    render(<PostEditLinkButton post={mockPost} />);

    const element = screen.getByText("更新");

    expect(element).toBeInTheDocument();
  });
});
