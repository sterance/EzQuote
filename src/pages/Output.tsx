import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import Buttons from "../components/Buttons";
import Textbox from "../components/Textbox";
import { buttonGroups } from "../data/buttonGroups";

function fillTemplate(template: string, fills: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => fills[key] ?? `{${key}}`,
  );
}

export default function Output() {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [enabledGroups, setEnabledGroups] = useState<Record<string, boolean>>(
    {},
  );

  const handleSelect = (groupId: string, optionId: string) => {
    setSelections((current) => ({ ...current, [groupId]: optionId }));
  };

  const handleToggleGroup = (groupId: string, enabled: boolean) => {
    setEnabledGroups((current) => ({ ...current, [groupId]: enabled }));
  };

  const output = useMemo(() => {
    return buttonGroups
      .map((group) => {
        if (!enabledGroups[group.id]) return null;
        const selectedOptionId = selections[group.id];
        const option = group.options.find((o) => o.id === selectedOptionId);
        return option ? fillTemplate(group.template, option.fills) : null;
      })
      .filter((line): line is string => Boolean(line))
      .join("\n\n");
  }, [selections, enabledGroups]);

  return (
    <>
      <Box className="button-sections">
        {buttonGroups.map((group) => (
          <Buttons
            key={group.id}
            label={group.label}
            options={group.options.map(({ id, label }) => ({ id, label }))}
            selectedId={selections[group.id]}
            onSelect={(optionId) => handleSelect(group.id, optionId)}
            enabled={Boolean(enabledGroups[group.id])}
            onToggleEnabled={(enabled) => handleToggleGroup(group.id, enabled)}
          />
        ))}
      </Box>

      <Textbox label="Output" placeholder="" value={output} />
    </>
  );
}
