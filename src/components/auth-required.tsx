"use client";

import { useTranslations } from "next-intl";
import { SignInButton } from "./sign-in-button";
import { List } from "./layout/list";

export const AuthRequired = () => {
  const t = useTranslations("global");

  return (
    <div className="grid w-full flex-grow place-items-center">
      <List>
        <p className="text-xl font-medium">{t("auth_required")}</p>
        <SignInButton />
      </List>
    </div>
  );
};
