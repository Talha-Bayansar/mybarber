"use client";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getTimeFromMs } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  reservation: string;
};

export const Checkout = ({ reservation: reservationId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: reservation, isLoading } = api.reservation.getById.useQuery({
    id: reservationId,
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
    checkout.mutate({
      id: reservationId,
    });
  };

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  if (!reservation) return <EmptyState />;

  return (
    <List className="flex-grow justify-between md:justify-start">
      <List>
        <h2 className="text-xl font-medium">
          {t("NewReservationPage.your_reservation")}
        </h2>
        <Card className="p-4">
          <p className="text-xl font-medium">
            {format(reservation.date!, "dd/MM/yyyy")} -{" "}
            {getTimeFromMs(reservation.start_time!)}
          </p>
          <p>
            <span className="font-medium">{t("global.barbershop")}: </span>
            {reservation.barbershop?.name}
          </p>
          <p>
            <span className="font-medium">{t("global.barber")}: </span>
            {`${reservation.barber?.first_name} ${reservation.barber?.last_name}`}
          </p>
          <p>
            <span className="font-medium">{t("global.treatment")}: </span>
            {reservation.price_list_item?.name}
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
      <Button onClick={handleCheckout}>
        {t("NewReservationPage.payment_button")}
      </Button>
    </List>
  );
};
