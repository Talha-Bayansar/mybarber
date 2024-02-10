import { type PaginationQueryMeta } from "@xata.io/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Currency, currencies } from "./currencies";
import { format, getDay, parse } from "date-fns";

// TAILWIND UTILITY FUNCTIONS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ARRAY UTILITY FUNCTIONS
export const isArrayEmpty = (array: unknown[]) => {
  return array.length < 1;
};

export const generateArray = (size?: number) => {
  return [...Array(size ?? 20).keys()];
};

export function reducePages<T>(
  pages: {
    records: T[];
    meta: PaginationQueryMeta;
  }[],
) {
  return pages.reduce(
    (previous, current) => {
      if (previous.records) {
        return {
          ...current,
          records: [...previous.records, ...current.records],
        } as typeof current;
      } else {
        return current;
      }
    },
    {} as (typeof pages)[0],
  );
}
// DATE/TIME UTILITY FUNCTIONS
export function getDateFromTime(time: string) {
  const date = new Date();
  const [hours, minutes] = time.split(":");
  date.setHours(parseInt(hours!), parseInt(minutes!), 0, 0);
  return date;
}

export function calculateTimeDifference(startTime: string, endTime: string) {
  const currentDate = new Date();
  const startDate = new Date(currentDate.toDateString() + " " + startTime);
  const endDate = new Date(currentDate.toDateString() + " " + endTime);

  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  const timeDifference = endDate.getTime() - startDate.getTime();

  return timeDifference;
}

export function getMsSinceMidnight(d: any) {
  const e = new Date(d);
  return d - e.setHours(0, 0, 0, 0);
}

export function getTimeFromMs(milliseconds: number) {
  const date = new Date(milliseconds);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return formattedTime;
}

export const getDayOfWeek = (date: string | number | Date) => {
  const day = getDay(date);
  if (day === 0) return 6;
  else return day - 1;
};

export function generateMsIntervals(
  startTimeInMs: number,
  endTimeInMs: number,
  interval = 15,
) {
  // Parse start and end times
  const start = getDateFromTime(getTimeFromMs(startTimeInMs));
  const end = getDateFromTime(getTimeFromMs(endTimeInMs));

  // Initialize array to store time intervals
  const intervals = [];

  // Iterate from start time to end time in 30-minute intervals
  const current = new Date(start);
  while (current <= end) {
    // Format current time as HH:mm
    // const hours = String(current.getHours()).padStart(2, "0");
    // const minutes = String(current.getMinutes()).padStart(2, "0");
    // const time = `${hours}:${minutes}`;

    // Add formatted time to intervals array
    intervals.push(getMsSinceMidnight(current));

    // Increment current time by 15 minutes
    current.setTime(current.getTime() + interval * 60 * 1000);
  }

  return intervals;
}

export function isValidDateFormat(dateString: string) {
  // Regular expression to match "yyyy-MM-dd" format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Test if the date string matches the format
  if (!dateFormatRegex.test(dateString)) {
    return false;
  }

  // Parse the date string and format it back to check if the format remains unchanged
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const formattedDate = format(parsedDate, "yyyy-MM-dd");

  // Compare the original date string with the formatted date string
  return dateString === formattedDate;
}

// CURRENCY UTILITY FUNCTIONS
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies[code];
};
