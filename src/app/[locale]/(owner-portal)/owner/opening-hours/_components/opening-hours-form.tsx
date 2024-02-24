"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input, InputFieldSkeleton } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  calculateTimeDifference,
  generateArray,
  getDateFromTime,
  getMsSinceMidnight,
  getTimeFromMs,
} from "~/lib/utils";
import type { OpeningHoursRecord } from "~/server/db/xata";

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
    withReservation: boolean;
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
    withReservation: z.boolean(),
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
      withReservation: isUpdate(input)
        ? (input as Update).with_reservation ?? false
        : true,
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
      withReservation: values.withReservation,
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
        <FormField
          control={form.control}
          name="withReservation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {tOwner("with_reservation")}
                </FormLabel>
                <FormDescription>
                  {tOwner("with_reservation_description")}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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

export const OpeningHoursFormSkeleton = () => {
  return (
    <List className="gap-8">
      {generateArray(4).map((v) => (
        <InputFieldSkeleton key={v} />
      ))}
    </List>
  );
};
