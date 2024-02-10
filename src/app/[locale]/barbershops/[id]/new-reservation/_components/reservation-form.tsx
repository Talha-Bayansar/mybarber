"use client";

import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { List } from "~/components/layout/list";
import { InputFieldSkeleton, InputSkeleton } from "~/components/ui/input";
import { generateArray } from "~/lib/utils";
import { TreatmentField } from "./treatment-field";
import { BarberSelection } from "./barber-selection";
import { DateForm } from "./date-form";
import { Skeleton } from "~/components/ui/skeleton";
import { TreatmentSelection } from "./treatment-selection";

type Props = {
  searchParams: {
    barber?: string;
    date?: string;
    time?: string;
    treatment?: string;
  };
};

const formSchema = z.object({
  barberId: z.string(),
  date: z.date(),
  time: z.string().min(1),
  priceListItemId: z.string().min(1),
});

type FormKey = "barberId" | "date" | "time" | "priceListItemId";

export type NewReservationForm = UseFormReturn<
  {
    barberId: string;
    date: Date;
    priceListItemId: string;
    time: string;
  },
  any,
  {
    barberId: string;
    date: Date;
    priceListItemId: string;
    time: string;
  }
>;

export const ReservationForm = ({
  searchParams: { barber, date, time, treatment },
}: Props) => {
  // const t = useTranslations();
  // const router = useRouter();
  // const params = useParams<{ id: string }>();
  // const barbershopId = params.id;
  // const utils = api.useUtils();

  // const createReservation = api.reservation.create.useMutation({
  //   onSuccess: () => {
  //     toast(t("NewReservationPage.success_message"));
  //     utils.reservation.getPaginated.refetch();
  //     router.replace(routes.reservations.root);
  //   },
  // });

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     barberId: "",
  //     date: undefined,
  //     time: "",
  //     priceListItemId: "",
  //   },
  // });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   const { date, time, priceListItemId, barberId } = values;
  //   const startTime = getMsSinceMidnight(getDateFromTime(time));
  //   createReservation.mutate({
  //     barbershopId,
  //     date: format(date, "yyyy-MM-dd"),
  //     startTime,
  //     priceListItemId,
  //     barberId: barberId || undefined,
  //   });
  // }

  if (date && time && barber)
    return <TreatmentSelection date={date} time={time} barberId={barber} />;

  if (date && time) return <BarberSelection date={date} time={time} />;

  return <DateForm />;
};

export const ReservationFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <Skeleton className="flex-grow" />
      <InputSkeleton />
    </List>
  );
};
