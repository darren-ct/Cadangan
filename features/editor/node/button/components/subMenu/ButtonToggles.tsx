import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ButtonProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  itemId: string;
}

export const ButtonToggles = React.memo(function ButtonToggles({
  itemProps,
  itemId,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();
  return (
    <React.Fragment>
      <Stack
        marginBottom={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          sx={{
            marginBottom: 1,
            marginLeft: "6px",
            fontSize: "12px",
            color: " #828282",
            fontWeight: 500,
          }}
        >
          Shadow
        </Typography>
        <Switch
          size="small"
          name="isShadow"
          checked={itemProps?.isShadow ? itemProps.isShadow : false}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            updateDraggableProps(itemId, e.target.name, checked);
          }}
        />
      </Stack>

      <Stack
        marginBottom={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          sx={{
            marginBottom: 1,
            marginLeft: "6px",
            fontSize: "12px",
            color: " #828282",
            fontWeight: 500,
          }}
        >
          Uppercase
        </Typography>
        <Switch
          size="small"
          name="isUppercase"
          checked={itemProps?.isUppercase ? itemProps.isUppercase : false}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            updateDraggableProps(itemId, e.target.name, checked);
          }}
        />
      </Stack>
    </React.Fragment>
  );
});
