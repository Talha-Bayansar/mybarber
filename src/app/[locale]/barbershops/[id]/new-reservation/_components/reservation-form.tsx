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
import { generateArray } from "~/lib/utils";
import { useRouter } from "~/navigation";
import { api } from "~/trpc/react";
import { DateField } from "./date-field";
import { TimeField } from "./time-field";
import { TreatmentField } from "./treatment-field";

const formSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  priceListItemId: z.string().min(1),
});

export type NewReservationForm = UseFormReturn<
  {
    date: string;
    priceListItemId: string;
    time: string;
  },
  any,
  {
    date: string;
    priceListItemId: string;
    time: string;
  }
>;

function combineDateAndTime(dateTimeObject: { date: string; time: string }) {
  // Parse date and time strings
  const dateParts = dateTimeObject.date.split("-").map(Number);
  const timeParts = dateTimeObject.time.split(":").map(Number);

  // Create a new Date object with the parsed date
  const combinedDateTime = new Date(
    dateParts[0]!,
    dateParts[1]! - 1,
    dateParts[2],
  );

  // Set the time components of the Date object
  combinedDateTime.setHours(timeParts[0]!);
  combinedDateTime.setMinutes(timeParts[1]!);

  return combinedDateTime;
}

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
      date: format(startOfToday(), "yyyy-MM-dd"),
      time: "",
      priceListItemId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, priceListItemId } = values;
    createReservation.mutate({
      barbershopId,
      date: combineDateAndTime({ date, time }).toISOString(),
      priceListItemId,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <List className="gap-8">
          <DateField form={form} />
          <TimeField form={form} />
          <TreatmentField form={form} />
        </List>
        <Button className="w-full" type="submit">
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
