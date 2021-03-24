import { render, screen } from "@testing-library/react";
import Home from "../../pages/index";

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Public Maps" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("main")
    ).toBeInTheDocument();
  });
});