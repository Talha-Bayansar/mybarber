"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  calculateTimeDifference,
  getDateFromTime,
  getMsSinceMidnight,
  getTimeFromMs,
} from "~/lib/utils";
import { OpeningHoursRecord } from "~/server/db/xata";

type Create = {
  day_of_week: number;
};

type Update = OpeningHoursRecord;

type Props = {
  input: Create | Update;
  isLoading: boolean;
  onSubmit: (values: {
    startTime: number;
    duration: number;
    dayOfWeek: number;
  }) => void;
};

const isUpdate = (input: Create | Update) => {
  return (input as Update).id !== undefined;
};

export const OpeningHoursForm = ({ input, isLoading, onSubmit }: Props) => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.OpeningHoursEditPage");

  const formSchema = z.object({
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: isUpdate(input)
        ? getTimeFromMs((input as Update).start_time!)
        : "",
      endTime: isUpdate(input)
        ? getTimeFromMs(
            (input as Update).start_time! + (input as Update).duration!,
          )
        : "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const startDate = getDateFromTime(values.startTime);
    const startTime = getMsSinceMidnight(startDate);
    const duration = calculateTimeDifference(values.startTime, values.endTime);

    onSubmit({
      startTime,
      duration,
      dayOfWeek: input.day_of_week!,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("opening_hour")}</FormLabel>
              <FormControl>
                <Input placeholder="09:00" type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("closing_hour")}</FormLabel>
              <FormControl>
                <Input placeholder="17:00" type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>{tOwner("day_of_the_week")}</FormLabel>
          <FormControl>
            <Input value={t(`day_of_week.${input.day_of_week}`)} disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};
