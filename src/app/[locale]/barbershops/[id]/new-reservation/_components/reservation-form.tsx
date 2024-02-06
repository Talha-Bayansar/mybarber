"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getDay } from "date-fns";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputSkeleton,
  List,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import {
  generateArray,
  getDateFromTime,
  getTimeFromMs,
  isArrayEmpty,
  routes,
} from "~/lib";
import { useRouter } from "~/navigation";
import { api } from "~/trpc/react";

const formSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  priceListItemId: z.string().min(1),
});

function generateTimeIntervals(startTime: string, endTime: string) {
  // Parse start and end times
  const start = getDateFromTime(startTime);
  const end = getDateFromTime(endTime);

  // Initialize array to store time intervals
  const intervals = [];

  // Iterate from start time to end time in 15-minute intervals
  let current = new Date(start);
  while (current <= end) {
    // Format current time as HH:mm
    const hours = String(current.getHours()).padStart(2, "0");
    const minutes = String(current.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    // Add formatted time to intervals array
    intervals.push(time);

    // Increment current time by 15 minutes
    current.setTime(current.getTime() + 15 * 60 * 1000);
  }

  return intervals;
}

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
  const { data: openingHours, isLoading: isLoadingOpeningHours } =
    api.openingHours.getAllByBarbershopId.useQuery({
      barbershopId,
    });
  const { data: priceList, isLoading: isLoadingPriceList } =
    api.priceList.getByBarbershopId.useQuery({
      barbershopId,
    });
  const createReservation = api.reservation.create.useMutation({
    onSuccess: () => {
      utils.reservation.getPaginated.refetch();
      toast("Successfully created new reservation.");
      router.replace(routes.reservations.root);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
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
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("global.date")}</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingOpeningHours ? (
            <InputSkeleton />
          ) : (
            <FormField
              control={form.control}
              name="time"
              render={() => (
                <FormItem>
                  <FormLabel>{t("global.time")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => form.setValue("time", v)}
                      disabled={!(form.getValues().date.length > 0)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("NewReservationPage.select_time")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {openingHours && !isArrayEmpty(openingHours) ? (
                          openingHours
                            .filter(
                              (oh) =>
                                oh.day_of_week! ===
                                getDay(form.getValues().date),
                            )
                            .map((oh) => [
                              ...generateTimeIntervals(
                                getTimeFromMs(oh.start_time!),
                                getTimeFromMs(oh.start_time! + oh.duration!),
                              ).map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                  {interval}
                                </SelectItem>
                              )),
                            ])
                        ) : (
                          <SelectItem disabled value="not-available">
                            {t("global.not_available")}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {isLoadingPriceList ? (
            <InputSkeleton />
          ) : (
            <FormField
              control={form.control}
              name="priceListItemId"
              render={() => (
                <FormItem>
                  <FormLabel>{t("global.treatment")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => form.setValue("priceListItemId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("NewReservationPage.select_treatment")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {priceList && !isArrayEmpty(priceList.items) ? (
                          priceList.items.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="not-available">
                            {t("global.not_available")}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
          <InputSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
