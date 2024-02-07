"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from "~/components";
import { isArrayEmpty } from "~/lib";
import { type NewReservationForm } from ".";
import { useTranslations } from "next-intl";

type Props = {
  form: NewReservationForm;
};

export const BarberSelection = ({ form }: Props) => {
  const t = useTranslations();

  // Barber logic

  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("global.time")}</FormLabel>
          <FormControl>
            <Input placeholder="Select barber" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
