import { useState, useEffect } from "react";
import type { ButtonGroup, TagFill } from "../types";
import {
  extractTags,
  syncGroupFills,
  generateId,
} from "../utils/templateUtils";
import { buttonGroups as defaultButtonGroups } from "../data/buttonGroups";

const STORAGE_KEY = "template_data";

export const useTemplateStore = () => {
  const [groups, setGroups] = useState<ButtonGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error("Failed to parse local storage data.");
      }
    }
    return defaultButtonGroups;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const updateGroup = (
    groupId: string,
    newLabel: string,
    newTemplate: string,
  ) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;

        const newTags = extractTags(newTemplate);
        const updatedFills = syncGroupFills(group.fills || {}, newTags);

        return {
          ...group,
          id: generateId(newLabel),
          label: newLabel,
          template: newTemplate,
          fills: updatedFills,
        };
      }),
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const reorderGroups = (startIndex: number, endIndex: number) => {
    setGroups((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const addGroup = () => {
    const newGroup: ButtonGroup = {
      id: generateId("New Group"),
      label: "New Group",
      template: "",
      fills: {},
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const updateGroupFills = (
    groupId: string,
    fills: Record<string, TagFill[]>,
  ) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, fills } : group,
      ),
    );
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (
        Array.isArray(parsed) &&
        parsed.every((g) => g.id && g.label && typeof g.template === "string")
      ) {
        setGroups(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGroups(defaultButtonGroups);
  };

  return {
    groups,
    updateGroup,
    deleteGroup,
    addGroup,
    updateGroupFills,
    importData,
    reorderGroups,
    clearAll,
  };
};
