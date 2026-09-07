import React, { useState, useRef } from "react";
import { Box, Button, Stack } from "@mui/material";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useTemplateStore } from "../hooks/useTemplateStore";
import { GroupEditor } from "../components/GroupEditor";
import { ConfirmationModal } from "../components/ConfirmationModal";

export const Templates: React.FC = () => {
  const { groups, updateGroup, deleteGroup, addGroup, confirmNewGroup, cancelNewGroup, updateGroupFills, importData, reorderGroups, clearAll, editingGroupId, clearEditingGroupId, newGroupPending } = useTemplateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "fill" && overData?.type === "fill") {
      if (activeData.groupId !== overData.groupId || activeData.tag !== overData.tag) return;

      const group = groups.find((candidate) => candidate.id === activeData.groupId);
      if (!group) return;

      const tag = String(activeData.tag);
      const fillIds = group.fillIds[tag] ?? [];
      const from = fillIds.indexOf(String(activeData.fillId));
      const to = fillIds.indexOf(String(overData.fillId));
      if (from !== -1 && to !== -1 && from !== to) {
        updateGroupFills(group.id, { ...group.fills, [tag]: arrayMove(group.fills[tag] ?? [], from, to) }, { ...group.fillIds, [tag]: arrayMove(fillIds, from, to) });
      }
      return;
    }

    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderGroups(oldIndex, newIndex);
    }
  };

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const confirmAction = (message: string, action: () => void) => {
    setModalConfig({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setModalConfig(null);
      },
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(groups, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "templates_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (!success) alert("Invalid JSON schema provided.");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    clearAll();
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => g.id)}>
          <Stack spacing={2}>
            {groups.map((group) => (
              <GroupEditor key={group.id} group={group} updateGroup={updateGroup} deleteGroup={() => confirmAction(`Are you sure you want to delete the entire "${group.label}" group?`, () => deleteGroup(group.id))} updateGroupFills={(fills) => updateGroupFills(group.id, fills)} confirmAction={confirmAction} editingGroupId={editingGroupId} onExitEdit={clearEditingGroupId} confirmNewGroup={confirmNewGroup} cancelNewGroup={cancelNewGroup} isNewGroup={newGroupPending && editingGroupId === group.id} />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
      <Button
        fullWidth
        variant="outlined"
        className="tmpl-add-group"
        sx={{
          borderStyle: "dashed",
          py: 1.5,
          mt: 2,
        }}
        onClick={addGroup}
      >
        + Add Group
      </Button>
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3, alignItems: "center", justifyContent: "center" }} className="template-actions-row">
        <input type="file" accept=".json" style={{ display: "none" }} ref={fileInputRef} onChange={handleImport} />
        <Button variant="contained" className="template-action-btn" onClick={() => (groups.length > 0 ? confirmAction("Are you sure you want to import templates? This will overwrite all existing templates.", () => fileInputRef.current?.click()) : fileInputRef.current?.click())}>
          Import Templates
        </Button>
        <Button variant="contained" className="template-action-btn" onClick={handleExport}>
          Export Templates
        </Button>
        <Button variant="contained" color="error" className="template-clear-btn" onClick={() => confirmAction("Are you sure you want to clear all templates? This will reset to defaults and cannot be undone.", handleClear)}>
          Clear Templates
        </Button>
      </Stack>

      <ConfirmationModal isOpen={!!modalConfig?.isOpen} message={modalConfig?.message || ""} onConfirm={() => modalConfig?.onConfirm()} onCancel={() => setModalConfig(null)} />
    </Box>
  );
};
