import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { ButtonGroup } from "../types";
import sampleTemplates from "../data/sample-templates.json";
import { extractTags, syncGroupFills, generateId, normalizeGroup, serializeGroup } from "../utils/templateUtils";

const STORAGE_KEY = "template_data";
const DEMO_STORAGE_KEY = "template_data_demo";

export const getInitialDemoTemplates = (): ButtonGroup[] => sampleTemplates.map((template) => normalizeGroup(template as Partial<ButtonGroup>));

export const useTemplateStore = () => {
  const location = useLocation();
  const storageKey = location.pathname.startsWith("/demo") ? DEMO_STORAGE_KEY : STORAGE_KEY;
  const [groups, setGroups] = useState<ButtonGroup[]>(() => {
    if (storageKey === DEMO_STORAGE_KEY && localStorage.getItem(DEMO_STORAGE_KEY) === null) {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(getInitialDemoTemplates()));
    }

    const saved = localStorage.getItem(storageKey);
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
    localStorage.setItem(storageKey, JSON.stringify(groups));
  }, [groups, storageKey]);

  const updateGroup = (groupId: string, newLabel: string, newTemplate: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const newTags = extractTags(newTemplate);
        const updatedFills = syncGroupFills(group.fills ?? {}, newTags);
        const fills: ButtonGroup["fills"] = {};
        for (const tag of newTags) {
          fills[tag] = (updatedFills[tag] ?? []).map((f) => ({
            id: f.id ?? generateId(),
            text: f.text ?? "",
            starred: Boolean(f.starred),
          }));
        }
        return {
          ...group,
          label: newLabel,
          template: newTemplate,
          fills,
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

  const updateGroupFills = (groupId: string, fills: ButtonGroup["fills"]) => {
    setGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, fills } : group)));
  };

  const toggleStarredValue = (groupId: string, tag: string, fillId: string) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const fills = { ...group.fills };
        fills[tag] = (fills[tag] ?? []).map((f) => (f.id === fillId ? { ...f, starred: !f.starred } : f));
        return { ...group, fills };
      }),
    );
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData) as Array<Partial<ButtonGroup>>;
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
    localStorage.removeItem(storageKey);
    setGroups([]);
  };

  const exportData = () => {
    return groups.map(serializeGroup);
  };

  return {
    groups,
    updateGroup,
    deleteGroup,
    addGroup,
    confirmNewGroup,
    cancelNewGroup,
    updateGroupFills,
    toggleStarredValue,
    importData,
    exportData,
    reorderGroups,
    clearAll,
    editingGroupId,
    setEditingGroupId,
    clearEditingGroupId: () => setEditingGroupId(null),
    newGroupPending,
  };
};
