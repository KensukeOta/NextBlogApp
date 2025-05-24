import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hoge } from "@/app/components/atoms/Hoge";

test("Hoge", () => {
  render(<Hoge />);

  const hoge = screen.getByRole("heading", { level: 1, name: "Hoge" });

  expect(hoge).toBeDefined();
  expect(hoge).toBeInTheDocument();
});
