"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  isToday,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn, getDayOfWeek } from "~/lib/utils";

type Props = {
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
};

export const Calendar = ({ selectedDay, onSelectDay }: Props) => {
  const t = useTranslations("global");
  const today = startOfToday();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const intervals = eachDayOfInterval({
    start,
    end,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the selected day when it changes
    if (scrollContainerRef.current) {
      const selectedDayButton =
        scrollContainerRef.current.querySelector(".is-selected");
      if (selectedDayButton) {
        selectedDayButton.scrollIntoView({ block: "center" });
      }
    }
  }, [selectedDay]);

  return (
    <ScrollArea ref={scrollContainerRef} className="w-full pb-2">
      <div className="flex">
        {intervals.map((day, i) => (
          <Button
            variant="ghost"
            key={`day_${i}`}
            onClick={() => onSelectDay(day)}
            className={cn(
              "flex h-auto w-12 flex-col items-center rounded p-2 hover:bg-primary/15",
              {
                "is-selected bg-primary/15": isSameDay(selectedDay, day),
              },
            )}
          >
            <span
              className={cn("text-sm font-normal", {
                "text-primary": isToday(day),
              })}
            >
              {t(`day_of_week_short.${getDayOfWeek(day)}`)}
            </span>
            <span
              className={cn("text-lg font-normal", {
                "font-medium text-primary": isToday(day),
                "font-bold": isSameDay(selectedDay, day),
              })}
            >
              {day.getDate()}
            </span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
