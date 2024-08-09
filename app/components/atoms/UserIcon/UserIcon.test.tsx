import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UserIcon } from "./UserIcon";

describe("UserIcon", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/profile.jpg",
    posts: [],
  };

  it("renders user image", () => {
    render(<UserIcon user={mockUser} width={50} height={50} />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src"); // src属性が存在することを確認
    expect(imgElement).toHaveAttribute("alt", "User Image");
    expect(imgElement).toHaveAttribute("width", "50");
    expect(imgElement).toHaveAttribute("height", "50");
  });

  it("renders default image when user image is not provided", () => {
    const userWithoutImage = { ...mockUser, image: "" };
    render(<UserIcon user={userWithoutImage} width={50} height={50} />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src");
    expect(imgElement).toHaveAttribute("alt", "User Image");
  });

  it("applies default className", () => {
    render(<UserIcon user={mockUser} width={50} height={50} />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toHaveClass("inline-block border object-cover rounded-full");
  });

  it("allows custom className", () => {
    const customClassName = "custom-class";
    render(<UserIcon user={mockUser} width={50} height={50} className={customClassName} />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toHaveClass(customClassName);
  });

  it("allows custom alt text", () => {
    const customAlt = "Custom Alt Text";
    render(<UserIcon user={mockUser} width={50} height={50} alt={customAlt} />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toHaveAttribute("alt", customAlt);
  });
});
