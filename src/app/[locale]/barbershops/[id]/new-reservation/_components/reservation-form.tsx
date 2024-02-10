"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { InputFieldSkeleton, InputSkeleton } from "~/components/ui/input";
import { routes } from "~/lib/routes";
import {
  generateArray,
  getDateFromTime,
  getMsSinceMidnight,
} from "~/lib/utils";
import { useRouter } from "~/navigation";
import { api } from "~/trpc/react";
import { DateField } from "./date-field";
import { TimeField } from "./time-field";
import { TreatmentField } from "./treatment-field";
import { BarberSelection } from "./barber-selection";
import { useMemo, useState } from "react";

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

const getFormField = (currentStep: number, form: NewReservationForm) => {
  switch (currentStep) {
    case 0:
      return <BarberSelection form={form} />;
    case 1:
      return (
        <List className="gap-8">
          <DateField form={form} />
          <TreatmentField form={form} />
          <TimeField form={form} />
        </List>
      );
    default:
      return null;
  }
};

export const ReservationForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const barbershopId = params.id;
  const utils = api.useUtils();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const validationKeys: FormKey[][] = [
    ["barberId"],
    ["date", "time", "priceListItemId"],
  ];

  const hasPreviousStep = useMemo(() => {
    return currentStep > 0;
  }, [currentStep]);

  const isLastStep = useMemo(() => {
    return currentStep >= validationKeys.length - 1;
  }, [currentStep]);

  const createReservation = api.reservation.create.useMutation({
    onSuccess: async () => {
      toast(t("NewReservationPage.success_message"));
      utils.reservation.getPaginated.refetch();
      router.replace(routes.reservations.root);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barberId: "",
      date: undefined,
      time: "",
      priceListItemId: "",
    },
    // shouldUnregister: true,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, priceListItemId, barberId } = values;
    console.log(values);
    const startTime = getMsSinceMidnight(getDateFromTime(time));
    createReservation.mutate({
      barbershopId,
      date: format(date, "yyyy-MM-dd"),
      startTime,
      priceListItemId,
      barberId: barberId || undefined,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        {getFormField(currentStep, form)}

        <div className="flex justify-between">
          <Button
            disabled={!hasPreviousStep}
            onClick={() => setCurrentStep((v) => v - 1)}
          >
            {t("global.previous")}
          </Button>

          {isLastStep ? (
            <Button type="submit" disabled={createReservation.isLoading}>
              {t("global.submit")}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={async () => {
                const isValid = await form.trigger([
                  ...validationKeys[currentStep]!,
                ]);

                if (isValid) {
                  setCurrentStep((v) => v + 1);
                }
              }}
            >
              {t("global.next")}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export const ReservationFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <List className="gap-8">
        {generateArray(3).map((v) => (
          <InputFieldSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
