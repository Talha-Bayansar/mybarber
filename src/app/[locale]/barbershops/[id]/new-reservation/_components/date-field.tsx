import { api } from "~/trpc/react";
import { useTranslations } from "next-intl";
import { enUS } from "date-fns/locale/en-US";
import { nl } from "date-fns/locale/nl";
import { fr } from "date-fns/locale/fr";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { cn, getDayOfWeek } from "~/lib/utils";
import { type Locale, format, startOfToday } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { InputFieldSkeleton } from "~/components/ui/input";
import { type DateForm } from "./date-form";

const locales: Record<string, Locale> = {
  en: enUS,
  nl: nl,
  fr: fr,
};

type Props = {
  form: DateForm;
};

export const DateField = ({ form }: Props) => {
  const t = useTranslations();
  const utils = api.useUtils();
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const { data, isLoading } = api.openingHours.getAllByBarbershopId.useQuery({
    barbershopId: id,
  });

  if (isLoading) return <InputFieldSkeleton />;

  const isClosed = (date: Date) => {
    const dayOfWeek = getDayOfWeek(date);
    const hasOpeningHours = data?.find(
      (openingHours) => openingHours.day_of_week === dayOfWeek,
    );
    return !hasOpeningHours;
  };

  return (
    <FormField
      shouldUnregister
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("global.date")}</FormLabel>
          <Popover onOpenChange={setIsPickerOpen} open={isPickerOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd-MM-yyyy")
                  ) : (
                    <span>{t("NewReservationPage.select_date")}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={locales[locale]}
                weekStartsOn={1}
                selected={field.value}
                onSelect={(e) => {
                  if (e) {
                    if (e) {
                      utils.barbershop.getAvailableIntervals.refetch();
                    }
                    field.onChange(e);
                  }
                  setIsPickerOpen(false);
                }}
                disabled={(date) => date < startOfToday() || isClosed(date)}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
