import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "~/components";
import { api } from "~/trpc/react";
import { NewReservationForm } from ".";
import { useTranslations } from "next-intl";

type Props = {
  form: NewReservationForm;
};

export const DateField = ({ form }: Props) => {
  const t = useTranslations("global");
  const utils = api.useUtils();

  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("date")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);
                utils.reservation.getAllBetweenDates.refetch();
              }}
              type="date"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
