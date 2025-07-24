import { useState, useEffect } from "react";
import Field from "./Field";
import CopyContext from "./CopyContext";
import EmojiCycler from "./EmojiCycler";
import {
  getDateInTimezone,
  getCurrentTimezone,
  setDay,
  getWeekdayNames,
  getMonthNames,
  getTimezones,
  getMeridians,
  getRelativeTime,
  parseRelativeTime,
  formatDateForInput,
  formatTimeForInput,
} from "./utils";
import logo from "./logo.svg";
import "./App.css"; // Import your CSS file for styling

const MERIDIANS = getMeridians();
const [AM, PM] = MERIDIANS;
const TIMEZONES = getTimezones();
const MONTHS = getMonthNames();
const DAYS_OF_WEEK = getWeekdayNames();
const NONE = "none";

const NONE_OPTIONS = {
  [NONE]: "None",
};
const DAY_OPTIONS = {
  ...NONE_OPTIONS,
  numeric: "Numeric",
  "2-digit": "2-Digit",
};
const WEEKDAY_OPTIONS = {
  ...NONE_OPTIONS,
  long: "Long",
  short: "Short",
  narrow: "Narrow",
};
const MONTH_OPTIONS = {
  ...WEEKDAY_OPTIONS,
};
const YEAR_OPTIONS = {
  ...DAY_OPTIONS,
};
const HOUR_OPTIONS = {
  ...DAY_OPTIONS,
};
const MINUTE_OPTIONS = {
  ...DAY_OPTIONS,
};
const SECOND_OPTIONS = {
  ...DAY_OPTIONS,
};
const TIMEZONE_NAME_OPTIONS = {
  ...NONE_OPTIONS,
  long: "Long",
  short: "Short",
  shortOffset: "Short Offset",
  longOffset: "Long Offset",
  shortGeneric: "Short Generic",
  longGeneric: "Long Generic",
};

const getMeridian = (date: Date) => {
  return date.getHours() >= 12 ? PM : AM;
};

const getDateFromUrlParam = (): Date | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("d");
  if (dateParam) {
    const date = new Date(dateParam);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
};

const setDateInUrlParam = (date: Date) => {
  const url = new URL(window.location.href);
  const dateString = date.toISOString();
  url.searchParams.set("d", dateString);
  window.history.pushState({ date: dateString }, "", url.toString());
};

