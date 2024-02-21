"use client";

import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {
  trigger: JSX.Element;
  content: JSX.Element;
};

export const ModalSheet = ({ content, trigger }: Props) => {
  const isBigScreen = useMediaQuery("(min-width: 768px)");

  if (isBigScreen)
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    );

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="h-full w-full overflow-y-scroll p-8">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};
