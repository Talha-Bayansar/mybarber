"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { getDateFromTime, getMsSinceMidnight } from "~/lib/utils";
import { TimeField } from "./time-field";

import { DateField } from "./date-field";
import { format } from "date-fns";
import { useRouter } from "~/navigation";
import { routes } from "~/lib/routes";
import { useParams } from "next/navigation";

const formSchema = z.object({
  date: z.date(),
  time: z.string().min(1),
});

export type DateForm = UseFormReturn<
  {
    date: Date;
    time: string;
  },
  any,
  {
    date: Date;
    time: string;
  }
>;

export const DateForm = () => {
  const t = useTranslations();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time } = values;
    const timeInMs = getMsSinceMidnight(getDateFromTime(time));
    const formattedDate = format(date, "yyyy-MM-dd");

    const searchParams = new URLSearchParams();
    searchParams.set("date", formattedDate);
    searchParams.set("time", timeInMs.toString());

    router.push(
      `${routes.barbershops.root}/${id}/new-reservation?${searchParams.toString()}`,
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <List className="gap-8">
          <h2 className="text-xl font-medium">
            {t("NewReservationPage.select_date_time")}
          </h2>
          <DateField form={form} />
          <TimeField form={form} />
        </List>

        <Button type="submit" className="w-full">
          {t("global.next")}
        </Button>
      </form>
    </Form>
  );
};
