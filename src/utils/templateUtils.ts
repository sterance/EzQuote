import { nanoid } from "nanoid";
import type { ButtonGroup } from "../types";

export const generateId = (): string => nanoid();

export const extractTags = (template: string): string[] => {
  const regex = /\{([^}]+)\}/g;
  const tags: string[] = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (!tags.includes(match[1])) {
      tags.push(match[1]);
    }
  }

  return tags;
};

export const syncGroupFills = (
  currentFills: Record<string, Array<{ id: string; text: string; starred: boolean }>>,
  newTags: string[],
): Record<string, Array<{ id: string; text: string; starred: boolean }>> => {
  const syncedFills: Record<string, Array<{ id: string; text: string; starred: boolean }>> = {};
  for (const tag of newTags) {
    syncedFills[tag] = currentFills[tag] ?? [];
  }
  return syncedFills;
};

export const normalizeGroup = (group: Partial<ButtonGroup>): ButtonGroup => {
  const id = group.id ?? generateId();
  const tags = extractTags(group.template ?? "");
  const rawFills = group.fills ?? {};
  const fills: ButtonGroup["fills"] = {};
  for (const tag of tags) {
    const rawList = rawFills[tag];
    if (Array.isArray(rawList)) {
      fills[tag] = rawList.map((fill: unknown) => {
        if (typeof fill === "string") {
          return { id: generateId(), text: fill, starred: false };
        }
        const fillObject = fill as Partial<{ id: string; text: string; starred: boolean }>;
        return {
          id: fillObject.id ?? generateId(),
          text: fillObject.text ?? "",
          starred: Boolean(fillObject.starred),
        };
      });
    } else {
      fills[tag] = [];
    }
  }
  return {
    id,
    label: group.label ?? "",
    template: group.template ?? "",
    fills,
  };
};

export const serializeGroup = (group: ButtonGroup): { label: string; template: string; fills?: Record<string, string[]> } => {
  const fills: Record<string, string[]> = {};
  for (const tag of Object.keys(group.fills)) {
    const values = group.fills[tag].map((f) => f.text);
    if (values.length > 0) {
      fills[tag] = values;
    }
  }
  const result: { label: string; template: string; fills?: Record<string, string[]> } = {
    label: group.label,
    template: group.template,
  };
  if (Object.keys(fills).length > 0) {
    result.fills = fills;
  }
  return result;
};