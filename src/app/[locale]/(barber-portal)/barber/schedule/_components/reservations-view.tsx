import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React from "react";
import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { generateArray, getTimeFromMs, isArrayEmpty } from "~/lib/utils";
import { api } from "~/trpc/react";

type Props = {
  date: Date;
};

export const ReservationsView = ({ date }: Props) => {
  const t = useTranslations("global");
  const { data, isLoading } = api.reservation.getByMyBarber.useQuery({
    date: format(date, "yyyy-MM-dd"),
  });

  if (isLoading) return <ReservationsViewSkeleton />;

  if (!data || isArrayEmpty(data)) return <EmptyState />;

  return (
    <List>
      {data.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-4">
            <div className="text-lg font-medium">
              {reservation.start_time
                ? getTimeFromMs(reservation.start_time)
                : t("not_specified")}{" "}
              -{" "}
              {reservation.start_time && reservation.price_list_item?.duration
                ? getTimeFromMs(
                    reservation.start_time +
                      reservation.price_list_item.duration,
                  )
                : t("not_specified")}
            </div>
            <div>{reservation.price_list_item?.name ?? t("not_specified")}</div>
            <div>{reservation.user?.name ?? t("not_specified")}</div>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export const ReservationsViewSkeleton = () => {
  return (
    <List>
      {generateArray(6).map((v) => (
        <Skeleton key={v} className="h-10 w-full" />
      ))}
    </List>
  );
};