const App = () => {
  const [currentDate, setCurrentDate] = useState<Date>(
    () => getDateFromUrlParam() || new Date(),
  );
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(getCurrentTimezone);
  const [relativeTime, setRelativeTime] = useState<string>(
    getRelativeTime(currentDate),
  );
  const copiedField = useState<string | null>(null);
  const [displayOptions, setDisplayOptions] =
    useState<Intl.DateTimeFormatOptions>({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "popstate",
      (e) => {
        const dateString = e.state?.date;
        const date = dateString ? new Date(dateString) : new Date();
        if (!isNaN(date.getTime())) {
          updateCurrentDate(date, false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  });

  // Update current date and relative time
  const updateCurrentDate = (date: Date, updateUrl: boolean = true) => {
    setCurrentDate(date);
    setRelativeTime(getRelativeTime(date));
    if (updateUrl) {
      setDateInUrlParam(date);
    }
  };

  const handleDisplayOptionChange = (
    option: keyof Intl.DateTimeFormatOptions,
    value: string,
  ) => {
    setDisplayOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value === NONE ? undefined : value,
    }));
  };

  // Update date field
  const handleDateChange = (value: string) => {
    const newDate = new Date(currentDate);
    const [year, month, day] = value.split("-");
    newDate.setFullYear(parseInt(year));
    newDate.setMonth(parseInt(month) - 1);
    newDate.setDate(parseInt(day));
    updateCurrentDate(newDate);
  };

  // Update time field
  const handleTimeChange = (value: string) => {
    const newDate = new Date(currentDate);
    const [hours, minutes] = value.split(":");
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    updateCurrentDate(newDate);
  };

  // Update timestamp field
  const handleTimestampChange = (value: string) => {
    const timestamp = parseInt(value);
    if (!isNaN(timestamp)) {
      updateCurrentDate(new Date(timestamp));
    }
  };

  // Update year field
  const handleYearChange = (value: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(value));
    updateCurrentDate(newDate);
  };

  // Update month field
  const handleMonthChange = (value: string) => {
    const newDate = new Date(currentDate);
    const index = MONTHS.indexOf(value);
    newDate.setMonth(index);
    updateCurrentDate(newDate);
  };

  // Update day field
  const handleDayChange = (value: string) => {
    const newDate = new Date(currentDate);
    newDate.setDate(parseInt(value));
    updateCurrentDate(newDate);
  };

  // Update day of week field
  const handleDayOfWeekChange = (value: string) => {
    const targetDayOfWeek = DAYS_OF_WEEK.indexOf(value);
    updateCurrentDate(setDay(currentDate, targetDayOfWeek));
  };

  // Update hour field
  const handleHourChange = (value: string) => {
    const newDate = new Date(currentDate);
    newDate.setHours(parseInt(value));
    updateCurrentDate(newDate);
  };

  // Update meridian field (AM/PM)
  const handleMeridianChange = (value: string) => {
    const newDate = new Date(currentDate);
    const currentHour = newDate.getHours();

    if (value === AM) {
      // Convert to AM
      if (currentHour >= 12) {
        newDate.setHours(currentHour - 12);
      }
    } else {
      // Convert to PM
      if (currentHour < 12) {
        newDate.setHours(currentHour + 12);
      }
    }
    updateCurrentDate(newDate);
  };

  // Update minute field
  const handleMinuteChange = (value: string) => {
    const newDate = new Date(currentDate);
    newDate.setMinutes(parseInt(value));
    updateCurrentDate(newDate);
  };

  // Update second field
  const handleSecondChange = (value: string) => {
    const newDate = new Date(currentDate);
    newDate.setSeconds(parseInt(value));
    updateCurrentDate(newDate);
  };

  // Parse relative time input and update date
  const handleRelativeTimeChange = (value: string) => {
    const newDate = parseRelativeTime(value);
    if (newDate) {
      setCurrentDate(newDate);
    }
    setRelativeTime(value);
  };

  // Either update date on blur or reset to current relative time
  const handleRelativeTimeBlur = (value: string) => {
    const newDate = parseRelativeTime(value);
    if (newDate) {
      updateCurrentDate(newDate);
    } else {
      setRelativeTime(getRelativeTime(currentDate));
    }
  };

  // Display current date in selected timezone
  const displayDate =
    selectedTimezone === getCurrentTimezone()
      ? currentDate
      : getDateInTimezone(currentDate, selectedTimezone);
  const localeDate = currentDate.toLocaleString(undefined, {
    ...displayOptions,
    timeZone: selectedTimezone,
  });

  return (
    <div className="max-w-2xl container mx-auto p-6 min-h-screen">
      <img src={logo} alt="Date Mate" className="w-50 mx-auto" />
      <CopyContext.Provider value={copiedField}>
        <div className="space-y-2">
          <div className="mb-10">
            <Field
              value={localeDate}
              fieldName="datetime"
              align="center"
              readOnly
            />

            <details className="mx-2 px-4 open:py-4 bg-gray-100 dark:bg-gray-900 border-t-0 border border-gray-300 dark:border-gray-900 rounded-md rounded-t-none transition-all transition-discrete overflow-hidden group">
              <summary className="transition-all py-0 not-group-open:hover:py-1 list-none cursor-pointer text-xs text-center font-bold text-gray-500 dark:text-gray-400">
                Display Options
              </summary>
              <div className="grid grid-cols-2 gap-2 pt-4 transition-all transition-discrete overflow-hidden h-0 group-open:h-auto">
                <Field
                  label="Day"
                  fieldName="day-select"
                  value={displayOptions.day || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("day", e.target.value)
                  }
                  options={DAY_OPTIONS}
                  copyButton={false}
                  className="order-1"
                />
                <Field
                  label="Weekday"
                  fieldName="weekday-select"
                  value={displayOptions.weekday || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("weekday", e.target.value)
                  }
                  options={WEEKDAY_OPTIONS}
                  copyButton={false}
                  className="order-3"
                />
                <Field
                  label="Month"
                  fieldName="month-select"
                  value={displayOptions.month || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("month", e.target.value)
                  }
                  options={MONTH_OPTIONS}
                  copyButton={false}
                  className="order-5"
                />
                <Field
                  label="Year"
                  fieldName="year-select"
                  value={displayOptions.year || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("year", e.target.value)
                  }
                  options={YEAR_OPTIONS}
                  copyButton={false}
                  className="order-7"
                />
                <Field
                  label="Hour"
                  fieldName="hour-select"
                  value={displayOptions.hour || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("hour", e.target.value)
                  }
                  options={HOUR_OPTIONS}
                  copyButton={false}
                  className="order-2"
                />
                <Field
                  label="Minute"
                  fieldName="minute-select"
                  value={displayOptions.minute || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("minute", e.target.value)
                  }
                  options={MINUTE_OPTIONS}
                  copyButton={false}
                  className="order-4"
                />
                <Field
                  label="Second"
                  fieldName="second-select"
                  value={displayOptions.second || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("second", e.target.value)
                  }
                  options={SECOND_OPTIONS}
                  copyButton={false}
                  className="order-6"
                />
                <Field
                  label="Time Zone Name"
                  fieldName="timeZoneName-select"
                  value={displayOptions.timeZoneName || NONE}
                  onChange={(e) =>
                    handleDisplayOptionChange("timeZoneName", e.target.value)
                  }
                  options={TIMEZONE_NAME_OPTIONS}
                  copyButton={false}
                  className="order-8"
                />
              </div>
            </details>
          </div>

          <Field
            label="Relative"
            value={relativeTime}
            type="search"
            onChange={(e) => handleRelativeTimeChange(e.target.value)}
            onBlur={(e) => handleRelativeTimeBlur(e.target.value)}
            placeholder="e.g., 5 minutes ago, 2 hours from now"
            fieldName="relative"
          />

          <Field
            label="Date"
            type="date"
            value={formatDateForInput(displayDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            fieldName="date"
          />

          <Field
            label="Time"
            type="time"
            value={formatTimeForInput(displayDate)}
            onChange={(e) => handleTimeChange(e.target.value)}
            fieldName="time"
          />

          <Field
            label="Timezone"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            options={TIMEZONES}
            fieldName="timezone"
          />

          <Field
            label="Timestamp"
            type="number"
            value={currentDate.getTime()}
            onChange={(e) => handleTimestampChange(e.target.value)}
            fieldName="timestamp"
          />

          <Field
            label="Year"
            type="number"
            value={displayDate.getFullYear()}
            onChange={(e) => handleYearChange(e.target.value)}
            fieldName="year"
          />

          <Field
            label="Month"
            value={MONTHS[displayDate.getMonth()]}
            onChange={(e) => handleMonthChange(e.target.value)}
            options={MONTHS}
            fieldName="month"
          />

          <Field
            label="Day"
            type="number"
            min="1"
            max="31"
            value={displayDate.getDate()}
            onChange={(e) => handleDayChange(e.target.value)}
            fieldName="day"
          />

          <Field
            label="Day of Week"
            value={DAYS_OF_WEEK[displayDate.getDay()]}
            onChange={(e) => handleDayOfWeekChange(e.target.value)}
            options={DAYS_OF_WEEK}
            fieldName="dayOfWeek"
          />

          <Field
            label="Hour"
            type="number"
            min="0"
            max="23"
            value={displayDate.getHours()}
            onChange={(e) => handleHourChange(e.target.value)}
            fieldName="hour"
          />

          <Field
            label="Meridian"
            value={getMeridian(displayDate)}
            onChange={(e) => handleMeridianChange(e.target.value)}
            options={MERIDIANS}
            fieldName="meridian"
          />

          <Field
            label="Minute"
            type="number"
            min="0"
            max="59"
            value={displayDate.getMinutes()}
            onChange={(e) => handleMinuteChange(e.target.value)}
            fieldName="minute"
          />

          <Field
            label="Second"
            type="number"
            min="0"
            max="59"
            value={displayDate.getSeconds()}
            onChange={(e) => handleSecondChange(e.target.value)}
            fieldName="second"
          />
        </div>
      </CopyContext.Provider>
      <div className="mt-8 text-sm text-center font-medium text-gray-500 dark:text-gray-400">
        Made with
        <EmojiCycler
          emojis={["❤️", "🍺", "🌯", "🥃", "🍦"]}
          className="inline-block mx-1"
        />
        by
        <a href="https://marty.zalega.me" className="ml-1">
          evilmarty
        </a>
      </div>
    </div>
  );
};

export default App;
