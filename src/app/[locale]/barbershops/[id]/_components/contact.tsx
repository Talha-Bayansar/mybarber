import { LucideIcon, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { List } from "~/components";
import { Link } from "~/navigation";
import { BarbershopRecord } from "~/server/db";

type Props = {
  barbershop: BarbershopRecord;
};

type ContactLine = {
  href: string;
  Icon: LucideIcon;
  value: string;
};

export const Contact = async ({ barbershop }: Props) => {
  const t = await getTranslations("global");
  const { address } = barbershop;
  const contactLines: ContactLine[] = [
    {
      href: `tel:${barbershop.phone_number}`,
      Icon: Phone,
      value: barbershop.phone_number ?? t("not_specified"),
    },
    {
      href: `mailto:${barbershop.email}`,
      Icon: Mail,
      value: barbershop.email ?? t("not_specified"),
    },
  ];

  return (
    <List className="mt-4">
      {contactLines.map((contactLine) => (
        <div key={contactLine.value} className="flex gap-4">
          <contactLine.Icon />
          <Link className="underline" href={contactLine.href}>
            {contactLine.value}
          </Link>
        </div>
      ))}
      {address && (
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.54745786756!2d4.187578376566183!3d51.06144334318395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c393aa9f57e4eb%3A0xcab006804b64ec87!2s${address.street}%20${address.house_number}%2C%20${address.zip}%20${address.city}!5e0!3m2!1snl!2sbe!4v1707093057876!5m2!1snl!2sbe`}
          width="600"
          height="450"
          className="h-60 w-full md:h-80"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </List>
  );
};
