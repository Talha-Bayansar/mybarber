/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { routes } from "~/lib/routes";
import { Link } from "~/navigation";
import { NavigationBar } from "~/components/layout/navigation-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { IconButton } from "~/components/icon-button";

export const OwnerNavBar = () => {
  const pathName = usePathname();
  const params = useParams<{ locale: string }>();
  const t = useTranslations("global");
  const locale = params.locale;
  const currentPath =
    pathName.split(`/${locale}`)[pathName.split(`/${locale}`).length - 1] ||
    "/";

  const links = [
    {
      Icon: LayoutDashboard,
      href: routes.owner.root,
      tooltip: t("dashboard"),
    },
    {
      Icon: Settings,
      href: routes.owner.settings.root,
      tooltip: t("settings"),
    },
  ];

  return (
    <NavigationBar>
      {links.map((link) => (
        <TooltipProvider key={link.tooltip}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn({
                  "rounded-full bg-primary/20": currentPath === link.href,
                })}
              >
                <IconButton>
                  <link.Icon />
                </IconButton>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </NavigationBar>
  );
};
