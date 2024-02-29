"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { routes } from "~/lib/routes";
import { useRouter } from "~/navigation";
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
  logo: z.instanceof(File),
});

const uploadImage = async (uploadUrl: string, file: File) => {
  await fetch(uploadUrl, { method: "PUT", body: file });
};

export const RegistrationForm = () => {
  const t = useTranslations("global");
  const tRegistration = useTranslations("BarbershopRegistrationPage");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
      logo: new File([], ""),
    },
  });

  const registerBarbershop = api.barbershop.register.useMutation({
    onSuccess: async (response) => {
      setUploading(true);
      await uploadImage(response.logo!.uploadUrl!, form.getValues("logo"));
      setUploading(false);
      toast(tRegistration("registration_success_message"));
      router.push(routes.owner.root);
    },
    onError: () => {
      toast(tRegistration("registration_error_message"));
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    registerBarbershop.mutate({
      ...values,
      logoName: values.logo.name,
      logoFileType: values.logo.type,
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("name_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("email_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("phone_number")}</FormLabel>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("zip")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("zip_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("city")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("city_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("street")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("street_placeholder")}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("house_number")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tRegistration("house_number_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRegistration("logo")}</FormLabel>
                <FormControl>
                  <Input
                    accept=".jpg, .jpeg, .png, .svg"
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
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
          disabled={registerBarbershop.isLoading || uploading}
        >
          {t("continue")}
        </Button>
      </form>
    </Form>
  );
};
