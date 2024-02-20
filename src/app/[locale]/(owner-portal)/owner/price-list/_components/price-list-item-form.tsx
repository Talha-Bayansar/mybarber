"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PriceListItemRecord } from "~/server/db/xata";

type Update = PriceListItemRecord;

type Props = {
  input?: Update;
  isLoading: boolean;
  onSubmit: (values: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) => void;
};

export const PriceListItemForm = ({ input, isLoading, onSubmit }: Props) => {
  const t = useTranslations("global");
  const tOwner = useTranslations("Owner.PriceListPage");
  const durationOptions = [15, 30, 45, 60, 75, 90];

  const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    duration: z
      .string()
      .min(1)
      .refine((v) => durationOptions.includes(Number(v))),
    price: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: input?.name ?? "",
      description: input?.description ?? "",
      duration: input?.duration?.toString() ?? "",
      price: input?.price?.toString() ?? "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      name: values.name,
      description: values.description,
      duration: Number(values.duration),
      price: Number(values.price),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tOwner("name_placeholder")}
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("description")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tOwner("description_placeholder")}
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("duration")}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={tOwner("duration_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOwner("price")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tOwner("price_placeholder")}
                  type="number"
                  inputMode="decimal"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {input ? t("edit") : t("create")}
        </Button>
      </form>
    </Form>
  );
};
