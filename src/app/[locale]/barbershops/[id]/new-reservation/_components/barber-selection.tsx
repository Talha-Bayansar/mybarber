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
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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
              className="grid grid-cols-2 gap-8"
            >
              <FormItem className="flex flex-col items-center justify-end text-center">
                <FormLabel className="flex flex-grow flex-col justify-end font-normal">
                  {t("no_preference")}
                </FormLabel>
                <FormControl>
                  <RadioGroupItem value="" />
                </FormControl>
              </FormItem>
              {barbers?.map((barber) => {
                const searchParams = new URLSearchParams();
                searchParams.set(
                  "name",
                  `${barber.first_name} ${barber.last_name}`,
                );

                return (
                  <FormItem
                    key={barber.id}
                    className="flex flex-col items-center"
                  >
                    <FormLabel className="flex flex-grow flex-col items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://eu.ui-avatars.com/api/?${searchParams.toString()}&size=250`}
                        />
                        <AvatarFallback>
                          {barber.first_name?.at(0)} {barber.last_name?.at(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex flex-grow flex-col justify-center text-center font-normal">
                        {barber.first_name} {barber.last_name}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value={barber.id} />
                    </FormControl>
                  </FormItem>
                );
              })}
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
