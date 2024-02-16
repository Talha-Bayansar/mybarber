"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { List } from "~/components/layout/list";
import { Skeleton } from "~/components/ui/skeleton";
import { generateArray, isArrayEmpty } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Link, useRouter } from "~/navigation";
import { routes } from "~/lib/routes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";

const formSchema = z.object({
  barberId: z.string().min(1),
  date: z.string().min(10),
  time: z.string().min(1),
});

type Props = {
  date?: string;
  time?: string;
};

export const BarberSelection = ({ date, time }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { id: barbershopId } = useParams<{ id: string }>();
  const { data: barbers, isLoading: isLoadingBarbers } =
    api.barber.getAllAvailable.useQuery({
      barbershopId,
      date,
      time: Number(time),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barberId: "no-preference",
      date,
      time,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, barberId } = values;

    const searchParams = new URLSearchParams();
    searchParams.set("date", date);
    searchParams.set("time", time);
    if (barbers && !isArrayEmpty(barbers)) {
      searchParams.set(
        "barber",
        barberId === "no-preference" ? getRandomItem(barbers)!.id : barberId,
      );
    }

    router.push(
      `${routes.barbershops.root}/${barbershopId}/new-reservation?${searchParams.toString()}`,
    );
  }

  function getRandomItem<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  if (isLoadingBarbers) return <BarberSelectionSkeleton />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <FormField
          control={form.control}
          name="barberId"
          render={({ field }) => (
            <FormItem className=" flex-grow space-y-8">
              <h2 className="text-xl font-medium">
                {t("NewReservationPage.select_barber")}
              </h2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-8"
                >
                  <FormItem className="flex flex-col items-center justify-end text-center">
                    <FormLabel className="flex flex-grow flex-col justify-end font-normal">
                      {t("NewReservationPage.no_preference")}
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="no-preference" />
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
                          <Avatar className="h-20 w-20">
                            <AvatarImage
                              className="object-cover"
                              src={barber.image?.url}
                              alt={`picture of ${barber.first_name} ${barber.last_name}`}
                            />
                            <AvatarFallback>
                              {barber.first_name?.at(0)}{" "}
                              {barber.last_name?.at(0)}
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
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link
              href={`${routes.barbershops.root}/${barbershopId}/new-reservation`}
            >
              <ChevronLeft size={20} /> {t("global.back")}
            </Link>
          </Button>
          <Button type="submit">
            {t("global.next")} <ChevronRight size={20} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

const BarberSelectionSkeleton = () => {
  return (
    <List className="grid grid-cols-2 gap-8">
      {generateArray(4).map((v) => (
        <div key={v} className="flex flex-grow flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      ))}
    </List>
  );
};
