"use client";

import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {
  trigger: JSX.Element;
  content: JSX.Element;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ModalSheet = ({ content, trigger, open, onOpenChange }: Props) => {
  const isBigScreen = useMediaQuery("(min-width: 768px)");

  if (isBigScreen)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>{content}</DrawerContent>
    </Drawer>
  );
};
