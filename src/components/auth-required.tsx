"use client";

import { useTranslations } from "next-intl";
import { SignInButton } from "./sign-in-button";
import { List } from "./layout/list";
import { ShieldX } from "lucide-react";

export const AuthRequired = () => {
  const t = useTranslations("global");

  return (
    <div className="grid w-full flex-grow place-items-center">
      <List className="items-center">
        <ShieldX size={100} className="text-primary" />
        <p className="text-xl font-medium">{t("auth_required")}</p>
        <SignInButton />
      </List>
    </div>
  );
};
