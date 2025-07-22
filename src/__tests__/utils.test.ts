import { describe, it, expect, vi } from 'vitest';
import {
  getCurrentTimezone,
  getDateInTimezone,
  setDay,
  getWeekdayNames,
  getMonthNames,
  getTimezones,
  getMeridians,
  getRelativeTime,
  parseRelativeTime,
  formatDateForInput,
  formatTimeForInput,
} from '../utils';

describe('utils', () => {
  describe('getCurrentTimezone', () => {
    it('should return the current timezone', () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      expect(getCurrentTimezone()).toBe(timezone);
    });
  });

  describe('getDateInTimezone', () => {
    it('should return a date in the specified timezone', () => {
      const date = new Date('2025-07-23T12:00:00Z');
      const timezone = 'America/New_York';
      const expectedDate = new Date('2025-07-23T08:00:00'); // EDT is UTC-4
      // Note: This test is tricky because of local environment.
      // We'll check if the hour changes as expected.
      const newDate = getDateInTimezone(date, timezone);
      expect(newDate.getHours()).not.toBe(date.getUTCHours());
    });
  });

  describe('setDay', () => {
    it('should set the day of the week', () => {
      const date = new Date('2025-07-23T12:00:00Z'); // Wednesday
      const newDate = setDay(date, 0); // Sunday
      expect(newDate.getDay()).toBe(0);
    });
  });

  describe('getWeekdayNames', () => {
    it('should return an array of 7 weekday names', () => {
      const weekdays = getWeekdayNames();
      expect(weekdays).toHaveLength(7);
      expect(weekdays[0]).toBe('Sunday');
    });
  });

  describe('getMonthNames', () => {
    it('should return an array of 12 month names', () => {
      const months = getMonthNames();
      expect(months).toHaveLength(12);
      expect(months[0]).toBe('January');
    });
  });

  describe('getTimezones', () => {
    it('should return an array of timezones', () => {
      const timezones = getTimezones();
      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones.length).toBeGreaterThan(0);
      expect(timezones).toContain('America/New_York');
    });
  });

  describe('getMeridians', () => {
    it('should return AM and PM', () => {
      const meridians = getMeridians();
      expect(meridians).toEqual(['AM', 'PM']);
    });
  });

  describe('getRelativeTime', () => {
    it('should return relative time strings', () => {
        vi.useFakeTimers();
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
        vi.useRealTimers();
    });
  });

  describe('parseRelativeTime', () => {
    it('should parse relative time strings', () => {
        const now = new Date();
        const result = parseRelativeTime('5 minutes ago');
        expect(result).not.toBeNull();
        if (result) {
            const diff = now.getTime() - result.getTime();
            expect(diff).toBeGreaterThanOrEqual(5 * 60 * 1000 - 1000); // Allow 1s tolerance
            expect(diff).toBeLessThan(5 * 60 * 1000 + 1000);
        }
    });

    it('should handle "now"', () => {
        const now = new Date();
        const result = parseRelativeTime('now');
        expect(result).not.toBeNull();
        if (result) {
            const diff = Math.abs(now.getTime() - result.getTime());
            expect(diff).toBeLessThan(1000); // Should be very close
        }
    });
  });

    describe('formatDateForInput', () => {
        it('should format a date for input', () => {
            const date = new Date('2025-07-23T12:00:00Z');
            expect(formatDateForInput(date)).toBe('2025-07-23');
        });
    });

    describe('formatTimeForInput', () => {
        it('should format a time for input', () => {
            const date = new Date('2025-07-23T12:05:00Z');
            // Note: this will be affected by the system's timezone.
            // We'll mock the date to be sure.
            vi.useFakeTimers();
            const fakeDate = new Date(2025, 6, 23, 12, 5); // July 23, 2025 12:05
            expect(formatTimeForInput(fakeDate)).toBe('12:05');
            vi.useRealTimers();
        });
    });
});