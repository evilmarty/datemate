import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

const SEARCH = "?d=2024-06-05T06%3A53%3A59.386Z";
const URL = "http://localhost/";
const HREF = `${URL}${SEARCH}`;

let historySpy;

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { search: SEARCH, href: HREF });
    historySpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
  });

  it("should render the app", () => {
    render(<App />);
    expect(screen.getByAltText("Date Mate")).toBeInTheDocument();
  });

  it("should update the date value when the date input changes", async () => {
    const expectedDate = "2025-07-06T06:53:59.386Z";
    render(<App />);
    const dateInput = screen.getByLabelText("Date", { selector: "#date" });
    expect(dateInput.value).toBe("2024-06-05");
    fireEvent.change(dateInput, { target: { value: "2025-07-06" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the time value when the time input changes", async () => {
    const expectedDate = "2024-06-05T05:16:59.386Z";
    render(<App />);
    const timeInput = screen.getByLabelText("Time", { selector: "#time" });
    expect(timeInput.value).toBe("06:53");
    fireEvent.change(timeInput, { target: { value: "05:16" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the timestamp value when the timestamp input changes", async () => {
    const expectedDate = "2025-08-20T06:53:59.386Z";
    render(<App />);
    const timestampInput = screen.getByLabelText("Timestamp", {
      selector: "#timestamp",
    });
    expect(timestampInput.value).toBe("1717570439386");
    fireEvent.change(timestampInput, { target: { value: "1755672839386" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the years value when the years input changes", async () => {
    const expectedDate = "2026-06-05T06:53:59.386Z";
    render(<App />);
    const yearsInput = screen.getByLabelText("Year", { selector: "#year" });
    expect(yearsInput.value).toBe("2024");
    fireEvent.change(yearsInput, { target: { value: "2026" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the months value when the months input changes", async () => {
    const expectedDate = "2024-01-05T06:53:59.386Z";
    render(<App />);
    const monthsInput = screen.getByLabelText("Month", { selector: "#month" });
    expect(monthsInput.value).toBe("June");
    fireEvent.change(monthsInput, { target: { value: "January" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the days value when the days input changes", async () => {
    const expectedDate = "2024-06-17T06:53:59.386Z";
    render(<App />);
    const daysInput = screen.getByLabelText("Day", { selector: "#day" });
    expect(daysInput.value).toBe("5");
    fireEvent.change(daysInput, { target: { value: "17" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the hours value when the hours input changes", async () => {
    const expectedDate = "2024-06-05T07:53:59.386Z";
    render(<App />);
    const hoursInput = screen.getByLabelText("Hour", { selector: "#hour" });
    expect(hoursInput.value).toBe("6");
    fireEvent.change(hoursInput, { target: { value: "7" } });
    expect(hoursInput.value).toBe("7");
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the minutes value when the minutes input changes", async () => {
    const expectedDate = "2024-06-05T06:07:59.386Z";
    render(<App />);
    const minutesInput = screen.getByLabelText("Minute", {
      selector: "#minute",
    });
    expect(minutesInput.value).toBe("53");
    fireEvent.change(minutesInput, { target: { value: "7" } });
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should update the seconds value when the seconds input changes", async () => {
    const expectedDate = "2024-06-05T06:53:08.386Z";
    render(<App />);
    const secondsInput = screen.getByLabelText("Second", {
      selector: "#second",
    });
    expect(secondsInput.value).toBe("59");
    fireEvent.change(secondsInput, { target: { value: "8" } });
    expect(secondsInput.value).toBe("8");
    expect(historySpy).toHaveBeenCalledWith(
      { date: expectedDate },
      "",
      `${URL}?d=${encodeURIComponent(expectedDate)}`,
    );
  });

  it("should copy the datetime when the copy button is clicked", async () => {
    const spy = vi.spyOn(navigator.clipboard, "writeText");
    render(<App />);
    const copyButton = screen.getAllByTitle("Copy to clipboard")[0];
    fireEvent.click(copyButton);
    expect(spy).toHaveBeenCalledWith(
      // Some versions of Node.js format the date string differently.
      expect.stringMatching(
        /Wednesday,? (5 June|June 5),? 2024 at 06:53:59 am UTC/i,
      ),
    );
  });

  it("should update the date when a valid relative time is entered", async () => {
    vi.useFakeTimers();
    const now = new Date("2024-06-05T06:53:59.386Z");
    vi.setSystemTime(now);
    render(<App />);
    const relativeTimeInput = screen.getByLabelText("Relative");
    fireEvent.change(relativeTimeInput, { target: { value: "2 days ago" } });
    fireEvent.blur(relativeTimeInput);
    const dateInput = screen.getByLabelText("Date", { selector: "#date" });
    expect(dateInput.value).toBe("2024-06-03");
    vi.useRealTimers();
  });

  it("should not update the date when an invalid relative time is entered", async () => {
    render(<App />);
    const relativeTimeInput = screen.getByLabelText("Relative");
    fireEvent.change(relativeTimeInput, { target: { value: "invalid time" } });
    fireEvent.blur(relativeTimeInput);
    const dateInput = screen.getByLabelText("Date", { selector: "#date" });
    expect(dateInput.value).toBe("2024-06-05");
  });

  it("should update the time when the meridian is changed to AM", async () => {
    render(<App />);
    const meridianInput = screen.getByLabelText("Meridian");
    fireEvent.change(meridianInput, { target: { value: "AM" } });
    const timeInput = screen.getByLabelText("Time", { selector: "#time" });
    expect(timeInput.value).toBe("06:53");
  });

  it("should update the time when the meridian is changed to PM", async () => {
    render(<App />);
    const meridianInput = screen.getByLabelText("Meridian");
    fireEvent.change(meridianInput, { target: { value: "PM" } });
    const timeInput = screen.getByLabelText("Time", { selector: "#time" });
    expect(timeInput.value).toBe("18:53");
  });

  it("should update the date when the day of the week is changed", async () => {
    render(<App />);
    const dayOfWeekInput = screen.getByLabelText("Day of Week");
    fireEvent.change(dayOfWeekInput, { target: { value: "Friday" } });
    const dateInput = screen.getByLabelText("Date", { selector: "#date" });
    expect(dateInput.value).toBe("2024-06-07");
  });
});
