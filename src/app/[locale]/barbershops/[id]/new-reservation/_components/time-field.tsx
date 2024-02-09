"use client";

import { getTimeFromMs, isArrayEmpty } from "~/lib/utils";
import { type NewReservationForm } from "./reservation-form";
import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { InputFieldSkeleton } from "~/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props = {
  form: NewReservationForm;
};

export const TimeField = ({ form }: Props) => {
  const t = useTranslations();
  const { id: barbershopId } = useParams<{ id: string }>();
  const {
    data: availableIntervals,
    isLoading: isLoadingAvailableIntervals,
    isRefetching,
  } = api.barbershop.getAvailableIntervals.useQuery({
    barbershopId,
    barberId: form.getValues("barberId") || undefined,
    date: format(form.getValues("date"), "yyyy-MM-dd"),
  });

  if (isLoadingAvailableIntervals || isRefetching)
    return <InputFieldSkeleton />;

  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("global.time")}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(v) => form.setValue("time", v)}
              disabled={!form.getValues("date")}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("NewReservationPage.select_time")}
                />
              </SelectTrigger>
              <SelectContent>
                {availableIntervals && !isArrayEmpty(availableIntervals) ? (
                  availableIntervals.map((interval) => (
                    <SelectItem key={interval} value={getTimeFromMs(interval)}>
                      {getTimeFromMs(interval)}
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
