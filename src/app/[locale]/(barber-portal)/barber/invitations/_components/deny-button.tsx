import { X } from "lucide-react";
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

export const DenyButton = ({ invitationId }: Props) => {
  const t = useTranslations("global");
  const utils = api.useUtils();
  const denyInvitation =
    api.barbershopBarberInvitation.denyBarbershopInvitation.useMutation({
      onSuccess: () => {
        utils.barbershopBarberInvitation.getByMyBarber.refetch();
      },
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-auto rounded-full p-1">
          <X />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("action_cannot_be_undone")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              denyInvitation.mutate({
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
