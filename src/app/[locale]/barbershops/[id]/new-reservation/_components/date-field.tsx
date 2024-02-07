import { api } from "~/trpc/react";
import { type NewReservationForm } from "./reservation-form";
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
import { cn } from "~/lib/utils";
import { type Locale, format, startOfToday } from "date-fns";
import { useParams } from "next/navigation";

const locales: Record<string, Locale> = {
  en: enUS,
  nl: nl,
  fr: fr,
};

type Props = {
  form: NewReservationForm;
};

export const DateField = ({ form }: Props) => {
  const t = useTranslations();
  const utils = api.useUtils();
  const { locale } = useParams<{ locale: string }>();

  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("global.date")}</FormLabel>
          <Popover>
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
                  utils.reservation.getAllBetweenDates.refetch();
                  field.onChange(e);
                }}
                disabled={(date) => date < startOfToday()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
