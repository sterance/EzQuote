import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Divider, Link } from "@mui/material";
import { SortableContext } from "@dnd-kit/sortable";
import type { ButtonGroup } from "../types";
import { SortableFillRow } from "./SortableFillRow";

interface FillValuePanelProps {
  group: ButtonGroup;
  groupTags: string[];
  onAddValue: (tag: string) => void;
  onUpdateValue: (tag: string, index: number, value: string) => void;
  onDeleteValue: (tag: string, index: number) => void;
}

export const FillValuePanel: React.FC<FillValuePanelProps> = ({ group, groupTags, onAddValue, onUpdateValue, onDeleteValue }) => {
  return (
    <Box
      className="tmpl-fill-panel"
      sx={{
        p: 2,
        bgcolor: "var(--surface-muted)",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {groupTags.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          No variables in this template yet. Add {"{tag}"} placeholders using "Insert Variable" in Edit mode.
        </Typography>
      ) : (
        groupTags.map((tag) => {
          const list = (group.fills || {})[tag] ?? [];
          const fillIds = (group.fillIds || {})[tag] ?? [];
          return (
            <Box
              key={tag}
              sx={{
                flex: 1,
                p: 1.5,
                border: 1,
                borderColor: "var(--border)",
                borderRadius: 1,
                bgcolor: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", textTransform: "capitalize", textAlign: "center" }}>
                {tag}
              </Typography>
              <Divider />
              {list.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  No fill values yet. This fill will appear as a custom text input in the{" "}
                  <Link component={RouterLink} to="/output">
                    Output page
                  </Link>
                  .
                </Typography>
              ) : (
                <SortableContext items={list.map((_, i) => `fill:${group.id}:${fillIds[i]}`)}>
                  {list.map((value, idx) => (
                    <SortableFillRow key={fillIds[idx]} id={`fill:${group.id}:${fillIds[idx]}`} groupId={group.id} fillId={fillIds[idx]} tag={tag} index={idx} value={value} onChange={(v) => onUpdateValue(tag, idx, v)} onDelete={() => onDeleteValue(tag, idx)} />
                  ))}
                </SortableContext>
              )}
              <Button
                size="small"
                variant="outlined"
                sx={{
                  alignSelf: "center",
                  borderStyle: "dashed",
                }}
                onClick={() => onAddValue(tag)}
              >
                + Add Value
              </Button>
            </Box>
          );
        })
      )}
    </Box>
  );
};
