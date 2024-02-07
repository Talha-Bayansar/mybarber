"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  InputFieldSkeleton,
} from "~/components";
import { getDateFromTime, getTimeFromMs, isArrayEmpty } from "~/lib";
import { type NewReservationForm } from ".";
import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { endOfDay, format, getDay, startOfDay } from "date-fns";

type Props = {
  form: NewReservationForm;
};

function generateTimeIntervals(startTime: string, endTime: string) {
  // Parse start and end times
  const start = getDateFromTime(startTime);
  const end = getDateFromTime(endTime);

  // Initialize array to store time intervals
  const intervals = [];

  // Iterate from start time to end time in 30-minute intervals
  const current = new Date(start);
  while (current <= end) {
    // Format current time as HH:mm
    const hours = String(current.getHours()).padStart(2, "0");
    const minutes = String(current.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // Add formatted time to intervals array
    intervals.push(time);

    // Increment current time by 30 minutes
    current.setTime(current.getTime() + 30 * 60 * 1000);
  }

  return intervals;
}

export const TimeField = ({ form }: Props) => {
  const t = useTranslations();
  const { id: barbershopId } = useParams<{ id: string }>();
  const { data: openingHours, isLoading: isLoadingOpeningHours } =
    api.openingHours.getAllByBarbershopId.useQuery({
      barbershopId,
    });
  const {
    data: reservations,
    isLoading: isLoadingReservations,
    isRefetching,
  } = api.reservation.getAllBetweenDates.useQuery({
    barbershopId,
    startDate: startOfDay(form.getValues().date).toISOString(),
    endDate: endOfDay(form.getValues().date).toISOString(),
  });

  const getAvailableTimes = () => {
    const reservedTimes = reservations?.map((reservation) =>
      format(reservation.date!, "HH:mm"),
    );
    const availableTimes = openingHours!
      .filter((oh) => oh.day_of_week === getDay(form.getValues().date))
      .map((oh) =>
        generateTimeIntervals(
          getTimeFromMs(oh.start_time!),
          getTimeFromMs(oh.start_time! + oh.duration!),
        ),
      )
      .reduce((previous, current) => [...previous, ...current], []);

    if (reservedTimes) {
      return availableTimes.filter(
        (interval) => !reservedTimes.includes(interval),
      );
    } else {
      return availableTimes;
    }
  };

  if (isLoadingOpeningHours || isLoadingReservations || isRefetching)
    return <InputFieldSkeleton />;

  return (
    <FormField
      control={form.control}
      name="time"
      render={() => (
        <FormItem>
          <FormLabel>{t("global.time")}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(v) => form.setValue("time", v)}
              disabled={!(form.getValues().date.length > 0)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("NewReservationPage.select_time")}
                />
              </SelectTrigger>
              <SelectContent>
                {openingHours && !isArrayEmpty(openingHours) ? (
                  getAvailableTimes().map((interval) => (
                    <SelectItem key={interval} value={interval}>
                      {interval}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="not-available">
                    {t("global.not_available")}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
