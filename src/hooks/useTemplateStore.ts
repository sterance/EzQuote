import { useState, useEffect } from "react";
import type { ButtonGroup } from "../types";
import { extractTags, syncGroupFills, syncFillIds, generateId } from "../utils/templateUtils";

const STORAGE_KEY = "template_data";

const normalizeGroup = (group: Partial<ButtonGroup>): ButtonGroup => {
  const id = group.id ?? generateId();
  const fills = group.fills ?? {};
  const tags = extractTags(group.template ?? "");

  return {
    id,
    label: group.label ?? "",
    template: group.template ?? "",
    fills: syncGroupFills(fills, tags),
    fillIds: syncFillIds(group.fillIds, fills, tags, generateId),
  };
};

export const useTemplateStore = () => {
  const [groups, setGroups] = useState<ButtonGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeGroup) : [];
      } catch {
        console.error("Failed to parse local storage data.");
      }
    }
    return [];
  });

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newGroupPending, setNewGroupPending] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const updateGroup = (groupId: string, newLabel: string, newTemplate: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;

        const newTags = extractTags(newTemplate);
        const updatedFills = syncGroupFills(group.fills || {}, newTags);

        return {
          ...group,
          label: newLabel,
          template: newTemplate,
          fills: updatedFills,
          fillIds: syncFillIds(group.fillIds, updatedFills, newTags, generateId),
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
      id: generateId(),
      label: "",
      template: "",
      fills: {},
      fillIds: {},
    };
    setGroups((prev) => [...prev, newGroup]);
    setNewGroupPending(true);
    setEditingGroupId(newGroup.id);
  };

  const confirmNewGroup = () => {
    setNewGroupPending(false);
  };

  const cancelNewGroup = () => {
    setNewGroupPending(false);
    setGroups((prev) => prev.filter((g) => g.id !== editingGroupId));
    setEditingGroupId(null);
  };

  const updateGroupFills = (groupId: string, fills: Record<string, string[]>, fillIds?: Record<string, string[]>) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              fills,
              fillIds: fillIds ?? syncFillIds(group.fillIds, fills, extractTags(group.template), generateId),
            }
          : group,
      ),
    );
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed) && parsed.every((g) => typeof g.label === "string" && g.label.length > 0 && typeof g.template === "string")) {
        setGroups(parsed.map((g) => normalizeGroup({ ...g, id: generateId() })));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGroups([]);
  };

  return {
    groups,
    updateGroup,
    deleteGroup,
    addGroup,
    confirmNewGroup,
    cancelNewGroup,
    updateGroupFills,
    importData,
    reorderGroups,
    clearAll,
    editingGroupId,
    setEditingGroupId,
    clearEditingGroupId: () => setEditingGroupId(null),
    newGroupPending,
  };
};
