import { Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type { BarbershopBarberInvitationRecord } from "~/server/db/xata";

type Props = {
  invitation: BarbershopBarberInvitationRecord;
};

export const Invitation = ({ invitation }: Props) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xl font-medium">{invitation.barbershop?.name}</span>
      <div className="flex items-center gap-4">
        <Button className="h-auto rounded-full p-1">
          <Check />
        </Button>
        <Button variant="destructive" className="h-auto rounded-full p-1">
          <X />
        </Button>
      </div>
    </div>
  );
};

export const InvitationSkeleton = () => {
  return <Skeleton className="h-12 w-full" />;
};
