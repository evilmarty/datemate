export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getDateInTimezone(date: Date, timezone: string): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: timezone }));
}

export function setDay(d: Date, day: number): Date {
  const newDate = new Date(d);
  const currentDayOfWeek = newDate.getDay();
  const dayDiff = day - currentDayOfWeek;
  newDate.setDate(newDate.getDate() + dayDiff);
  return newDate;
}

export function getWeekdayNames(
  style: "long" | "short" | "narrow" = "long",
): string[] {
  const d = new Date();
  const f = new Intl.DateTimeFormat(undefined, { weekday: style });
  const weekdays: string[] = [];

  for (let i = 0; i < 7; i++) {
    weekdays[i] = f.format(setDay(d, i));
  }

  return weekdays;
}

export function getMonthNames(
  style: "numeric" | "long" | "short" | "narrow" | "2-digit" = "long",
): string[] {
  const d = new Date();
  const f = new Intl.DateTimeFormat(undefined, { month: style });
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    d.setMonth(i);
    months[i] = f.format(d);
  }

  return months;
}

export function getTimezones(): string[] {
  return Intl.supportedValuesOf("timeZone");
}

export function getMeridians(): [string, string] {
  const f = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: true,
  });
  const amDate = new Date("2023-01-01 09:00:00");
  const pmDate = new Date("2023-01-01 15:00:00");
  const amPart = f
    .formatToParts(amDate)
    .find((part) => part.type === "dayPeriod"); // "AM"
  const pmPart = f
    .formatToParts(pmDate)
    .find((part) => part.type === "dayPeriod"); // "PM"
  if (!amPart || !pmPart) {
    throw new Error("Failed to get AM/PM strings");
  }
  return [amPart.value, pmPart.value];
}

export function getRelativeTime(date: Date): string {
  const f = new Intl.RelativeTimeFormat(undefined, { style: "long" });
  const now = new Date();
  const abs = Math.abs;
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (abs(diffInSeconds) < 60) {
    return f.format(diffInSeconds, "second");
  } else if (abs(diffInMinutes) < 60) {
    return f.format(diffInMinutes, "minute");
  } else if (abs(diffInHours) < 24) {
    return f.format(diffInHours, "hour");
  } else if (abs(diffInDays) < 30) {
    return abs(diffInDays) % 7 === 0
      ? f.format(diffInDays / 7, "week")
      : f.format(diffInDays, "day");
  } else if (abs(diffInMonths) < 12) {
    return f.format(diffInMonths, "month");
  } else {
    return f.format(diffInYears, "year");
  }
}

export function parseRelativeTime(value: string): Date | null {
  const now = new Date();
  const input = value.toLowerCase().trim();

  // Match patterns like "5 minutes ago", "2 hours from now", "3 days ago", etc.
  const patterns = [
    { regex: /now/, multiplier: 0 },
    { regex: /tomorrow/, multiplier: 86400000 },
    { regex: /yesterday/, multiplier: -86400000 },
    { regex: /next\s+week/, multiplier: 604800000 },
    { regex: /last\s+week/, multiplier: -604800000 },
    { regex: /next\s+month/, multiplier: 2592000000 },
    { regex: /last\s+month/, multiplier: -2592000000 },
    { regex: /next\s+year/, multiplier: 31536000000 },
    { regex: /last\s+year/, multiplier: -31536000000 },
    { regex: /(\d+)\s+(second|seconds)\s+ago/, multiplier: -1000 },
    { regex: /(\d+)\s+(minute|minutes)\s+ago/, multiplier: -60000 },
    { regex: /(\d+)\s+(hour|hours)\s+ago/, multiplier: -3600000 },
    { regex: /(\d+)\s+(day|days)\s+ago/, multiplier: -86400000 },
    { regex: /(\d+)\s+(week|weeks)\s+ago/, multiplier: -604800000 },
    { regex: /(\d+)\s+(month|months)\s+ago/, multiplier: -2592000000 },
    { regex: /(\d+)\s+(year|years)\s+ago/, multiplier: -31536000000 },
    { regex: /(\d+)\s+(second|seconds)\s+from\s+now/, multiplier: 1000 },
    { regex: /(\d+)\s+(minute|minutes)\s+from\s+now/, multiplier: 60000 },
    { regex: /(\d+)\s+(hour|hours)\s+from\s+now/, multiplier: 3600000 },
    { regex: /(\d+)\s+(day|days)\s+from\s+now/, multiplier: 86400000 },
    { regex: /(\d+)\s+(week|weeks)\s+from\s+now/, multiplier: 604800000 },
    { regex: /(\d+)\s+(month|months)\s+from\s+now/, multiplier: 2592000000 },
    { regex: /(\d+)\s+(year|years)\s+from\s+now/, multiplier: 31536000000 },
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern.regex);
    if (match) {
      const amount = match.length > 1 ? parseInt(match[1]) : 1;
      return new Date(now.getTime() + amount * pattern.multiplier);
    }
  }

  return null;
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTimeForInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
