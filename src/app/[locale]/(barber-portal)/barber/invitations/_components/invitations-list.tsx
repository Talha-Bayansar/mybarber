"use client";
import { List } from "~/components/layout/list";
import { generateArray, isArrayEmpty, reducePages } from "~/lib/utils";
import { Invitation, InvitationSkeleton } from "./invitation";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { EmptyState } from "~/components/empty-state";
import type { BarbershopBarberInvitationRecord } from "~/server/db/xata";
import { PaginationButton } from "~/components/pagination-button";

export const InvitationsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.barbershopBarberInvitation.getByMyBarber.useInfiniteQuery(
      {},
      {
        getNextPageParam: (previousPage) => previousPage.meta.page.cursor,
      },
    );

  if (isLoading) return <InvitationsListSkeleton />;

  const invitations = data && reducePages(data.pages);

  if (!invitations || isArrayEmpty(invitations.records)) return <EmptyState />;

  return (
    <List>
      <List className="gap-0">
        {invitations.records.map((invitation, i) => (
          <>
            <Invitation
              key={invitation.id}
              invitation={invitation as BarbershopBarberInvitationRecord}
            />
            {i < invitations.records.length - 1 && <Separator />}
          </>
        ))}
      </List>
      {invitations.meta.page.more && (
        <PaginationButton
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      )}
    </List>
  );
};

export const InvitationsListSkeleton = () => {
  return (
    <List className="gap-0">
      {generateArray(10).map((v) => (
        <>
          <InvitationSkeleton key={v} />
          {v < generateArray(10).length - 1 && <Separator />}
        </>
      ))}
    </List>
  );
};
