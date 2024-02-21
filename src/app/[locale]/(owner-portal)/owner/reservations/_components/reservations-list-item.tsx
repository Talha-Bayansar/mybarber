import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getCurrencyByCode, getTimeFromMs } from "~/lib/utils";
import type { ReservationRecord } from "~/server/db/xata";

type Props = {
  reservation: ReservationRecord;
};

export const ReservationsListItem = ({ reservation }: Props) => {
  const t = useTranslations("global");
  const tReservationsPage = useTranslations("Owner.ReservationsPage");
  const fullName = reservation.barber
    ? `${reservation.barber?.first_name} ${reservation.barber?.last_name}`
    : undefined;

  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-xl font-medium">
        {format(reservation.date!, "dd/MM/yyyy")} -{" "}
        {getTimeFromMs(reservation.start_time!)}
      </p>
      <InfoLine label={t("barber")} value={fullName ?? t("not_specified")} />
      <InfoLine
        label={t("treatment")}
        value={reservation.price_list_item?.name ?? t("not_specified")}
      />
      <InfoLine
        label={tReservationsPage("is_paid")}
        value={reservation.is_paid ? t("yes") : t("no")}
      />
      <InfoLine
        label={t("price")}
        value={`${
          reservation.price_list_item
            ? getCurrencyByCode(
                reservation.price_list_item!.price_list!.currency! ?? "EUR",
              )?.symbol
            : ""
        } ${reservation.price_list_item?.price?.toFixed(2) ?? t("not_specified")}`}
      />
    </Card>
  );
};

type InfoLineProps = {
  label: string;
  value: string;
};

const InfoLine = ({ label, value }: InfoLineProps) => {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-sm text-gray-500">{value}</span>
    </div>
  );
};

export const ReservationsListItemSkeleton = () => {
  return <Skeleton className="h-32 w-full" />;
};
