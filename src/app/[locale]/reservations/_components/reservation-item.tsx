import { type ReservationRecord } from "~/server/db/xata";
import { format } from "date-fns";
import { getCurrencyByCode } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

type Props = {
  reservation: ReservationRecord;
};

export const ReservationItem = ({ reservation }: Props) => {
  return (
    <Card className="p-4">
      <p className="text-xl font-medium">
        {format(reservation.date!, "dd/MM/yyyy")} -{" "}
        {format(reservation.date!, "HH:mm")}
      </p>
      <p>{reservation.barbershop?.name}</p>
      <p>{reservation.price_list_item?.name}</p>
      <p>
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
