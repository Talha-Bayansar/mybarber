"use client";

import { generateArray, isArrayEmpty, reducePages } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { ReservationRecord } from "~/server/db/xata";
import { PaginationButton } from "~/components/pagination-button";
import { EmptyState } from "~/components/empty-state";
import { ReservationItem, ReservationItemSkeleton } from "./reservation-item";
import { List } from "~/components/layout/list";

export const ReservationsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.reservation.getPaginated.useInfiniteQuery(
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
        <ReservationItem
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
      {generateArray(6).map((v) => (
        <ReservationItemSkeleton key={v} />
      ))}
    </List>
  );
};
