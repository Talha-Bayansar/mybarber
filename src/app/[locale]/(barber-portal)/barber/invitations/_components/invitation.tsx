"use client";
import { Skeleton } from "~/components/ui/skeleton";
import type { BarbershopBarberInvitationRecord } from "~/server/db/xata";
import { AcceptButton } from "./accept-button";
import { DenyButton } from "./deny-button";

type Props = {
  invitation: BarbershopBarberInvitationRecord;
};

export const Invitation = ({ invitation }: Props) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xl font-medium">{invitation.barbershop?.name}</span>
      <div className="flex items-center gap-4">
        <AcceptButton invitationId={invitation.id} />
        <DenyButton invitationId={invitation.id} />
      </div>
    </div>
  );
};

export const InvitationSkeleton = () => {
  return <Skeleton className="h-8 w-full" />;
};
