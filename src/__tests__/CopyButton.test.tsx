import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CopyButton from "../CopyButton";
import CopyContext from "../CopyContext";

describe("CopyButton", () => {
  it("should render a copy button and copy to clipboard", async () => {
    const setCopiedField = vi.fn();
    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("navigator", { clipboard: clipboardMock });

    render(
      <CopyContext.Provider value={[null, setCopiedField]}>
        <CopyButton value="Test Value" fieldName="testField" />
      </CopyContext.Provider>,
    );

    const button = screen.getByTitle("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await fireEvent.click(button);

    await waitFor(() => {
      expect(clipboardMock.writeText).toHaveBeenCalledWith("Test Value");
      expect(setCopiedField).toHaveBeenCalledWith("testField");
    });
  });

  it("should log an error if copying to the clipboard fails", async () => {
    const setCopiedField = vi.fn();
    const clipboardMock = {
      writeText: vi.fn().mockRejectedValue(new Error("Copy failed")),
    };
    vi.stubGlobal("navigator", { clipboard: clipboardMock });
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <CopyContext.Provider value={[null, setCopiedField]}>
        <CopyButton value="Test Value" fieldName="testField" />
      </CopyContext.Provider>,
    );

    const button = screen.getByTitle("Copy to clipboard");
    await fireEvent.click(button);

    await waitFor(() => {
      expect(clipboardMock.writeText).toHaveBeenCalledWith("Test Value");
      expect(setCopiedField).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to copy: ",
        new Error("Copy failed"),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
