import { type ReservationRecord } from "~/server/db/xata";
import { format } from "date-fns";
import { getCurrencyByCode, getTimeFromMs } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useTranslations } from "next-intl";

type Props = {
  reservation: ReservationRecord;
};

export const ReservationItem = ({ reservation }: Props) => {
  const t = useTranslations("global");
  const fullName = reservation.barber
    ? `${reservation.barber?.first_name} ${reservation.barber?.last_name}`
    : undefined;

  return (
    <Card className="p-4">
      <p className="text-xl font-medium">
        {format(reservation.date!, "dd/MM/yyyy")} -{" "}
        {getTimeFromMs(reservation.start_time!)}
      </p>
      <p>
        <span className="font-medium">{t("barbershop")}: </span>
        {reservation.barbershop?.name}
      </p>
      <p>
        <span className="font-medium">{t("barber")}: </span>
        {fullName ?? t("not_specified")}
      </p>
      <p>
        <span className="font-medium">{t("treatment")}: </span>
        {reservation.price_list_item?.name}
      </p>
      <p>
        <span className="font-medium">{t("price")}: </span>
        {
          getCurrencyByCode(reservation.price_list_item!.price_list!.currency!)
            ?.symbol
        }{" "}
        {reservation.price_list_item?.price?.toFixed(2)}
      </p>
    </Card>
  );
};

export const ReservationItemSkeleton = () => {
  return <Skeleton className="h-32 w-full" />;
};
