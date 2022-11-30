import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { GroupIcon } from "@/assets/icons";
import { HideFieldsMenu } from "@/widgets/features/master/menu";
import { Field, ToolbarHiddenFieldsValue } from "@/widgets/types";

interface Props {
  value: ToolbarHiddenFieldsValue[];
  onChange: (values: ToolbarHiddenFieldsValue[]) => void;
  fields: Field[];
}

export const KanbanHideFields = React.memo(function KanbanHideFields({
  fields,
  onChange,
  value,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleSortMenuClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSortMenuOpen: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback((e) => {
      setAnchorEl(e.currentTarget as HTMLElement);
    }, []);

  const hiddenFields = React.useMemo(() => {
    if (!value) return [];

    return value.filter((item) => !item.isVisible);
  }, [value]);

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
        Hidden Field
      </Typography>
      <Button
        onClick={handleSortMenuOpen}
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
        <GroupIcon
          sx={{
            marginRight: 0.5,
            fontSize: 18,
          }}
        />
        {`${hiddenFields.length} hidden field`}
      </Button>
      <HideFieldsMenu
        anchorEl={anchorEl}
        fields={fields}
        onChange={onChange}
        onClose={handleSortMenuClose}
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
    </Stack>
  );
});
