"use client";

import { List } from "~/components/layout/list";
import { Calendar } from "./calendar";
import { useState } from "react";
import { startOfToday } from "date-fns";
import {
  ReservationsView,
  ReservationsViewSkeleton,
} from "./reservations-view";

export const Schedule = () => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  return (
    <List>
      <Calendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      <ReservationsView date={selectedDay} />
    </List>
  );
};

export const ScheduleSkeleton = () => {
  const today = startOfToday();

  return (
    <List>
      <Calendar selectedDay={today} onSelectDay={() => null} />
      <ReservationsViewSkeleton />
    </List>
  );
};
