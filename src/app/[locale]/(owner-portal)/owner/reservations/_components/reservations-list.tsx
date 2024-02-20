"use client";

import { EmptyState } from "~/components/empty-state";
import { List } from "~/components/layout/list";
import { PaginationButton } from "~/components/pagination-button";
import { generateArray, isArrayEmpty, reducePages } from "~/lib/utils";
import {
  ReservationCard,
  ReservationCardSkeleton,
} from "~/reservations/components/reservation-card";
import type { ReservationRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

export const ReservationsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.reservation.getByMyBarbershopInfinite.useInfiniteQuery(
      {},
      {
        getNextPageParam: (previousPage) => previousPage.meta.page.cursor,
      },
    );

  if (isLoading) return <ReservationsListSkeleton />;

  const reservations = data && reducePages(data.pages);

  if (!reservations || isArrayEmpty(reservations.records))
    return <EmptyState />;

  return (
    <List>
      {reservations.records.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation as ReservationRecord}
        />
      ))}
      {reservations.meta.page.more && (
        <PaginationButton
          isLoading={isFetchingNextPage}
          onClick={async () => await fetchNextPage()}
        />
      )}
    </List>
  );
};

export const ReservationsListSkeleton = () => {
  return (
    <List>
      {generateArray(10).map((v) => (
        <ReservationCardSkeleton key={v} />
      ))}
    </List>
  );
};
