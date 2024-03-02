"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { List } from "~/components/layout/list";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Input,
  InputFieldSkeleton,
  InputSkeleton,
} from "~/components/ui/input";
import { routes } from "~/lib/routes";
import { generateArray } from "~/lib/utils";
import { useRouter } from "~/navigation";
import type { BarbershopRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const formSchema = z.object({
  name: z.string().min(1).max(30),
  email: z.string().email(),
  phoneNumber: z.string().regex(phoneRegex),
  city: z.string().min(1).max(30),
  street: z.string().min(1).max(100),
  houseNumber: z.string().min(1).max(10),
  zip: z.string().min(1).max(10),
});

type Props = {
  barbershopData: BarbershopRecord;
};

export const BarbershopForm = ({ barbershopData }: Props) => {
  const t = useTranslations("global");
  const params = useSearchParams();
  const editable = params.get("editable") ? true : false;
  const router = useRouter();
  const tBarbershop = useTranslations("Owner.BarbershopDetailsPage");
  const { data: barbershop, refetch } = api.barbershop.getByOwner.useQuery(
    undefined,
    {
      initialData: barbershopData as any,
    },
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: barbershop.name ?? "",
      email: barbershop.email ?? "",
      phoneNumber: barbershop.phone_number ?? "",
      city: barbershop.address?.city ?? "",
      street: barbershop.address?.street ?? "",
      houseNumber: barbershop.address?.house_number ?? "",
      zip: barbershop.address?.zip ?? "",
    },
  });

  const updateBarbershop = api.barbershop.updateMyBarbershop.useMutation({
    onSuccess: async () => {
      await refetch();
      toast(tBarbershop("update_success_message"));
      router.push(routes.owner.barbershopDetails.root);
    },
    onError: () => {
      toast(tBarbershop("update_error_message"));
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    updateBarbershop.mutate({
      ...values,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-grow flex-col justify-between gap-8 md:justify-start"
      >
        <div className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="name"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("name_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("email_placeholder")}
                    type="email"
                    inputMode="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("phone_number")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+32 XXX XX XX XX"
                    type="tel"
                    inputMode="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zip"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("zip")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("zip_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("city")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("city_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("street")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("street_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="houseNumber"
            disabled={!editable}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tBarbershop("house_number")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tBarbershop("house_number_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={updateBarbershop.isLoading || !editable}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};

export const BarbershopFormSkeleton = () => {
  return (
    <List className="flex-grow justify-between gap-8 md:justify-start">
      <List className="gap-8">
        {generateArray(7).map((v) => (
          <InputFieldSkeleton key={v} />
        ))}
      </List>
      <InputSkeleton />
    </List>
  );
};
