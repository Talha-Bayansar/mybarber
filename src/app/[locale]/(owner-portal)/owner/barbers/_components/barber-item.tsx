"use client";

import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { BarberRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

type Props = {
  barber: BarberRecord;
};

export const BarberItem = ({ barber }: Props) => {
  return (
    <Card key={barber.id}>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            className="object-cover"
            src={barber.image?.url}
            alt={`picture of ${barber.first_name} ${barber.last_name}`}
          />
          <AvatarFallback>
            {barber.first_name?.at(0)} {barber.last_name?.at(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow text-xl">
          {barber.first_name} {barber.last_name}
        </div>
        <MoreButton barber={barber} />
      </CardContent>
    </Card>
  );
};

const MoreButton = ({ barber }: Props) => {
  const t = useTranslations("global");
  const tBarbers = useTranslations("Owner.BarbersPage");
  const utils = api.useUtils();
  const deleteBarber = api.barbershop.deleteBarber.useMutation({
    onSuccess: () => {
      toast(tBarbers("delete_barber_success_message"));
      utils.barber.getByMyBarbershop.refetch();
    },
    onError: () => {
      toast(tBarbers("delete_barber_error_message"));
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto rounded-full p-2">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              {t("delete")}
            </DropdownMenuItem>
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
                  deleteBarber.mutate({
                    barberId: barber.id,
                  })
                }
              >
                {t("continue")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
