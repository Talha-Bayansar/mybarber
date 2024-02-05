import { Mail, Phone } from "lucide-react";
import { List } from "~/components";
import { Link } from "~/navigation";
import { BarbershopRecord } from "~/server/db";

type Props = {
  barbershop: BarbershopRecord;
};

export const Contact = ({ barbershop }: Props) => {
  return (
    <List className="mt-4">
      <div className="flex gap-4">
        <Phone />
        <Link className="underline" href={`tel:${barbershop.phone_number}`}>
          {barbershop.phone_number}
        </Link>
      </div>
      <div className="flex gap-4">
        <Mail />
        <Link className="underline" href={`mailto:${barbershop.email}`}>
          {barbershop.email}
        </Link>
      </div>
    </List>
  );
};
