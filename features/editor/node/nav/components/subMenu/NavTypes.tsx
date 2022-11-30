import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable, NavProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  item: Draggable;
  itemProps: NavProps;
}

export const NavTypes = React.memo(function NavTypes({
  item,
  itemProps,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  return (
    <Stack>
      <React.Fragment>
        <Typography
          sx={(theme) => ({
            marginBottom: "4px",
            color: "#828282",
            fontWeight: 500,
            fontSize: theme.typography.fontSize,
          })}
        >
          Sub-Type
        </Typography>
        <Select
          size="small"
          sx={(theme) => ({
            background: "#FAFAFA",
            fontSize: theme.typography.fontSize,
          })}
          value={!itemProps?.type ? "classic" : itemProps.type}
          name="type"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateDraggableProps(item.id, e.target.name, e.target.value)
          }
        >
          <MenuItem
            value="classic"
            sx={(theme) => ({
              fontSize: theme.typography.fontSize,
            })}
          >
            Classic Nav-Bar
          </MenuItem>
          <MenuItem
            value="search"
            sx={(theme) => ({
              fontSize: theme.typography.fontSize,
            })}
          >
            Search Nav-Bar
          </MenuItem>
        </Select>
      </React.Fragment>
    </Stack>
  );
});
