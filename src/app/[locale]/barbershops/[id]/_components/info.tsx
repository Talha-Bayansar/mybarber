import { LucideIcon, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { List, Section } from "~/components";
import { Link } from "~/navigation";
import { BarbershopRecord } from "~/server/db";
import { OpeningHours } from ".";

type Props = {
  barbershop: BarbershopRecord;
};

type ContactLine = {
  href: string;
  Icon: LucideIcon;
  value: string;
};

export const Info = async ({ barbershop }: Props) => {
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
    <List className="mt-8 gap-8">
      <OpeningHours barbershopId={barbershop.id} />
      <Section title={t("contact")}>
        <List>
          {contactLines.map((contactLine) => (
            <div key={contactLine.value} className="flex items-center gap-4">
              <contactLine.Icon />
              <Link className="underline" href={contactLine.href}>
                {contactLine.value}
              </Link>
            </div>
          ))}
        </List>
      </Section>
      {address && (
        <Section title={t("location")}>
          <iframe
            src={`https://maps.google.com/maps?&q="+${encodeURIComponent(`${address.street} ${address.house_number} ${address.city} ${address.zip}`)}"&output=embed`}
            width="600"
            height="450"
            className="h-60 w-full md:h-80"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Section>
      )}
    </List>
  );
};
