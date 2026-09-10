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
  onToggleStar: (tag: string, fillId: string) => void;
}

export const FillValuePanel: React.FC<FillValuePanelProps> = ({ group, groupTags, onAddValue, onUpdateValue, onDeleteValue, onToggleStar }) => {
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
          const fills = (group.fills || {})[tag] ?? [];
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
              {fills.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  No fill values yet. This fill will appear as a custom text input in the{" "}
                  <Link component={RouterLink} to="/output">
                    Output page
                  </Link>
                  .
                </Typography>
              ) : (
                <SortableContext items={fills.map((f) => `fill:${group.id}:${f.id}`)}>
                  {fills.map((fill, idx) => {
                    const isStarred = fill.starred ?? false;
                    return (
                      <SortableFillRow
                        key={fill.id}
                        id={`fill:${group.id}:${fill.id}`}
                        groupId={group.id}
                        fillId={fill.id}
                        tag={tag}
                        index={idx}
                        value={fill.text}
                        onChange={(v) => onUpdateValue(tag, idx, v)}
                        onDelete={() => onDeleteValue(tag, idx)}
                        isStarred={isStarred}
                        onToggleStar={() => onToggleStar(tag, fill.id)}
                      />
                    );
                  })}
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
