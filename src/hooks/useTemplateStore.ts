import { useState, useEffect } from "react";
import type { ButtonGroup, ChildOption } from "../types";
import {
  extractTags,
  syncChildFills,
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
    return defaultButtonGroups.map((group) => ({
      id: group.id,
      label: group.label,
      template: group.template,
      options: group.options as ChildOption[],
    }));
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
        const updatedOptions = group.options.map((btn) => ({
          ...btn,
          fills: syncChildFills(btn.fills || {}, newTags),
        }));

        return {
          ...group,
          id: generateId(newLabel),
          label: newLabel,
          template: newTemplate,
          options: updatedOptions,
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
      options: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const updateChild = (
    groupId: string,
    childId: string,
    newLabel: string,
    newFills: Record<string, string>,
  ) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          options: group.options.map((btn) =>
            btn.id === childId
              ? {
                  ...btn,
                  id: generateId(newLabel),
                  label: newLabel,
                  fills: newFills,
                }
              : btn,
          ),
        };
      }),
    );
  };

  const deleteChild = (groupId: string, childId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          options: group.options.filter((b) => b.id !== childId),
        };
      }),
    );
  };

  const addChild = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const tags = extractTags(group.template);
        const newChild: ChildOption = {
          id: generateId("New Option"),
          label: "New Option",
          fills: syncChildFills({}, tags),
        };
        return { ...group, options: [...group.options, newChild] };
      }),
    );
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (
        Array.isArray(parsed) &&
        parsed.every((g) => g.id && g.label && typeof g.template === "string")
      ) {
        const transformed = parsed.map((group) => ({
          ...group,
          options: group.options || [],
        }));
        setGroups(transformed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGroups(
      defaultButtonGroups.map((group) => ({
        id: group.id,
        label: group.label,
        template: group.template,
        options: group.options as ChildOption[],
      })),
    );
  };

  return {
    groups,
    updateGroup,
    deleteGroup,
    addGroup,
    updateChild,
    deleteChild,
    addChild,
    importData,
    reorderGroups,
    clearAll,
  };
};
