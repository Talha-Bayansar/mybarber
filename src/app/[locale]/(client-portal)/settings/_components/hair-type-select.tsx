"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { HairTypeRecord, UserPreferencesRecord } from "~/server/db/xata";
import { api } from "~/trpc/react";

type Props = {
  preferences: UserPreferencesRecord;
  hairTypes: HairTypeRecord[];
};

export const HairTypeSelect = ({ preferences, hairTypes }: Props) => {
  const t = useTranslations();
  const [selectedHairType, setSelectedHairType] = useState(
    preferences.hair_type?.id ?? "",
  );
  const updatePreferences = api.userPreferences.update.useMutation();

  const handleChange = (value: string) => {
    setSelectedHairType(value);
    updatePreferences.mutate({
      hairTypeId: value,
    });
  };

  return (
    <Select onValueChange={handleChange} value={selectedHairType}>
      <SelectTrigger className="md:w-min">
        <SelectValue placeholder={t("global.none")} />
      </SelectTrigger>
      <SelectContent>
        {hairTypes.map((type) => (
          <SelectItem value={type.id}>
            {t(`global.${type.name?.toLocaleLowerCase()}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
