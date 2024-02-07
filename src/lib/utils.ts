import { type PaginationQueryMeta } from "@xata.io/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Currency, currencies } from "./currencies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isArrayEmpty = (array: unknown[]) => {
  return array.length < 1;
};

export const generateArray = (size?: number) => {
  return [...Array(size ?? 20).keys()];
};

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

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies[code];
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
