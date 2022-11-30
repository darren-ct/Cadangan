import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { usePopover } from "@/hooks";
import type { Field } from "@/widgets/types";

import { StackingFieldsMenu } from "./helpers";

interface Props {
  value: Field;
  fields: Field[];
  onChange: (field: Field) => void;
}

export const KanbanStackingField = React.memo(function KanbanStackingField({
  value,
  fields,
  onChange,
}: Props) {
  const { anchorEl, onClosePopover, onOpenPopover } = usePopover();

  return (
    <Stack direction="row" alignItems="center" sx={{ marginBottom: 1 }}>
      <Typography
        sx={(theme) => ({
          marginBottom: 1,
          flex: 1,
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          color: "#828282",
        })}
      >
        Stacking Field
      </Typography>
      <Button
        onClick={onOpenPopover}
        sx={(theme) => ({
          color: theme.palette.text.primary,
          textTransform: "none",
          border: `1px solid ${theme.palette.grey[400]}`,
          fontSize: theme.typography.fontSize - 1,
          justifyContent: "start",
          width: "165px",
        })}
        disableElevation
        disableRipple
      >
        {value?.name ?? "No picked field yet"}
      </Button>
      {anchorEl && (
        <StackingFieldsMenu
          anchorEl={anchorEl}
          fields={fields}
          onChange={onChange}
          onClose={onClosePopover}
          value={value}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        />
      )}
    </Stack>
  );
});
