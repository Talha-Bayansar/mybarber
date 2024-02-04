/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import {
  NavigationBar,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components";
import { cn, routes } from "~/lib";
import { Link } from "~/navigation";

export const RootNavBar = () => {
  const pathName = usePathname();
  const params = useParams<{ locale: string }>();
    const t = useTranslations("global");
  const locale = params.locale;
  const currentPath =
    pathName.split(`/${locale}`)[pathName.split(`/${locale}`).length - 1] ||
    "/";

  const links = [
    {
      Icon: Search,
      href: routes.root,
      tooltip: t("search"),
    },
    {
      Icon: Settings,
      href: routes.settings.root,
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
                  "bg-primary/20 rounded-full": currentPath === link.href,
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
