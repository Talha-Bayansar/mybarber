"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Skeleton } from "~/components/ui/skeleton";
import { routes } from "~/lib/routes";
import { generateArray } from "~/lib/utils";
import { Link, useRouter } from "~/navigation";
import { api } from "~/trpc/react";

const formSchema = z.object({
  barberId: z.string().min(1),
  date: z.string().min(10),
  time: z.string().min(1),
  priceListItemId: z.string().min(1),
});

type Props = {
  date?: string;
  time?: string;
  barberId?: string;
};

export const TreatmentSelection = ({ date, time, barberId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { id: barbershopId } = useParams<{ id: string }>();
  const { data: priceList, isLoading: isLoading } =
    api.priceList.getByBarbershopId.useQuery({
      barbershopId,
    });

  const getSearchParams = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("date", date!);
    searchParams.set("time", time!);

    return searchParams.toString();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barberId,
      date,
      time,
      priceListItemId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, barberId, priceListItemId } = values;
    const searchParams = new URLSearchParams();
    searchParams.set("date", date);
    searchParams.set("time", time);
    searchParams.set("barber", barberId);
    searchParams.set("treatment", priceListItemId);
    router.push(
      `${routes.barbershops.root}/${barbershopId}/new-reservation?${searchParams.toString()}`,
    );
  }

  if (isLoading) return <TreatmentSelectionSkeleton />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <FormField
          control={form.control}
          name="priceListItemId"
          render={({ field }) => (
            <FormItem className=" flex-grow space-y-8">
              <h2 className="text-xl font-medium">
                {t("NewReservationPage.select_treatment")}
              </h2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col gap-4"
                >
                  {priceList?.items?.map((item) => {
                    return (
                      <FormItem key={item.id} className="flex gap-4">
                        <FormLabel className="flex flex-grow flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm font-normal text-gray-500">
                            {item.description}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem value={item.id} />
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
              href={`${routes.barbershops.root}/${barbershopId}/new-reservation?${getSearchParams()}`}
            >
              <ChevronLeft size={20} /> {t("global.back")}
            </Link>
          </Button>
          <Button type="submit">
            {t("NewReservationPage.review_button")} <ChevronRight size={20} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

const TreatmentSelectionSkeleton = () => {
  return (
    <List className="gap-2">
      {generateArray(15).map((v) => (
        <Skeleton key={v} className="h-10 w-full" />
      ))}
    </List>
  );
};
