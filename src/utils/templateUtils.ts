export const generateId = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

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
  currentFills: Record<string, string[]>,
  newTags: string[],
): Record<string, string[]> => {
  const syncedFills: Record<string, string[]> = {};
  for (const tag of newTags) {
    syncedFills[tag] = currentFills[tag] ?? [];
  }
  return syncedFills;
};
