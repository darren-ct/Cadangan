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

export const ButtonColor = React.memo(function ButtonColor({
  itemProps,
  itemId,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  return (
    <label htmlFor="button-color">
      <Stack
        direction="row"
        borderRadius={1}
        padding={0.8}
        marginBottom={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          cursor: "pointer",
          backgroundColor: !itemProps?.buttonColor
            ? "#FFA500"
            : itemProps.buttonColor,
        }}
      >
        <Stack direction="column" sx={{ flex: 1 }}>
          <Typography
            sx={(theme) => ({
              color: "white",
              marginLeft: "4px",
              fontSize: theme.typography.fontSize,
              fontWeight: 500,
            })}
          >
            Button Color
          </Typography>
          <Typography
            sx={(theme) => ({
              marginTop: 0.5,
              fontSize: theme.typography.fontSize + 1,
              color: "white",
            })}
          >
            {!itemProps?.buttonColor ? "#FFA500" : itemProps.buttonColor}
          </Typography>
        </Stack>

        <ChevronDownIcon sx={{ color: "white", fontSize: "18px" }} />

        <TextField
          id="button-color"
          type="color"
          name="buttonColor"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(itemId, e.target.name, e.target.value);
          }}
          value={!itemProps ? "#FFA500" : itemProps.buttonColor}
          sx={{ padding: "0px", display: "none" }}
        />
      </Stack>
    </label>
  );
});
