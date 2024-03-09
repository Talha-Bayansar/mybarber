import { LucideIcon } from "lucide-react";
import { List } from "./layout/list";

type Props = {
  Icon: LucideIcon;
  text: string;
  action?: React.ReactNode;
};

export const Placeholder = ({ Icon, text, action }: Props) => {
  return (
    <div className="grid w-full flex-grow place-items-center">
      <List className="items-center">
        <Icon size={100} className="text-primary" />
        <p className="text-lg font-medium">{text}</p>
        {action}
      </List>
    </div>
  );
};
