"use client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { SettingCard } from "~/components/setting-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { routes } from "~/lib/routes";
import { locales, useRouter } from "~/navigation";

export const LanguageSetting = () => {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("SettingsPage");
  const router = useRouter();
  const changeLocale = (locale: string) => {
    router.replace(routes.settings.root, { locale });
  };

  return (
    <SettingCard
      title={t("language")}
      description={t("language_description")}
      trailing={
        <Select value={locale} onValueChange={changeLocale}>
          <SelectTrigger className="uppercase md:w-min">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {locales.map((locale) => (
              <SelectItem
                disabled={locale !== "en"}
                className="uppercase"
                key={locale}
                value={locale}
              >
                {locale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
};
