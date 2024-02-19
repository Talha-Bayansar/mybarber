"use client";

import { MoreVertical, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { generateArray, getTimeFromMs, isArrayEmpty } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { List } from "~/components/layout/list";
import type { OpeningHoursRecord } from "~/server/db/xata";
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
import { Card, CardContent } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { OpeningHoursForm } from "./opening-hours-form";

export const EditOpeningHours = () => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.OpeningHoursEditPage");

  const { isLoading, refetch } = api.openingHours.getByMyBarbershop.useQuery();

  const createTimeRange = api.openingHours.create.useMutation({
    onSuccess: async () => {
      await refetch();
      toast(tOwner("create_opening_hours_succes"));
    },
  });

  return (
    <List>
      {generateArray(7).map((item) => (
        <div key={`day-of-week-${item}`} className="flex flex-col gap-2">
          <div className="flex items-center justify-between md:justify-start md:gap-4">
            <h2 className="text-xl font-medium">{t(`day_of_week.${item}`)}</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-auto p-0">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <OpeningHoursForm
                  input={{
                    day_of_week: item,
                  }}
                  onSubmit={createTimeRange.mutate}
                  isLoading={createTimeRange.isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <LoadingState />
          ) : (
            <OpeningHoursDayOfWeek dayOfWeek={item} />
          )}
        </div>
      ))}
    </List>
  );
};

type OpeningHoursDayOfWeekProps = {
  dayOfWeek: number;
};

const OpeningHoursDayOfWeek = ({ dayOfWeek }: OpeningHoursDayOfWeekProps) => {
  const { data } = api.openingHours.getByMyBarbershop.useQuery();

  if (!data) return <Closed />;

  const openingHours = data.filter(
    (item) => item.day_of_week === dayOfWeek && !!item.start_time,
  );

  if (isArrayEmpty(openingHours)) return <Closed />;

  return (
    <List className="md:grid md:grid-cols-2">
      {openingHours
        .sort((a, b) => a.start_time! - b.start_time!)
        .map((oh) => (
          <OpeningHourItem
            key={oh.id}
            openingHours={oh as OpeningHoursRecord}
          />
        ))}
    </List>
  );
};

type ItemProps = {
  openingHours: OpeningHoursRecord;
};

const OpeningHourItem = ({ openingHours }: ItemProps) => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.OpeningHoursEditPage");
  const { refetch } = api.openingHours.getByMyBarbershop.useQuery();
  const updateOpeningHours = api.openingHours.update.useMutation({
    onSuccess: async () => {
      await refetch();
      toast(tOwner("edit_opening_hours_succes"));
    },
  });
  const deleteOpeningHours = api.openingHours.deleteById.useMutation({
    onSuccess: async () => {
      await refetch();
      toast(tOwner("delete_opening_hours_succes"));
    },
  });

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-2">
        <div className="flex-grow">
          {getTimeFromMs(openingHours.start_time!)} -{" "}
          {getTimeFromMs(openingHours.start_time! + openingHours.duration!)}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto rounded-full p-1">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  {t("edit")}
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <OpeningHoursForm
                  input={openingHours}
                  onSubmit={(values) =>
                    updateOpeningHours.mutate({
                      id: openingHours.id,
                      ...values,
                    })
                  }
                  isLoading={updateOpeningHours.isLoading}
                />
              </DialogContent>
            </Dialog>

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
                      deleteOpeningHours.mutate({
                        id: openingHours.id,
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
      </CardContent>
    </Card>
  );
};

const Closed = () => {
  const t = useTranslations("global");

  return <p>{t("closed")}</p>;
};

const LoadingState = () => {
  return <Skeleton className="h-12 w-full" />;
};
