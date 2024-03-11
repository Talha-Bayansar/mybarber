"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { getTimeFromMs } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  barberId: string;
  date: string;
  time: string;
  priceListItemId: string;
};

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  phoneNumber: z.string().min(1),
});

export const Checkout = ({ barberId, date, time, priceListItemId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { id: barbershopId } = useParams<{ id: string }>();
  const session = useSession();
  const { data: barber, isLoading: barberIsLoading } =
    api.barber.getById.useQuery({
      id: barberId,
    });
  const { data: barbershop, isLoading: barbershopIsLoading } =
    api.barbershop.getById.useQuery({
      id: barbershopId,
    });
  const { data: priceListItem, isLoading: priceListItemIsLoading } =
    api.priceListItem.getById.useQuery({
      id: priceListItemId,
    });

  const createReservation = api.reservation.create.useMutation({
    onSuccess: (reservation) => {
      checkout.mutate({
        id: reservation.id,
      });
    },
    onError: () => {
      toast(t("NewReservationPage.error_message"));
    },
  });
  const checkout = api.reservation.checkout.useMutation({
    onSuccess: (session) => {
      if (session.url) router.push(session.url);
    },
    onError: () => {
      toast(t("NewReservationPage.error_message"));
    },
  });

  const handleCheckout = () => {
    createReservation.mutate({
      startTime: Number(time),
      date,
      barberId,
      barbershopId,
      priceListItemId,
    });
  };

  if (
    barberIsLoading ||
    barbershopIsLoading ||
    priceListItemIsLoading ||
    session.status === "loading"
  )
    return <Skeleton className="h-32 w-full" />;

  if (!barber || !barbershop || !priceListItem) return <EmptyState />;

  return (
    <List className="flex-grow justify-between md:justify-start">
      <List>
        <h2 className="text-xl font-medium">
          {t("NewReservationPage.your_reservation")}
        </h2>
        <Card className="p-4">
          <p className="text-xl font-medium">
            {format(date, "dd-MM-yyyy")} - {getTimeFromMs(Number(time))}
          </p>
          <p>
            <span className="font-medium">{t("global.barbershop")}: </span>
            {barbershop.name}
          </p>
          <p>
            <span className="font-medium">{t("global.barber")}: </span>
            {`${barber.first_name} ${barber.last_name}`}
          </p>
          <p>
            <span className="font-medium">{t("global.treatment")}: </span>
            {priceListItem.name}
          </p>
          {/* <p>
        <span className="font-medium">{t("price")}: </span>
        {
          getCurrencyByCode(reservation.price_list_item!.price_list!.currency!)
            ?.symbol
        }{" "}
        {reservation.price_list_item?.price?.toFixed(2)}
      </p> */}
        </Card>
      </List>

      {session.status === "authenticated" ? (
        <Button
          onClick={handleCheckout}
          disabled={createReservation.isLoading || checkout.isLoading}
        >
          {t("NewReservationPage.payment_button")}
        </Button>
      ) : (
        <GuestInfoForm
          onSubmit={({ email, name, phoneNumber }) =>
            createReservation.mutate({
              startTime: Number(time),
              date,
              barberId,
              barbershopId,
              priceListItemId,
              guestEmail: email,
              guestName: name,
              guestPhoneNumber: phoneNumber,
            })
          }
          isSubmitting={createReservation.isLoading || checkout.isLoading}
        />
      )}
    </List>
  );
};

type GuestInfoFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => unknown;
  isSubmitting: boolean;
};

const GuestInfoForm = (props: GuestInfoFormProps) => {
  const t = useTranslations("NewReservationPage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <List>
          <h2 className="text-xl font-medium">{t("personal_information")}</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("name_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("email_placeholder")}
                    type="email"
                    inputMode="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone_number")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("phone_number_placeholder")}
                    type="tel"
                    inputMode="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </List>

        <Button type="submit" className="w-full" disabled={props.isSubmitting}>
          {t("payment_button")}
        </Button>
      </form>
    </Form>
  );
};
