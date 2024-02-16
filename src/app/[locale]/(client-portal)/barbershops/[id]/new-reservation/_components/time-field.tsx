"use client";

import { getTimeFromMs, isArrayEmpty } from "~/lib/utils";
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
import { type DateForm } from "./date-form";

type Props = {
  form: DateForm;
};

export const TimeField = ({ form }: Props) => {
  const t = useTranslations();
  const date = form.getValues("date");

  const { id: barbershopId } = useParams<{ id: string }>();
  const {
    data: availableIntervals,
    isLoading: isLoadingAvailableIntervals,
    isRefetching,
  } = api.barbershop.getAvailableIntervals.useQuery({
    barbershopId,
    date: date ? format(date, "yyyy-MM-dd") : undefined,
  });

  if (isLoadingAvailableIntervals || isRefetching)
    return <InputFieldSkeleton />;

  return (
    <FormField
      shouldUnregister
      control={form.control}
      name="time"
      render={() => (
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
