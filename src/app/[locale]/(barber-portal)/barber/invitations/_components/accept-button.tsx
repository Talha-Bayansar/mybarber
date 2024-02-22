import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type Props = {
  invitationId: string;
};

export const AcceptButton = ({ invitationId }: Props) => {
  const t = useTranslations("global");
  const tInvitationsPage = useTranslations("Barber.InvitationsPage");
  const utils = api.useUtils();
  const acceptInvitation =
    api.barbershopBarberInvitation.acceptBarbershopInvitation.useMutation({
      onSuccess: () => {
        utils.barbershopBarberInvitation.getByMyBarber.refetch();
      },
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="h-auto rounded-full p-1">
          <Check />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {tInvitationsPage("accept_confirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              acceptInvitation.mutate({
                id: invitationId,
              })
            }
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
