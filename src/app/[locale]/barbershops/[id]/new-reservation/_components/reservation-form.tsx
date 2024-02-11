"use client";

import { List } from "~/components/layout/list";
import { InputSkeleton } from "~/components/ui/input";
import { BarberSelection } from "./barber-selection";
import { DateForm } from "./date-form";
import { Skeleton } from "~/components/ui/skeleton";
import { TreatmentSelection } from "./treatment-selection";

type Props = {
  searchParams: {
    barber?: string;
    date?: string;
    time?: string;
    treatment?: string;
  };
};

export const ReservationForm = ({
  searchParams: { barber, date, time, treatment },
}: Props) => {
  if (date && time && barber)
    return <TreatmentSelection date={date} time={time} barberId={barber} />;

  if (date && time) return <BarberSelection date={date} time={time} />;

  return <DateForm />;
};

export const ReservationFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <Skeleton className="flex-grow" />
      <InputSkeleton />
    </List>
  );
};
