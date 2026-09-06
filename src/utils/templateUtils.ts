import { nanoid } from "nanoid";

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

export const syncGroupFills = (currentFills: Record<string, string[]>, newTags: string[]): Record<string, string[]> => {
  const syncedFills: Record<string, string[]> = {};
  for (const tag of newTags) {
    syncedFills[tag] = currentFills[tag] ?? [];
  }
  return syncedFills;
};

export const syncFillIds = (currentFillIds: Record<string, string[]> | undefined, fills: Record<string, string[]>, tags: string[], createId: () => string): Record<string, string[]> => {
  const syncedFillIds: Record<string, string[]> = {};

  for (const tag of tags) {
    const existingIds = currentFillIds?.[tag] ?? [];
    const values = fills[tag] ?? [];
    syncedFillIds[tag] = values.map((_, index) => existingIds[index] ?? createId());
  }

  return syncedFillIds;
};
