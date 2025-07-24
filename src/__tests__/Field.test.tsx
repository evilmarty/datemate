import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Field from "../Field";

describe("Field", () => {
  it("should render a field with a label and value", () => {
    render(<Field label="Test Label" value="Test Value" readOnly />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Value")).toBeInTheDocument();
  });

  it("should render a field without a label", () => {
    render(<Field value="Test Value" readOnly />);
    expect(screen.queryByLabelText("Test Label")).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Value")).toBeInTheDocument();
  });
});
