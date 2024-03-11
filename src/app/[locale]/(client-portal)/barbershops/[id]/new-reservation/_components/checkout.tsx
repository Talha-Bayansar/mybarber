"use client";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getTimeFromMs } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  barberId: string;
  date: string;
  time: string;
  priceListItemId: string;
};

export const Checkout = ({ barberId, date, time, priceListItemId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { id: barbershopId } = useParams<{ id: string }>();
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

  if (barberIsLoading || barbershopIsLoading || priceListItemIsLoading)
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
      <Button
        onClick={handleCheckout}
        disabled={createReservation.isLoading || checkout.isLoading}
      >
        {t("NewReservationPage.payment_button")}
      </Button>
    </List>
  );
};
