import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ButtonProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  itemId: string;
}

export const ButtonTypes = React.memo(function ButtonTypes({
  itemId,
  itemProps,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();
  return (
    <Stack marginBottom={2}>
      <Typography
        sx={{
          marginBottom: 0.5,
          marginLeft: "6px",
          fontSize: "12px",
          color: " #828282",
          fontWeight: 500,
        }}
      >
        Type
      </Typography>
      <Select
        size="small"
        sx={{ background: "#FAFAFA", fontSize: "12px" }}
        value={!itemProps?.type ? "contained" : itemProps.type}
        name="type"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateDraggableProps(itemId, e.target.name, e.target.value)
        }
      >
        <MenuItem value="contained" sx={{ fontSize: "12px" }}>
          Contained Button
        </MenuItem>
        <MenuItem value="outlined" sx={{ fontSize: "12px" }}>
          Outlined Button
        </MenuItem>
        <MenuItem value="text" sx={{ fontSize: "12px" }}>
          Text Button
        </MenuItem>
      </Select>
    </Stack>
  );
});
