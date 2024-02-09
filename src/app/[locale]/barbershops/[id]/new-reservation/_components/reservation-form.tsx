"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { InputFieldSkeleton, InputSkeleton } from "~/components/ui/input";
import { routes } from "~/lib/routes";
import {
  generateArray,
  getDateFromTime,
  getMsSinceMidnight,
} from "~/lib/utils";
import { useRouter } from "~/navigation";
import { api } from "~/trpc/react";
import { DateField } from "./date-field";
import { TimeField } from "./time-field";
import { TreatmentField } from "./treatment-field";
import { BarberSelection } from "./barber-selection";

const formSchema = z.object({
  barberId: z.string(),
  date: z.date(),
  time: z.string().min(1),
  priceListItemId: z.string().min(1),
});

export type NewReservationForm = UseFormReturn<
  {
    barberId: string;
    date: Date;
    priceListItemId: string;
    time: string;
  },
  any,
  {
    barberId: string;
    date: Date;
    priceListItemId: string;
    time: string;
  }
>;

export const ReservationForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const barbershopId = params.id;
  const utils = api.useUtils();

  const createReservation = api.reservation.create.useMutation({
    onSuccess: async () => {
      toast("Successfully created new reservation.");
      utils.reservation.getPaginated.refetch();
      router.replace(routes.reservations.root);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barberId: "",
      date: startOfToday(),
      time: "",
      priceListItemId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, priceListItemId, barberId } = values;
    const startTime = getMsSinceMidnight(getDateFromTime(time));
    createReservation.mutate({
      barbershopId,
      date: format(date, "yyyy-MM-dd"),
      startTime,
      priceListItemId,
      barberId: barberId || undefined,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <List className="gap-8">
          <BarberSelection form={form} />
          <DateField form={form} />
          <TimeField form={form} />
          <TreatmentField form={form} />
        </List>
        <Button
          className="w-full"
          type="submit"
          disabled={createReservation.isLoading}
        >
          {t("global.submit")}
        </Button>
      </form>
    </Form>
  );
};

export const ReservationFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <List className="gap-8">
        {generateArray(3).map((v) => (
          <InputFieldSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
