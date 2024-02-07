"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type NewReservationForm } from "./reservation-form";
import { useTranslations } from "next-intl";
import { Input } from "~/components/ui/input";

type Props = {
  form: NewReservationForm;
};

export const BarberSelection = ({ form }: Props) => {
  const t = useTranslations();

  // Barber logic

  return (
    <FormField
      control={form.control}
      name="barberId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("global.time")}</FormLabel>
          <FormControl>
            <Input
              placeholder={t("NewReservationPage.select_barber")}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
