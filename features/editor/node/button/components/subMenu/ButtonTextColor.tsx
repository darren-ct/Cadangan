import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons";
import type { ButtonProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  itemId: string;
}

export const ButtonTextColor = React.memo(function ButtonTextColor({
  itemProps,
  itemId,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();
  return (
    <label htmlFor="text-color">
      <Stack
        direction="row"
        borderRadius={1}
        padding={0.8}
        marginBottom={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          cursor: "pointer",
          backgroundColor: !itemProps ? "#FFFFFF" : itemProps.contentColor,
          border: "1px solid rgba(0,0,0,.6)",
        }}
      >
        <Stack direction="column" sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: "rgba(0,0,0,.8)",
              marginLeft: "4px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Icon & Text Color
          </Typography>
          <Typography
            sx={{ marginTop: 0.5, fontSize: "13px", color: "rgba(0,0,0,.8)" }}
          >
            {!itemProps?.contentColor ? "#FFFFFF" : itemProps.contentColor}
          </Typography>
        </Stack>

        <ChevronDownIcon sx={{ color: "rgba(0,0,0,.6)", fontSize: "18px" }} />

        <TextField
          id="text-color"
          type="color"
          name="contentColor"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(itemId, e.target.name, e.target.value);
          }}
          value={!itemProps ? "#FFFFFF" : itemProps.contentColor}
          sx={{ display: "none" }}
        />
      </Stack>
    </label>
  );
});
