import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ButtonProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  itemId: string;
}

export const ButtonRounding = React.memo(function ButtonRounding({
  itemProps,
  itemId,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  return (
    <Stack marginBottom={2}>
      <Typography
        sx={{
          marginBottom: 1,
          marginLeft: "6px",
          fontSize: "12px",
          color: " #828282",
          fontWeight: 500,
        }}
      >
        Rounding
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} paddingLeft={1}>
        <Slider
          size="small"
          aria-label="Rounding"
          value={itemProps ? itemProps.rounding : 0}
          onChange={(_e: Event, value: number | number[]) => {
            updateDraggableProps(itemId, "rounding", value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          size="small"
          inputProps={{ style: { fontSize: 12 } }}
          sx={{
            width: "100px",
            backgroundColor: "#FAFAFA",
            border: "none",
          }}
          value={itemProps ? itemProps.rounding : "0"}
          name="rounding"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            !isNaN(Number(e.target.value)) &&
            updateDraggableProps(itemId, e.target.name, Number(e.target.value))
          }
        />
      </Stack>
    </Stack>
  );
});
