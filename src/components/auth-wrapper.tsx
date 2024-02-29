"use client";

import { ShieldX } from "lucide-react";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Header } from "./layout/header";
import { Main } from "./layout/main";
import { Authenticating } from "./authenticating";
import { SignInButton } from "./sign-in-button";

type Props = {
  children?: ReactNode;
};

export const AuthWrapper = ({ children }: Props) => {
  const session = useSession();
  const t = useTranslations();
  switch (session.status) {
    case "loading":
      return <Authenticating />;
    case "authenticated":
      return children;
    case "unauthenticated":
      return (
        <div className="md:gap-20">
          <Header />
          <Main className="flex-grow justify-center gap-8 md:justify-start">
            <div className="flex flex-col items-center gap-4">
              <ShieldX size={100} className="text-primary" />
              <p className="text-center">
                {t("restaurants.register_auth_required")}
              </p>
            </div>
            <SignInButton />
          </Main>
        </div>
      );
  }
};
