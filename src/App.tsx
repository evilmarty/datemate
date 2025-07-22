import { useState } from "react";
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

const getMeridian = (date: Date) => {
  return date.getHours() >= 12 ? PM : AM;
};

const App = () => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>(getCurrentTimezone);
  const [relativeTime, setRelativeTime] = useState<string>(
    getRelativeTime(currentDate),
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update current date and relative time
  const updateCurrentDate = (date: Date) => {
    setCurrentDate(date);
    setRelativeTime(getRelativeTime(date));
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
    newDate.setMonth(parseInt(value));
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
    const targetDayOfWeek = parseInt(value);
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

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <img src={logo} alt="Date Mate" className="w-50 mx-auto mb-6" />
      <CopyContext.Provider value={[copiedField, setCopiedField]}>
        <div className="space-y-2 max-w-96 mx-auto">
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
            valueKeys={true}
            copyValue={selectedTimezone}
            fieldName="timezone"
          />

          <Field
            label="Timestamp"
            type="number"
            value={currentDate.getTime()}
            onChange={(e) => handleTimestampChange(e.target.value)}
            copyValue={currentDate.getTime().toString()}
            fieldName="timestamp"
          />

          <Field
            label="Year"
            type="number"
            value={displayDate.getFullYear()}
            onChange={(e) => handleYearChange(e.target.value)}
            copyValue={displayDate.getFullYear().toString()}
            fieldName="year"
          />

          <Field
            label="Month"
            value={displayDate.getMonth()}
            onChange={(e) => handleMonthChange(e.target.value)}
            options={MONTHS}
            copyValue={MONTHS[displayDate.getMonth()]}
            fieldName="month"
          />

          <Field
            label="Day"
            type="number"
            min="1"
            max="31"
            value={displayDate.getDate()}
            onChange={(e) => handleDayChange(e.target.value)}
            copyValue={displayDate.getDate().toString()}
            fieldName="day"
          />

          <Field
            label="Day of Week"
            value={displayDate.getDay()}
            onChange={(e) => handleDayOfWeekChange(e.target.value)}
            options={DAYS_OF_WEEK}
            copyValue={DAYS_OF_WEEK[displayDate.getDay()]}
            fieldName="dayOfWeek"
          />

          <Field
            label="Hour"
            type="number"
            min="0"
            max="23"
            value={displayDate.getHours()}
            onChange={(e) => handleHourChange(e.target.value)}
            copyValue={displayDate.getHours().toString()}
            fieldName="hour"
          />

          <Field
            label="Meridian"
            value={getMeridian(displayDate)}
            onChange={(e) => handleMeridianChange(e.target.value)}
            options={MERIDIANS}
            valueKeys={true}
            fieldName="meridian"
          />

          <Field
            label="Minute"
            type="number"
            min="0"
            max="59"
            value={displayDate.getMinutes()}
            onChange={(e) => handleMinuteChange(e.target.value)}
            copyValue={displayDate.getMinutes().toString()}
            fieldName="minute"
          />

          <Field
            label="Second"
            type="number"
            min="0"
            max="59"
            value={displayDate.getSeconds()}
            onChange={(e) => handleSecondChange(e.target.value)}
            copyValue={displayDate.getSeconds().toString()}
            fieldName="second"
          />
        </div>
      </CopyContext.Provider>
      <div className="mt-8 text-sm text-center font-medium text-gray-500 dark:text-gray-400">
        <p>
          Made with
          <EmojiCycler
            emojis={["❤️", "🍺", "🌯", "🥃", "🍦"]}
            className="inline-block mx-1"
          />
          by
          <a href="https://marty.zalega.me" className="ml-1">
            evilmarty
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
