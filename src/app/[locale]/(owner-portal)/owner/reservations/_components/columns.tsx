"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { getTimeFromMs } from "~/lib/utils";
import type {
  BarberRecord,
  PriceListItemRecord,
  ReservationRecord,
} from "~/server/db/xata";

export const columns: ColumnDef<ReservationRecord>[] = [
  {
    accessorKey: "date",
    header: () => {
      const t = useTranslations("global");
      return <div>{t("date")}</div>;
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{format(date, "dd-MM-yyyy")}</div>;
    },
  },
  {
    accessorKey: "start_time",
    header: () => {
      const t = useTranslations("global");
      return <div>{t("time")}</div>;
    },
    cell: ({ row }) => {
      const startTime = row.getValue("start_time") as number;
      return <div>{getTimeFromMs(startTime)}</div>;
    },
  },
  {
    accessorKey: "barber",
    header: () => {
      const t = useTranslations("global");
      return <div>{t("barber")}</div>;
    },
    cell: ({ row }) => {
      const t = useTranslations("global");
      const barber = row.getValue("barber") as BarberRecord;
      return (
        <div>
          {barber
            ? `${barber.first_name} ${barber.last_name}`
            : t("not_specified")}
        </div>
      );
    },
  },
  {
    accessorKey: "price_list_item",
    header: () => {
      const t = useTranslations("global");
      return <div>{t("treatment")}</div>;
    },
    cell: ({ row }) => {
      const t = useTranslations("global");
      const item = row.getValue("price_list_item") as PriceListItemRecord;
      return <div>{item?.name ?? t("not_specified")}</div>;
    },
  },
  {
    accessorKey: "is_paid",
    header: () => {
      const t = useTranslations("Owner.ReservationsPage");
      return <div>{t("is_paid")}</div>;
    },
    cell: ({ row }) => {
      const t = useTranslations("global");
      const isPaid = row.getValue("is_paid") as boolean;
      return <div>{isPaid ? t("yes") : t("no")}</div>;
    },
  },
];
