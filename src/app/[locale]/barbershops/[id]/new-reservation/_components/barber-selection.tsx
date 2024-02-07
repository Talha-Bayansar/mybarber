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
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { List } from "~/components/layout/list";
import { Skeleton } from "~/components/ui/skeleton";
import { generateArray } from "~/lib/utils";

type Props = {
  form: NewReservationForm;
};

export const BarberSelection = ({ form }: Props) => {
  const t = useTranslations("NewReservationPage");
  const { id: barbershopId } = useParams<{ id: string }>();
  const { data: barbers, isLoading: isLoadingBarbers } =
    api.barber.getByBarbershopId.useQuery({
      barbershopId,
    });

  if (isLoadingBarbers) return <BarberSelectionSkeleton />;

  return (
    <FormField
      control={form.control}
      name="barberId"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{t("select_barber")}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="" />
                </FormControl>
                <FormLabel className="font-normal">
                  {t("no_preference")}
                </FormLabel>
              </FormItem>
              {barbers?.map((barber) => (
                <FormItem
                  key={barber.id}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={barber.id} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {barber.first_name} {barber.last_name}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const BarberSelectionSkeleton = () => {
  return (
    <List>
      {generateArray(3).map((v) => (
        <div key={v} className="flex gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </List>
  );
};
